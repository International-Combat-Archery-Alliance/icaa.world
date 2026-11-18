import { z } from 'zod';
import type { components } from '@/api/events-v1';
import { isCanonicalAssetFolderPath } from '@/lib/assetUtils';

type EventMediaItem = components['schemas']['EventMediaItem'];
type EventMediaType = components['schemas']['EventMediaType'];
type EventMediaDisplayMode = components['schemas']['EventMediaDisplayMode'];
type EventMediaIcon = components['schemas']['EventMediaIcon'];

export const MAX_EVENT_MEDIA_ITEMS = 50;
export const MAX_EVENT_MEDIA_SOURCE_LENGTH = 1000;

const MEDIA_TYPES = [
  'asset_folder',
  'asset_file',
  'video',
  'external_link',
] as const satisfies readonly EventMediaType[];

const MEDIA_DISPLAY_MODES = [
  'auto',
  'carousel',
  'gallery',
  'file_list',
  'embed',
  'link',
] as const satisfies readonly EventMediaDisplayMode[];

const MEDIA_ICON_VALUES = [
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
] as const satisfies readonly ('auto' | EventMediaIcon)[];

export type EventMediaTypeValue = (typeof MEDIA_TYPES)[number];
type EventMediaDisplayModeValue = (typeof MEDIA_DISPLAY_MODES)[number];
type EventMediaIconValue = (typeof MEDIA_ICON_VALUES)[number];

const EVENT_MEDIA_TYPE_LABELS: Record<EventMediaTypeValue, string> = {
  asset_folder: 'Asset Folder (Photos / Files)',
  asset_file: 'Single Asset File',
  video: 'Video / Livestream (YouTube / Twitch)',
  external_link: 'External Link',
};

export const EVENT_MEDIA_TYPE_OPTIONS: {
  value: EventMediaTypeValue;
  label: string;
}[] = MEDIA_TYPES.map((value) => ({
  value,
  label: EVENT_MEDIA_TYPE_LABELS[value],
}));

interface EventMediaDisplayModeOption {
  value: EventMediaDisplayModeValue;
  label: string;
}

export const EVENT_MEDIA_DISPLAY_MODE_OPTIONS: Record<
  EventMediaTypeValue,
  readonly EventMediaDisplayModeOption[]
> = {
  asset_folder: [
    { value: 'auto', label: 'Auto' },
    { value: 'carousel', label: 'Carousel' },
    { value: 'gallery', label: 'Gallery Grid' },
    { value: 'file_list', label: 'File List' },
  ],
  asset_file: [
    { value: 'auto', label: 'Auto' },
    { value: 'embed', label: 'Inline Embed' },
    { value: 'link', label: 'Resource Link' },
  ],
  video: [
    { value: 'auto', label: 'Auto (Embed if supported)' },
    { value: 'embed', label: 'Featured Player Embed' },
    { value: 'link', label: 'External Link CTA' },
  ],
  external_link: [
    { value: 'auto', label: 'Auto' },
    { value: 'link', label: 'Resource Link' },
  ],
};

const EVENT_MEDIA_ICON_LABELS: Record<EventMediaIconValue, string> = {
  auto: 'Automatic',
  youtube: 'YouTube',
  twitch: 'Twitch',
  google_drive: 'Google Drive',
  instagram: 'Instagram',
  pdf: 'PDF',
  photo_gallery: 'Photo Gallery',
  file: 'File',
  video: 'Video',
  external_link: 'External Link',
};

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1']);

const FOLDER_SOURCE_ERROR =
  'Use an asset folder path that starts with "/" and has no trailing slash, empty, "." or ".." segments, backslashes, query, or fragment.';

const URL_SOURCE_ERROR =
  'Use an absolute https:// URL without credentials, backslashes, or whitespace.';

export const EVENT_MEDIA_ICON_OPTIONS: {
  value: EventMediaIconValue;
  label: string;
}[] = MEDIA_ICON_VALUES.map((value) => ({
  value,
  label: EVENT_MEDIA_ICON_LABELS[value],
}));

