import type { Asset } from '@/hooks/useAssets';
import type { EventMediaItem } from '@/api/events';
import { isFileAsset, isImageAsset, type AssetFile } from '@/lib/assetUtils';
import {
  buildEventMediaEmbedData,
  buildPdfEmbedData,
  isPdfUrl,
  parseSafeHttpUrl,
  type EventMediaEmbedData,
} from '@/lib/embedUtils';

export type { EventMediaItem };

export type EventFileAsset = AssetFile;

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

const DEFAULT_ASSETS_CDN_URL = 'https://assets.icaa.world';

function inlineAssetOrigin(assetsCdnUrl: string): string | null {
  try {
    return new URL(assetsCdnUrl).origin;
  } catch {
    return null;
  }
}

function isRenderableAssetUrl(url: URL, assetsCdnUrl: string): boolean {
  const origin = inlineAssetOrigin(assetsCdnUrl);
  return origin !== null && url.origin === origin;
}

export interface ResolveMediaRenderOptions {
  assetsCdnUrl?: string;
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

  if (displayMode === 'carousel' && imageCount >= 3) return 'carousel';
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
  const files = [...fileAssets].sort((a, b) => a.name.localeCompare(b.name));
  const otherFiles = files.filter((asset) => !isImageAsset(asset));

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

function resolveAssetFileRender(
  item: EventMediaItem,
  assetsCdnUrl: string,
): EventMediaRender {
  const url = parseSafeHttpUrl(item.source);
  if (!url) return { section: 'hidden' };

  if (item.displayMode === 'link' || !isRenderableAssetUrl(url, assetsCdnUrl)) {
    return { section: 'resources', mode: 'link', url: url.href };
  }

  if (IMAGE_PATH.test(url.pathname)) {
    return { section: 'resources', mode: 'image', url: url.href };
  }

  if (isPdfUrl(url)) {
    return {
      section: 'resources',
      mode: 'pdf',
      embedData: buildPdfEmbedData(url.href),
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
  options: ResolveMediaRenderOptions = {},
): EventMediaRender {
  const assetsCdnUrl =
    options.assetsCdnUrl ??
    import.meta.env.VITE_ASSETS_CDN_URL ??
    DEFAULT_ASSETS_CDN_URL;

  switch (item.type) {
    case 'video':
      return resolveVideoRender(item);
    case 'asset_folder':
      return resolveFolderRender(item, assets);
    case 'asset_file':
      return resolveAssetFileRender(item, assetsCdnUrl);
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
