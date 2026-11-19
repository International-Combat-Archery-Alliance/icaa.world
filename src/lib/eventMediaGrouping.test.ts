import { describe, expect, it } from 'bun:test';
import type { components } from '@/api/events-v1';
import {
  groupEventMediaItems,
  resolveMediaRender,
  type EventFileAsset,
} from '@/lib/eventMediaGrouping';

type EventMediaItem = components['schemas']['EventMediaItem'];

function mediaItem(
  overrides: Partial<EventMediaItem> & Pick<EventMediaItem, 'type' | 'source'>,
): EventMediaItem {
  return { id: crypto.randomUUID(), ...overrides };
}

function fileAsset(
  name: string,
  contentType: string,
  url: string,
  size = 1024,
): EventFileAsset {
  return { type: 'file', name, contentType, url, size, path: '/images/events' };
}

const YOUTUBE_WATCH = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const TWITCH_VOD = 'https://www.twitch.tv/videos/987654321';
const UNSUPPORTED_VIDEO = 'https://vimeo.com/123456789';

const ASSETS_CDN_URL = 'https://assets.icaa.world';
const RENDER_OPTIONS = { assetsCdnUrl: ASSETS_CDN_URL };

describe('resolveMediaRender: videos', () => {
  it('embeds a recognized provider URL by default', () => {
    const render = resolveMediaRender(
      mediaItem({ type: 'video', source: YOUTUBE_WATCH }),
    );
    expect(render).toMatchObject({
      section: 'videos',
      mode: 'embed',
      embedData: { service: 'youtube' },
    });
  });

  it('embeds when displayMode is explicitly embed', () => {
    const render = resolveMediaRender(
      mediaItem({ type: 'video', source: TWITCH_VOD, displayMode: 'embed' }),
    );
    expect(render).toMatchObject({
      section: 'videos',
      mode: 'embed',
      embedData: { service: 'twitch' },
    });
  });

  it('ignores display modes that do not apply to videos', () => {
    const render = resolveMediaRender(
      mediaItem({
        type: 'video',
        source: YOUTUBE_WATCH,
        displayMode: 'carousel',
      }),
    );
    expect(render).toMatchObject({ section: 'videos', mode: 'embed' });
  });

  it('renders link mode as a validated link', () => {
    const render = resolveMediaRender(
      mediaItem({ type: 'video', source: YOUTUBE_WATCH, displayMode: 'link' }),
    );
    expect(render).toEqual({
      section: 'videos',
      mode: 'link',
      url: YOUTUBE_WATCH,
    });
  });

  it('degrades unsupported hosts to a link', () => {
    const render = resolveMediaRender(
      mediaItem({ type: 'video', source: UNSUPPORTED_VIDEO }),
    );
    expect(render).toEqual({
      section: 'videos',
      mode: 'link',
      url: UNSUPPORTED_VIDEO,
    });
  });

  it('hides invalid sources', () => {
    expect(
      resolveMediaRender(
        mediaItem({ type: 'video', source: 'javascript:alert(1)' }),
      ),
    ).toEqual({ section: 'hidden' });
    expect(
      resolveMediaRender(
        mediaItem({
          type: 'video',
          source: 'javascript:alert(1)',
          displayMode: 'link',
        }),
      ),
    ).toEqual({ section: 'hidden' });
  });

  it('links valid but unsupported hosts in link mode', () => {
    expect(
      resolveMediaRender(
        mediaItem({
          type: 'video',
          source: UNSUPPORTED_VIDEO,
          displayMode: 'link',
        }),
      ),
    ).toEqual({
      section: 'videos',
      mode: 'link',
      url: UNSUPPORTED_VIDEO,
    });
  });
});

