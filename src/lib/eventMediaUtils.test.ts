import { describe, expect, it } from 'bun:test';
import {
  EVENT_MEDIA_DISPLAY_MODE_OPTIONS,
  EVENT_MEDIA_ICON_OPTIONS,
  EVENT_MEDIA_TYPE_OPTIONS,
  MAX_EVENT_MEDIA_SOURCE_LENGTH,
  createEventMediaItemSchema,
  findDuplicateMediaItemIds,
  isEventMediaUrl,
  supportsDisplayMode,
  toEventMediaFormItem,
  toEventMediaPayload,
  type EventMediaFormItem,
} from '@/lib/eventMediaUtils';

const MEDIA_ID = '8a7bf642-8a30-4c38-a73c-bb8da871e81f';
const OTHER_MEDIA_ID = '42a1b918-85f3-498f-a9aa-df7bc3658188';

const schema = createEventMediaItemSchema();

function formItem(
  overrides: Partial<EventMediaFormItem> = {},
): EventMediaFormItem {
  return {
    id: MEDIA_ID,
    type: 'asset_folder',
    source: '/images/events/boston-2026',
    title: '',
    description: '',
    displayMode: 'auto',
    icon: 'auto',
    ...overrides,
  };
}

describe('media option lists', () => {
  it('lists every media type', () => {
    expect(EVENT_MEDIA_TYPE_OPTIONS.map((option) => option.value)).toEqual([
      'asset_folder',
      'asset_file',
      'video',
      'external_link',
    ]);
  });

  it('lists Automatic first among the icon presets', () => {
    expect(EVENT_MEDIA_ICON_OPTIONS.map((option) => option.value)).toEqual([
      'auto',
      'youtube',
      'twitch',
      'google_drive',
      'instagram',
      'pdf',
      'photo_gallery',
      'file',
      'video',
      'external_link',
    ]);
  });

  it('limits display modes per type', () => {
    expect(
      EVENT_MEDIA_DISPLAY_MODE_OPTIONS.asset_folder.map((o) => o.value),
    ).toEqual(['auto', 'carousel', 'gallery', 'file_list']);
    expect(
      EVENT_MEDIA_DISPLAY_MODE_OPTIONS.external_link.map((o) => o.value),
    ).toEqual(['auto', 'link']);
  });

  it('reports which display modes a type supports', () => {
    expect(supportsDisplayMode('asset_folder', 'gallery')).toBe(true);
    expect(supportsDisplayMode('asset_folder', 'embed')).toBe(false);
    expect(supportsDisplayMode('video', 'embed')).toBe(true);
    expect(supportsDisplayMode('external_link', 'carousel')).toBe(false);
  });
});

describe('isEventMediaUrl', () => {
  it.each([
    'https://example.com/bracket.pdf',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://cdn.assets.icaa.world/file.png',
  ])('accepts %s', (url) => {
    expect(isEventMediaUrl(url)).toBe(true);
  });

  it('rejects http by default', () => {
    expect(isEventMediaUrl('http://example.com/page')).toBe(false);
  });

  it('allows loopback http when enabled', () => {
    const options = { allowLoopbackHttp: true };
    expect(isEventMediaUrl('http://localhost:3000/page', options)).toBe(true);
    expect(isEventMediaUrl('http://127.0.0.1/file.pdf', options)).toBe(true);
    expect(isEventMediaUrl('http://[::1]:3000/video.mp4', options)).toBe(true);
    expect(isEventMediaUrl('http://example.com/page', options)).toBe(false);
  });

  it('rejects IPv6 loopback http outside development', () => {
    expect(isEventMediaUrl('http://[::1]:3000/video.mp4')).toBe(false);
  });

  it('rejects control characters', () => {
    expect(isEventMediaUrl('https://example.com/\u0000file.pdf')).toBe(false);
    expect(isEventMediaUrl('https://example.com/\u0007file.pdf')).toBe(false);
  });

  it('rejects empty-credential userinfo like the Go backend', () => {
    expect(isEventMediaUrl('https://@example.com/path')).toBe(false);
    expect(
      isEventMediaUrl('http://@localhost:3000/video.mp4', {
        allowLoopbackHttp: true,
      }),
    ).toBe(false);
  });

  it.each([
    '',
    'not a url',
    '/images/events',
    '//example.com/page',
    'javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'file:///etc/passwd',
    'https://user:pass@example.com/page',
    'https://example.com/a b',
    'https://example.com/a\\b',
  ])('rejects %p', (url) => {
    expect(isEventMediaUrl(url)).toBe(false);
  });
});

