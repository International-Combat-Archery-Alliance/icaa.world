import { describe, expect, it } from 'bun:test';
import {
  buildEventMediaEmbedData,
  parseTwitchUrl,
  parseYouTubeUrl,
  resolveMediaIcon,
} from '@/lib/embedUtils';

const YOUTUBE_WATCH = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
const TWITCH_HOST = 'icaa.world';

describe('buildEventMediaEmbedData: YouTube', () => {
  it('embeds a watch URL', () => {
    expect(buildEventMediaEmbedData(YOUTUBE_WATCH)).toMatchObject({
      service: 'youtube',
      embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      width: 560,
      height: 315,
    });
  });

  it('embeds a watch URL that carries a playlist', () => {
    const embed = buildEventMediaEmbedData(
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL1234567890abcdef',
    );
    expect(embed?.embed).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ?list=PL1234567890abcdef',
    );
  });

  it('embeds a youtu.be URL', () => {
    expect(
      buildEventMediaEmbedData('https://youtu.be/dQw4w9WgXcQ')?.embed,
    ).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('embeds a youtu.be URL that carries a playlist', () => {
    const embed = buildEventMediaEmbedData(
      'https://youtu.be/dQw4w9WgXcQ?list=PL1234567890abcdef',
    );
    expect(embed?.embed).toBe(
      'https://www.youtube.com/embed/dQw4w9WgXcQ?list=PL1234567890abcdef',
    );
  });

  it('embeds a shorts URL', () => {
    expect(
      buildEventMediaEmbedData('https://www.youtube.com/shorts/dQw4w9WgXcQ')
        ?.embed,
    ).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('embeds a live URL', () => {
    expect(
      buildEventMediaEmbedData('https://www.youtube.com/live/dQw4w9WgXcQ')
        ?.embed,
    ).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('embeds a playlist URL', () => {
    expect(
      buildEventMediaEmbedData(
        'https://www.youtube.com/playlist?list=PL1234567890abcdef',
      )?.embed,
    ).toBe('https://www.youtube.com/embed/videoseries?list=PL1234567890abcdef');
  });

  it('upgrades http fixture URLs to an https embed', () => {
    expect(
      buildEventMediaEmbedData('http://www.youtube.com/watch?v=dQw4w9WgXcQ')
        ?.embed,
    ).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it('matches hostnames case-insensitively', () => {
    expect(
      buildEventMediaEmbedData('https://WWW.YouTube.COM/watch?v=dQw4w9WgXcQ')
        ?.embed,
    ).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');
  });

  it.each([
    'https://www.youtube.com/watch',
    'https://www.youtube.com/watch?v=short',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=bad',
    'https://www.youtube.com/shorts/dQw4w9WgXcQ/extra',
    'https://www.youtube.com/live/',
    'https://www.youtube.com/playlist',
    'https://www.youtube.com/playlist?list=bad',
    'https://youtu.be/dQw4w9WgXcQ/extra',
    'https://youtu.be/playlist?list=PL1234567890abcdef',
    'https://youtu.be/videoseries',
    'https://youtu.be/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/@Icaa-world/streams',
    'https://www.youtube.com/channel/UC1234567890',
  ])('rejects unsupported YouTube shape %s', (url) => {
    expect(buildEventMediaEmbedData(url)).toBeNull();
  });

  it.each([
    'https://evil-youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtube.com.evil.com/watch?v=dQw4w9WgXcQ',
    'https://notyoutube.com/watch?v=dQw4w9WgXcQ',
  ])('rejects substring-spoofed host %s', (url) => {
    expect(buildEventMediaEmbedData(url)).toBeNull();
    expect(parseYouTubeUrl(url)).toBeNull();
  });

  it('rejects credentials and non-standard ports', () => {
    expect(
      buildEventMediaEmbedData(
        'https://user:pass@www.youtube.com/watch?v=dQw4w9WgXcQ',
      ),
    ).toBeNull();
    expect(
      buildEventMediaEmbedData(
        'https://www.youtube.com:8443/watch?v=dQw4w9WgXcQ',
      ),
    ).toBeNull();
  });
});

describe('buildEventMediaEmbedData: Twitch', () => {
  it('embeds a VOD with a prefixed id and no autoplay', () => {
    expect(
      buildEventMediaEmbedData('https://www.twitch.tv/videos/987654321'),
    ).toMatchObject({
      service: 'twitch',
      embed:
        'https://player.twitch.tv/?video=v987654321&parent=localhost&autoplay=false',
      width: 620,
      height: 378,
    });
  });

  it('normalizes an already-prefixed VOD id', () => {
    expect(
      buildEventMediaEmbedData('https://www.twitch.tv/videos/v987654321')
        ?.embed,
    ).toBe(
      'https://player.twitch.tv/?video=v987654321&parent=localhost&autoplay=false',
    );
  });

  it('uses the supplied parent host', () => {
    expect(
      buildEventMediaEmbedData('https://www.twitch.tv/videos/987654321', {
        parentHost: TWITCH_HOST,
      })?.embed,
    ).toBe(
      'https://player.twitch.tv/?video=v987654321&parent=icaa.world&autoplay=false',
    );
  });

  it('embeds a channel clip', () => {
    expect(
      buildEventMediaEmbedData(
        'https://www.twitch.tv/icaa_world/clip/ToughArcher-123abc',
      )?.embed,
    ).toBe(
      'https://clips.twitch.tv/embed?clip=ToughArcher-123abc&parent=localhost&autoplay=false',
    );
  });

  it('embeds a clips.twitch.tv clip', () => {
    expect(
      buildEventMediaEmbedData('https://clips.twitch.tv/ToughArcher-123abc')
        ?.embed,
    ).toBe(
      'https://clips.twitch.tv/embed?clip=ToughArcher-123abc&parent=localhost&autoplay=false',
    );
  });

  it('embeds a live channel', () => {
    expect(
      buildEventMediaEmbedData('https://www.twitch.tv/icaa_world'),
    ).toMatchObject({
      service: 'twitch',
      embed:
        'https://player.twitch.tv/?channel=icaa_world&parent=localhost&autoplay=false',
    });
  });

  it('strips a user-supplied parent parameter', () => {
    const embed = buildEventMediaEmbedData(
      'https://www.twitch.tv/videos/987654321?parent=evil.com',
    );
    expect(embed?.embed).toBe(
      'https://player.twitch.tv/?video=v987654321&parent=localhost&autoplay=false',
    );
    expect(embed?.embed).not.toContain('evil.com');
  });

  it('strips a user-supplied parent parameter from channel URLs', () => {
    const embed = buildEventMediaEmbedData(
      'https://www.twitch.tv/icaa_world?parent=evil.com',
    );
    expect(embed?.embed).toBe(
      'https://player.twitch.tv/?channel=icaa_world&parent=localhost&autoplay=false',
    );
    expect(embed?.embed).not.toContain('evil.com');
  });

  it.each([
    'https://www.twitch.tv/videos',
    'https://www.twitch.tv/videos/abc',
    'https://www.twitch.tv/directory',
    'https://www.twitch.tv/directory/game/Archery',
    'https://www.twitch.tv/clip',
    'https://www.twitch.tv/collections/123',
    'https://www.twitch.tv/search?term=archery',
    'https://www.twitch.tv/settings',
    'https://www.twitch.tv/teams',
    'https://www.twitch.tv/p/legal',
    'https://www.twitch.tv/icaa_world/videos',
    'https://www.twitch.tv/icaa_world/clip',
    'https://www.twitch.tv/icaa_world/clip/',
    'https://clips.twitch.tv/embed',
    'https://clips.twitch.tv/embed?clip=ToughArcher-123abc',
    'https://clips.twitch.tv/ToughArcher-123abc/extra',
  ])('rejects reserved or malformed Twitch path %s', (url) => {
    expect(buildEventMediaEmbedData(url)).toBeNull();
    expect(parseTwitchUrl(url)).toBeNull();
  });

  it('rejects invalid channel logins', () => {
    expect(parseTwitchUrl('https://www.twitch.tv/_icaa')).toBeNull();
    expect(parseTwitchUrl('https://www.twitch.tv/a')).toBeNull();
    expect(
      parseTwitchUrl('https://www.twitch.tv/this_channel_name_is_far_too_long'),
    ).toBeNull();
  });

  it('rejects credentials and non-standard ports', () => {
    expect(
      buildEventMediaEmbedData('https://user:pass@www.twitch.tv/icaa_world'),
    ).toBeNull();
    expect(
      buildEventMediaEmbedData('https://www.twitch.tv:8443/icaa_world'),
    ).toBeNull();
  });

  it('parses each supported Twitch shape into a discriminated target', () => {
    expect(parseTwitchUrl('https://www.twitch.tv/videos/987654321')).toEqual({
      kind: 'video',
      id: '987654321',
    });
    expect(
      parseTwitchUrl(
        'https://www.twitch.tv/icaa_world/clip/ToughArcher-123abc',
      ),
    ).toEqual({ kind: 'clip', id: 'ToughArcher-123abc' });
    expect(parseTwitchUrl('https://www.twitch.tv/icaa_world')).toEqual({
      kind: 'channel',
      id: 'icaa_world',
    });
  });
});

describe('buildEventMediaEmbedData: trailing slashes', () => {
  it.each([
    [
      'https://youtu.be/dQw4w9WgXcQ/',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    ],
    [
      'https://www.youtube.com/live/dQw4w9WgXcQ/',
      'https://www.youtube.com/embed/dQw4w9WgXcQ',
    ],
    [
      'https://www.twitch.tv/icaa_world/',
      'https://player.twitch.tv/?channel=icaa_world&parent=localhost&autoplay=false',
    ],
    [
      'https://www.twitch.tv/videos/987654321/',
      'https://player.twitch.tv/?video=v987654321&parent=localhost&autoplay=false',
    ],
    [
      'https://clips.twitch.tv/AwkwardHelplessSalamanderSwiftRage/',
      'https://clips.twitch.tv/embed?clip=AwkwardHelplessSalamanderSwiftRage&parent=localhost&autoplay=false',
    ],
  ])('embeds %s', (url, expected) => {
    expect(buildEventMediaEmbedData(url)?.embed).toBe(expected);
  });
});

describe('buildEventMediaEmbedData: rejections', () => {
  it.each([
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    '//www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://example.com/video',
    'not a url',
    '',
  ])('rejects %s', (url) => {
    expect(buildEventMediaEmbedData(url)).toBeNull();
  });
});

describe('resolveMediaIcon', () => {
  it('uses an explicit icon override', () => {
    expect(
      resolveMediaIcon({
        type: 'video',
        source: YOUTUBE_WATCH,
        icon: 'twitch',
      }),
    ).toBe('twitch');
  });

  it('detects exact YouTube hosts', () => {
    for (const source of [
      'https://youtube.com/watch?v=dQw4w9WgXcQ',
      YOUTUBE_WATCH,
      'https://youtu.be/dQw4w9WgXcQ',
    ]) {
      expect(resolveMediaIcon({ type: 'video', source })).toBe('youtube');
    }
  });

  it('detects exact Twitch hosts', () => {
    for (const source of [
      'https://twitch.tv/icaa_world',
      'https://www.twitch.tv/videos/987654321',
      'https://clips.twitch.tv/ToughArcher-123abc',
    ]) {
      expect(resolveMediaIcon({ type: 'video', source })).toBe('twitch');
    }
  });

  it('detects Google Drive and Instagram hosts', () => {
    expect(
      resolveMediaIcon({
        type: 'external_link',
        source: 'https://drive.google.com/file/d/123/view',
      }),
    ).toBe('google_drive');
    expect(
      resolveMediaIcon({
        type: 'external_link',
        source: 'https://docs.google.com/document/d/123/edit',
      }),
    ).toBe('google_drive');
    expect(
      resolveMediaIcon({
        type: 'external_link',
        source: 'https://instagram.com/icaa_world',
      }),
    ).toBe('instagram');
    expect(
      resolveMediaIcon({
        type: 'external_link',
        source: 'https://www.instagram.com/icaa_world',
      }),
    ).toBe('instagram');
  });

  it('does not match spoofed platform hosts', () => {
    expect(
      resolveMediaIcon({
        type: 'video',
        source: 'https://evil-youtube.com/watch?v=dQw4w9WgXcQ',
      }),
    ).toBe('video');
    expect(
      resolveMediaIcon({
        type: 'external_link',
        source: 'https://instagram.com.evil.com/icaa_world',
      }),
    ).toBe('external_link');
  });

  it('detects PDFs from the pathname only', () => {
    expect(
      resolveMediaIcon({
        type: 'external_link',
        source: 'https://example.com/bracket.PDF',
      }),
    ).toBe('pdf');
    expect(
      resolveMediaIcon({
        type: 'external_link',
        source: 'https://example.com/search?file=bracket.pdf',
      }),
    ).toBe('external_link');
  });

  it('detects asset folders as photo galleries', () => {
    expect(
      resolveMediaIcon({
        type: 'asset_folder',
        source: '/images/events/boston-2026',
      }),
    ).toBe('photo_gallery');
  });

  it('falls back to the media type', () => {
    expect(
      resolveMediaIcon({
        type: 'asset_file',
        source: 'https://cdn.example.com/photo.jpg',
      }),
    ).toBe('file');
    expect(
      resolveMediaIcon({
        type: 'video',
        source: 'https://vimeo.com/123456789',
      }),
    ).toBe('video');
    expect(
      resolveMediaIcon({
        type: 'external_link',
        source: 'https://example.com/bracket',
      }),
    ).toBe('external_link');
  });

  it('does not let an icon override change embed eligibility', () => {
    const item = {
      type: 'external_link' as const,
      source: 'https://www.twitch.tv/collections/123',
      icon: 'youtube' as const,
    };
    expect(resolveMediaIcon(item)).toBe('youtube');
    expect(buildEventMediaEmbedData(item.source)).toBeNull();
  });
});