describe('resolveMediaRender: asset folders', () => {
  const folder = mediaItem({
    type: 'asset_folder',
    source: '/images/events/boston-2026',
  });

  const threeImages = [
    fileAsset('c.jpg', 'image/jpeg', 'https://assets.icaa.world/c.jpg'),
    fileAsset('a.png', 'image/png', 'https://assets.icaa.world/a.png'),
    fileAsset('b.webp', 'image/webp', 'https://assets.icaa.world/b.webp'),
  ];
  const pdf = fileAsset(
    'bracket.pdf',
    'application/pdf',
    'https://assets.icaa.world/bracket.pdf',
  );

  it('uses a carousel for three or more images', () => {
    const render = resolveMediaRender(folder, threeImages);
    expect(render).toMatchObject({ section: 'folders', mode: 'carousel' });
    if (render.section !== 'folders') throw new Error('expected folder render');
    expect(render.images).toHaveLength(3);
  });

  it('uses a gallery for one or two images', () => {
    const render = resolveMediaRender(folder, threeImages.slice(0, 2));
    expect(render).toMatchObject({ section: 'folders', mode: 'gallery' });
  });

  it('keeps non-image files beside an image gallery', () => {
    const render = resolveMediaRender(folder, [threeImages[0], pdf]);
    expect(render).toMatchObject({ section: 'folders', mode: 'gallery' });
    if (render.section !== 'folders') throw new Error('expected folder render');
    expect(render.images).toHaveLength(1);
    expect(render.otherFiles.map((asset) => asset.name)).toEqual([
      'bracket.pdf',
    ]);
  });

  it('sorts other files alphabetically in mixed folders', () => {
    const render = resolveMediaRender(folder, [
      fileAsset(
        'zebra.pdf',
        'application/pdf',
        'https://assets.icaa.world/z.pdf',
      ),
      threeImages[0],
      fileAsset(
        'alpha.pdf',
        'application/pdf',
        'https://assets.icaa.world/a.pdf',
      ),
    ]);
    expect(render).toMatchObject({ section: 'folders', mode: 'gallery' });
    if (render.section !== 'folders') throw new Error('expected folder render');
    expect(render.otherFiles.map((asset) => asset.name)).toEqual([
      'alpha.pdf',
      'zebra.pdf',
    ]);
  });

  it('uses a file list when the folder has no images', () => {
    const render = resolveMediaRender(folder, [pdf]);
    expect(render).toMatchObject({ section: 'folders', mode: 'file_list' });
  });

  it('reports an empty folder', () => {
    expect(resolveMediaRender(folder)).toMatchObject({
      section: 'folders',
      mode: 'empty',
    });
  });

  it('honors gallery mode without images by falling back to files', () => {
    const gallery = { ...folder, displayMode: 'gallery' as const };
    expect(resolveMediaRender(gallery, [pdf])).toMatchObject({
      section: 'folders',
      mode: 'file_list',
    });
    expect(resolveMediaRender(gallery, [])).toMatchObject({
      mode: 'empty',
    });
  });

  it('sorts file lists alphabetically by name', () => {
    const fileList = { ...folder, displayMode: 'file_list' as const };
    const render = resolveMediaRender(fileList, [
      fileAsset(
        'zebra.pdf',
        'application/pdf',
        'https://assets.icaa.world/z.pdf',
      ),
      threeImages[1],
      fileAsset(
        'alpha.pdf',
        'application/pdf',
        'https://assets.icaa.world/a.pdf',
      ),
    ]);
    expect(render).toMatchObject({ section: 'folders', mode: 'file_list' });
    if (render.section !== 'folders') throw new Error('expected folder render');
    expect(render.files.map((asset) => asset.name)).toEqual([
      'a.png',
      'alpha.pdf',
      'zebra.pdf',
    ]);
  });

  it('degrades carousel mode to a gallery below three images', () => {
    const render = resolveMediaRender(
      { ...folder, displayMode: 'carousel' },
      threeImages.slice(0, 2),
    );
    expect(render).toMatchObject({ mode: 'gallery' });
  });

  it('degrades URL-only modes to the automatic renderer', () => {
    expect(
      resolveMediaRender({ ...folder, displayMode: 'embed' }, threeImages),
    ).toMatchObject({ mode: 'carousel' });
    expect(
      resolveMediaRender({ ...folder, displayMode: 'link' }, [pdf]),
    ).toMatchObject({ mode: 'file_list' });
  });

  it('ignores nested folders and files without a URL', () => {
    const nestedFolder = {
      type: 'folder' as const,
      name: 'nested',
      path: '/images/events',
      contentCount: 0,
    };
    const noUrl = fileAsset('broken.jpg', 'image/jpeg', '');
    const render = resolveMediaRender(folder, [nestedFolder, noUrl]);
    expect(render).toMatchObject({ section: 'folders', mode: 'empty' });
  });
});