describe('createEventMediaItemSchema', () => {
  it('accepts a folder item', () => {
    expect(schema.safeParse(formItem()).success).toBe(true);
  });

  it('accepts Automatic as an icon override placeholder', () => {
    expect(schema.safeParse(formItem({ icon: 'auto' })).success).toBe(true);
  });

  it('trims the source', () => {
    const parsed = schema.parse(formItem({ source: '  /images/events  ' }));
    expect(parsed.source).toBe('/images/events');
  });

  it('rejects an empty source', () => {
    const result = schema.safeParse(formItem({ source: '   ' }));
    expect(result.success).toBe(false);
  });

  it('rejects a source longer than the limit', () => {
    const source = `/${'a'.repeat(MAX_EVENT_MEDIA_SOURCE_LENGTH)}`;
    const result = schema.safeParse(formItem({ source }));
    expect(result.success).toBe(false);
  });

  it.each([
    'images',
    '/images/',
    '/images//events',
    '/images/../events',
    '/a\\b',
  ])('rejects invalid folder source %p', (source) => {
    const result = schema.safeParse(formItem({ source }));
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['source']);
  });

  it('rejects a URL as an asset folder source', () => {
    const result = schema.safeParse(
      formItem({ source: 'https://cdn.example.com/folder' }),
    );
    expect(result.success).toBe(false);
  });

  it('rejects a folder path as a URL source', () => {
    const result = schema.safeParse(
      formItem({ type: 'video', source: '/images/events' }),
    );
    expect(result.success).toBe(false);
  });

  it('accepts https sources for URL types', () => {
    for (const type of ['asset_file', 'video', 'external_link'] as const) {
      const result = schema.safeParse(
        formItem({ type, source: 'https://example.com/resource' }),
      );
      expect(result.success).toBe(true);
    }
  });

  it('rejects URLs with credentials', () => {
    const result = schema.safeParse(
      formItem({ type: 'external_link', source: 'https://a:b@example.com/x' }),
    );
    expect(result.success).toBe(false);
  });

  it('rejects http URLs unless loopback is allowed', () => {
    const item = formItem({
      type: 'external_link',
      source: 'http://localhost:3000/page',
    });
    expect(schema.safeParse(item).success).toBe(false);
    expect(
      createEventMediaItemSchema({ allowLoopbackHttp: true }).safeParse(item)
        .success,
    ).toBe(true);
  });

  it('rejects overlength titles and descriptions', () => {
    expect(schema.safeParse(formItem({ title: 'a'.repeat(256) })).success).toBe(
      false,
    );
    expect(
      schema.safeParse(formItem({ description: 'a'.repeat(1001) })).success,
    ).toBe(false);
  });

  it('rejects unknown enum values', () => {
    expect(
      schema.safeParse({
        ...formItem(),
        type: 'document',
      }).success,
    ).toBe(false);
    expect(
      schema.safeParse({
        ...formItem(),
        icon: 'vimeo',
      }).success,
    ).toBe(false);
  });
});

describe('toEventMediaFormItem', () => {
  it('fills defaults for omitted presentation fields', () => {
    expect(
      toEventMediaFormItem({
        id: MEDIA_ID,
        type: 'video',
        source: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      }),
    ).toEqual({
      id: MEDIA_ID,
      type: 'video',
      source: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      title: '',
      description: '',
      displayMode: 'auto',
      icon: 'auto',
    });
  });

  it('preserves stored presentation fields', () => {
    expect(
      toEventMediaFormItem({
        id: MEDIA_ID,
        type: 'asset_folder',
        source: '/images/events',
        title: 'Event Photos',
        description: 'Finals and podium',
        displayMode: 'carousel',
        icon: 'photo_gallery',
      }),
    ).toMatchObject({
      title: 'Event Photos',
      description: 'Finals and podium',
      displayMode: 'carousel',
      icon: 'photo_gallery',
    });
  });
});

describe('toEventMediaPayload', () => {
  it('drops empty titles and descriptions', () => {
    expect(toEventMediaPayload([formItem()])).toEqual([
      {
        id: MEDIA_ID,
        type: 'asset_folder',
        source: '/images/events/boston-2026',
        title: undefined,
        description: undefined,
        displayMode: 'auto',
        icon: undefined,
      },
    ]);
  });

  it('trims and keeps non-empty titles and descriptions', () => {
    const [payload] = toEventMediaPayload([
      formItem({ title: '  Event Photos  ', description: '  Finals  ' }),
    ]);
    expect(payload?.title).toBe('Event Photos');
    expect(payload?.description).toBe('Finals');
  });

  it('maps Automatic to no stored icon', () => {
    const [automatic] = toEventMediaPayload([formItem({ icon: 'auto' })]);
    expect(automatic?.icon).toBeUndefined();

    const [explicit] = toEventMediaPayload([formItem({ icon: 'pdf' })]);
    expect(explicit?.icon).toBe('pdf');
  });
});

describe('findDuplicateMediaItemIds', () => {
  it('flags every item that repeats a type and source', () => {
    const duplicates = findDuplicateMediaItemIds([
      formItem(),
      formItem({ id: OTHER_MEDIA_ID }),
      formItem({ id: MEDIA_ID, type: 'video', source: 'https://example.com' }),
    ]);

    expect(duplicates).toEqual(new Set([MEDIA_ID, OTHER_MEDIA_ID]));
  });

  it('ignores empty sources', () => {
    expect(
      findDuplicateMediaItemIds([
        formItem({ source: '' }),
        formItem({ id: OTHER_MEDIA_ID, source: '  ' }),
      ]),
    ).toEqual(new Set());
  });
});