export function supportsDisplayMode(
  type: EventMediaTypeValue,
  displayMode: EventMediaDisplayModeValue,
): boolean {
  return EVENT_MEDIA_DISPLAY_MODE_OPTIONS[type].some(
    (option) => option.value === displayMode,
  );
}

export function isEventMediaUrl(
  value: string,
  options: { allowLoopbackHttp?: boolean } = {},
): boolean {
  if (/\s/.test(value) || value.includes('\\')) {
    return false;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.username !== '' || url.password !== '') {
    return false;
  }

  if (url.protocol === 'https:') {
    return true;
  }

  return (
    options.allowLoopbackHttp === true &&
    url.protocol === 'http:' &&
    LOOPBACK_HOSTS.has(url.hostname)
  );
}

interface EventMediaItemSchemaOptions {
  allowLoopbackHttp?: boolean;
}

export function createEventMediaItemSchema({
  allowLoopbackHttp = false,
}: EventMediaItemSchemaOptions = {}) {
  return z
    .object({
      id: z.uuid(),
      type: z.enum(MEDIA_TYPES),
      source: z
        .string()
        .trim()
        .min(1, 'Source is required.')
        .max(
          MAX_EVENT_MEDIA_SOURCE_LENGTH,
          `Source must be at most ${MAX_EVENT_MEDIA_SOURCE_LENGTH} characters.`,
        ),
      title: z.string().max(255, 'Title must be at most 255 characters.'),
      description: z
        .string()
        .max(1000, 'Description must be at most 1000 characters.'),
      displayMode: z.enum(MEDIA_DISPLAY_MODES),
      icon: z.enum(MEDIA_ICON_VALUES),
    })
    .superRefine((item, ctx) => {
      if (item.type === 'asset_folder') {
        if (!isCanonicalAssetFolderPath(item.source)) {
          ctx.addIssue({
            code: 'custom',
            path: ['source'],
            message: FOLDER_SOURCE_ERROR,
          });
        }
        return;
      }

      if (!isEventMediaUrl(item.source, { allowLoopbackHttp })) {
        ctx.addIssue({
          code: 'custom',
          path: ['source'],
          message: URL_SOURCE_ERROR,
        });
      }
    });
}

export type EventMediaFormItem = z.infer<
  ReturnType<typeof createEventMediaItemSchema>
>;

export function toEventMediaFormItem(item: EventMediaItem): EventMediaFormItem {
  return {
    id: item.id,
    type: item.type,
    source: item.source,
    title: item.title ?? '',
    description: item.description ?? '',
    displayMode: item.displayMode ?? 'auto',
    icon: item.icon ?? 'auto',
  };
}

function trimToUndefined(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed === '' ? undefined : trimmed;
}

export function toEventMediaPayload(
  items: EventMediaFormItem[],
): EventMediaItem[] {
  return items.map((item) => ({
    id: item.id,
    type: item.type,
    source: item.source,
    title: trimToUndefined(item.title),
    description: trimToUndefined(item.description),
    displayMode: item.displayMode,
    icon: item.icon === 'auto' ? undefined : item.icon,
  }));
}

export function findDuplicateMediaItemIds(
  items: Pick<EventMediaFormItem, 'id' | 'type' | 'source'>[],
): Set<string> {
  const idsByKey = new Map<string, string[]>();

  for (const item of items) {
    const source = item.source.trim();
    if (source === '') {
      continue;
    }

    const key = `${item.type}\n${source}`;
    const ids = idsByKey.get(key);
    if (ids) {
      ids.push(item.id);
    } else {
      idsByKey.set(key, [item.id]);
    }
  }

  const duplicateIds = new Set<string>();
  for (const ids of idsByKey.values()) {
    if (ids.length > 1) {
      ids.forEach((id) => duplicateIds.add(id));
    }
  }

  return duplicateIds;
}