describe('resolveMediaRender: asset files', () => {
  it('renders known image extensions inline', () => {
    const render = resolveMediaRender(
      mediaItem({
        type: 'asset_file',
        source: 'https://assets.icaa.world/photos/award.JPG',
      }),
      [],
      RENDER_OPTIONS,
    );
    expect(render).toEqual({
      section: 'resources',
      mode: 'image',
      url: 'https://assets.icaa.world/photos/award.JPG',
    });
  });

  it('embeds PDFs with an encoded viewer URL', () => {
    const source = 'https://assets.icaa.world/docs/bracket.pdf';
    const render = resolveMediaRender(
      mediaItem({ type: 'asset_file', source }),
      [],
      RENDER_OPTIONS,
    );
    expect(render).toMatchObject({ section: 'resources', mode: 'pdf' });
    if (render.section !== 'resources' || render.mode !== 'pdf') {
      throw new Error('expected pdf render');
    }
    expect(render.embedData.embed).toBe(
      'https://drive.google.com/viewerng/viewer?embedded=true&url=https%3A%2F%2Fassets.icaa.world%2Fdocs%2Fbracket.pdf',
    );
  });

  it('falls back to a resource link for unknown file types', () => {
    const source = 'https://assets.icaa.world/files/results';
    expect(
      resolveMediaRender(
        mediaItem({ type: 'asset_file', source }),
        [],
        RENDER_OPTIONS,
      ),
    ).toEqual({ section: 'resources', mode: 'link', url: source });
  });

  it('only reads the extension from the pathname', () => {
    const source = 'https://assets.icaa.world/download?file=photo.jpg';
    expect(
      resolveMediaRender(
        mediaItem({ type: 'asset_file', source }),
        [],
        RENDER_OPTIONS,
      ),
    ).toMatchObject({ mode: 'link' });
  });

  it('honors link mode for renderable files', () => {
    const source = 'https://assets.icaa.world/photo.png';
    expect(
      resolveMediaRender(
        mediaItem({ type: 'asset_file', source, displayMode: 'link' }),
        [],
        RENDER_OPTIONS,
      ),
    ).toEqual({ section: 'resources', mode: 'link', url: source });
  });

  it('classifies using the automatic renderer for folder-only modes', () => {
    const source = 'https://assets.icaa.world/photo.avif';
    expect(
      resolveMediaRender(
        mediaItem({ type: 'asset_file', source, displayMode: 'gallery' }),
        [],
        RENDER_OPTIONS,
      ),
    ).toMatchObject({ mode: 'image' });
  });

  it('degrades an off-origin image to a link', () => {
    const source = 'https://evil.example.com/photo.jpg';
    expect(
      resolveMediaRender(
        mediaItem({ type: 'asset_file', source }),
        [],
        RENDER_OPTIONS,
      ),
    ).toEqual({ section: 'resources', mode: 'link', url: source });
  });

  it('degrades an off-origin PDF to a link', () => {
    const source = 'https://evil.example.com/doc.pdf';
    expect(
      resolveMediaRender(
        mediaItem({ type: 'asset_file', source }),
        [],
        RENDER_OPTIONS,
      ),
    ).toEqual({ section: 'resources', mode: 'link', url: source });
  });

  it('fails closed when the CDN URL is missing or malformed', () => {
    const source = 'https://assets.icaa.world/photo.jpg';
    for (const assetsCdnUrl of ['', 'not a url']) {
      expect(
        resolveMediaRender(mediaItem({ type: 'asset_file', source }), [], {
          assetsCdnUrl,
        }),
      ).toEqual({ section: 'resources', mode: 'link', url: source });
    }
  });

  it('hides invalid sources', () => {
    expect(
      resolveMediaRender(
        mediaItem({ type: 'asset_file', source: 'data:text/html,hello' }),
        [],
        RENDER_OPTIONS,
      ),
    ).toEqual({ section: 'hidden' });
  });
});

describe('resolveMediaRender: external links', () => {
  it('renders external links as resource links', () => {
    const source = 'https://example.com/bracket';
    expect(
      resolveMediaRender(mediaItem({ type: 'external_link', source })),
    ).toEqual({ section: 'resources', mode: 'link', url: source });
  });

  it('degrades embed mode to a resource link', () => {
    const source = 'https://example.com/standings';
    expect(
      resolveMediaRender(
        mediaItem({ type: 'external_link', source, displayMode: 'embed' }),
      ),
    ).toEqual({ section: 'resources', mode: 'link', url: source });
  });

  it('hides invalid sources', () => {
    expect(
      resolveMediaRender(
        mediaItem({ type: 'external_link', source: 'javascript:alert(1)' }),
      ),
    ).toEqual({ section: 'hidden' });
  });
});

describe('groupEventMediaItems', () => {
  it('partitions items by section and preserves admin order', () => {
    const items = [
      mediaItem({ type: 'external_link', source: 'https://example.com/one' }),
      mediaItem({ type: 'video', source: YOUTUBE_WATCH }),
      mediaItem({ type: 'asset_folder', source: '/images/events/one' }),
      mediaItem({
        type: 'asset_file',
        source: 'https://assets.icaa.world/a.pdf',
      }),
      mediaItem({ type: 'asset_folder', source: '/images/events/two' }),
      mediaItem({ type: 'video', source: TWITCH_VOD }),
    ];

    const groups = groupEventMediaItems(items);

    expect(groups.videoItems.map((item) => item.source)).toEqual([
      YOUTUBE_WATCH,
      TWITCH_VOD,
    ]);
    expect(groups.folderItems.map((item) => item.source)).toEqual([
      '/images/events/one',
      '/images/events/two',
    ]);
    expect(groups.resourceItems.map((item) => item.type)).toEqual([
      'external_link',
      'asset_file',
    ]);
    expect(groups.videoItems[0].id).toBe(items[1].id);
  });

  it('returns empty groups for events without media', () => {
    expect(groupEventMediaItems([])).toEqual({
      videoItems: [],
      folderItems: [],
      resourceItems: [],
    });
  });
});
