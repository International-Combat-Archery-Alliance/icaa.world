import type { components } from '@/api/events-v1';
import type { Asset } from '@/hooks/useAssets';
import {
  buildEventMediaEmbedData,
  buildPdfEmbedData,
  isPdfUrl,
  parseSafeHttpUrl,
  type EventMediaEmbedData,
} from '@/lib/embedUtils';

export type EventMediaItem = components['schemas']['EventMediaItem'];

export type EventFileAsset = Extract<Asset, { type: 'file' }>;

export type EventFolderMode = 'carousel' | 'gallery' | 'file_list' | 'empty';

export type EventMediaRender =
  | { section: 'videos'; mode: 'embed'; embedData: EventMediaEmbedData }
  | { section: 'videos'; mode: 'link'; url: string }
  | {
      section: 'folders';
      mode: EventFolderMode;
      images: EventFileAsset[];
      files: EventFileAsset[];
      otherFiles: EventFileAsset[];
    }
  | { section: 'resources'; mode: 'image'; url: string }
  | { section: 'resources'; mode: 'pdf'; embedData: EventMediaEmbedData }
  | { section: 'resources'; mode: 'link'; url: string }
  | { section: 'hidden' };

export interface EventMediaGroups {
  videoItems: EventMediaItem[];
  folderItems: EventMediaItem[];
  resourceItems: EventMediaItem[];
}

const IMAGE_PATH = /\.(jpe?g|png|gif|webp|avif|svg)$/i;

function isFileAsset(asset: Asset): asset is EventFileAsset {
  return asset.type === 'file' && asset.url !== '';
}

function isImageAsset(asset: EventFileAsset): boolean {
  return asset.contentType.toLowerCase().startsWith('image/');
}

function inlineAssetOrigin(): string | null {
  const configured = import.meta.env.VITE_ASSETS_CDN_URL;
  if (!configured) return null;

  try {
    return new URL(configured).origin;
  } catch {
    return null;
  }
}

function isRenderableAssetUrl(url: URL): boolean {
  const origin = inlineAssetOrigin();
  return origin === null || url.origin === origin;
}

function resolveFolderMode(
  displayMode: EventMediaItem['displayMode'],
  imageCount: number,
  fileCount: number,
  otherFileCount: number,
): EventFolderMode {
  if (displayMode === 'gallery') {
    if (imageCount > 0) return 'gallery';
    return otherFileCount > 0 ? 'file_list' : 'empty';
  }

  if (displayMode === 'file_list') {
    return fileCount > 0 ? 'file_list' : 'empty';
  }

  if (imageCount >= 3) return 'carousel';
  if (imageCount > 0) return 'gallery';
  if (otherFileCount > 0) return 'file_list';
  return 'empty';
}

function resolveFolderRender(
  item: EventMediaItem,
  assets: Asset[],
): EventMediaRender {
  const fileAssets = assets.filter(isFileAsset);
  const images = fileAssets.filter(isImageAsset);
  const otherFiles = fileAssets.filter((asset) => !isImageAsset(asset));
  const files = [...fileAssets].sort((a, b) => a.name.localeCompare(b.name));

  return {
    section: 'folders',
    mode: resolveFolderMode(
      item.displayMode,
      images.length,
      files.length,
      otherFiles.length,
    ),
    images,
    files,
    otherFiles,
  };
}

function resolveVideoRender(item: EventMediaItem): EventMediaRender {
  const url = parseSafeHttpUrl(item.source);
  if (!url) return { section: 'hidden' };

  if (item.displayMode === 'link') {
    return { section: 'videos', mode: 'link', url: url.href };
  }

  const embedData = buildEventMediaEmbedData(item.source);
  if (embedData) {
    return { section: 'videos', mode: 'embed', embedData };
  }

  return { section: 'videos', mode: 'link', url: url.href };
}

function resolveAssetFileRender(item: EventMediaItem): EventMediaRender {
  const url = parseSafeHttpUrl(item.source);
  if (!url) return { section: 'hidden' };

  if (item.displayMode === 'link' || !isRenderableAssetUrl(url)) {
    return { section: 'resources', mode: 'link', url: url.href };
  }

  if (IMAGE_PATH.test(url.pathname)) {
    return { section: 'resources', mode: 'image', url: url.href };
  }

  if (isPdfUrl(url)) {
    return {
      section: 'resources',
      mode: 'pdf',
      embedData: buildPdfEmbedData(item.source),
    };
  }

  return { section: 'resources', mode: 'link', url: url.href };
}

function resolveExternalLinkRender(item: EventMediaItem): EventMediaRender {
  const url = parseSafeHttpUrl(item.source);
  if (!url) return { section: 'hidden' };
  return { section: 'resources', mode: 'link', url: url.href };
}

export function resolveMediaRender(
  item: EventMediaItem,
  assets: Asset[] = [],
): EventMediaRender {
  switch (item.type) {
    case 'video':
      return resolveVideoRender(item);
    case 'asset_folder':
      return resolveFolderRender(item, assets);
    case 'asset_file':
      return resolveAssetFileRender(item);
    case 'external_link':
      return resolveExternalLinkRender(item);
  }
}

export function groupEventMediaItems(
  items: EventMediaItem[],
): EventMediaGroups {
  const groups: EventMediaGroups = {
    videoItems: [],
    folderItems: [],
    resourceItems: [],
  };

  for (const item of items) {
    switch (item.type) {
      case 'video':
        groups.videoItems.push(item);
        break;
      case 'asset_folder':
        groups.folderItems.push(item);
        break;
      case 'asset_file':
      case 'external_link':
        groups.resourceItems.push(item);
        break;
    }
  }

  return groups;
}
