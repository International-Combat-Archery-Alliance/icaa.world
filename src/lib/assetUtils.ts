import type { Asset } from '@/hooks/useAssets';
import { hasCoarsePointer } from '@/lib/device';
import { parseSafeHttpUrl } from '@/lib/embedUtils';

export const MAX_ASSET_UPLOAD_BYTES = 50 * 1024 * 1024;
export const OBJECT_URL_REVOKE_DELAY_MS = 5000;
// Matches CreateFolderRequest.name maxLength in assets-api/spec/api.yaml.
export const MAX_ASSET_FOLDER_NAME_LENGTH = 255;

export type AssetFile = Extract<Asset, { type: 'file' }>;

export function isFileAsset(asset: Asset): asset is AssetFile {
  return (
    asset.type === 'file' &&
    asset.url !== '' &&
    parseSafeHttpUrl(asset.url) !== null
  );
}

export function isImageAsset(asset: Asset): asset is AssetFile {
  return (
    isFileAsset(asset) && asset.contentType.toLowerCase().startsWith('image/')
  );
}

const INVALID_FOLDER_NAME_CHARS = /[/\\?#%\p{Cc}]/u;

const INVALID_FOLDER_PATH_CHARS = /[\\?#%\p{Cc}]/u;

const FILE_SIZE_UNITS = ['B', 'KB', 'MB', 'GB', 'TB'] as const;

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    FILE_SIZE_UNITS.length - 1,
  );
  const value = bytes / 1024 ** exponent;

  return `${exponent === 0 ? value : Number(value.toFixed(1))} ${FILE_SIZE_UNITS[exponent]}`;
}

export function joinAssetPath(basePath: string, name: string): string {
  if (basePath === '/') return `/${name}`;
  return `${basePath}/${name}`;
}

export function getFolderNameError(name: string): string | null {
  const trimmed = name.trim();

  if (trimmed === '') {
    return 'Enter a folder name.';
  }

  if (trimmed.length > MAX_ASSET_FOLDER_NAME_LENGTH) {
    return `Folder names must be at most ${MAX_ASSET_FOLDER_NAME_LENGTH} characters.`;
  }

  if (trimmed === '.' || trimmed === '..') {
    return 'Folder names cannot be "." or "..".';
  }

  if (INVALID_FOLDER_NAME_CHARS.test(trimmed)) {
    return 'Folder names cannot contain /, \\, ?, #, %, or control characters.';
  }

  return null;
}

export function isAbortError(error: unknown): boolean {
  return error instanceof Error && error.name === 'AbortError';
}

async function tryShareAsset(file: File): Promise<boolean> {
  if (navigator.maxTouchPoints === 0 || !hasCoarsePointer()) return false;
  if (!navigator.canShare?.({ files: [file] })) return false;

  try {
    await navigator.share({ files: [file] });
  } catch (error) {
    if (!isAbortError(error)) return false;
  }

  return true;
}

export async function downloadAssetFile(
  url: string,
  fileName: string,
): Promise<void> {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Download fetch failed');
    const blob = await response.blob();

    // Mobile share sheets save the image to Photos or the camera roll;
    // blob downloads land in Files, which users rarely find.
    const file = new File([blob], fileName, { type: blob.type });
    if (await tryShareAsset(file)) return;

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = objectUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(
      () => URL.revokeObjectURL(objectUrl),
      OBJECT_URL_REVOKE_DELAY_MS,
    );
  } catch {
    // Cross-origin CDN responses without CORS headers cannot be read as blobs.
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}

export function isCanonicalAssetFolderPath(path: string): boolean {
  if (!path.startsWith('/')) {
    return false;
  }

  if (path === '/') {
    return true;
  }

  if (path.endsWith('/')) {
    return false;
  }

  // Rejecting "%" also rejects percent-encoded separators and dot segments.
  if (INVALID_FOLDER_PATH_CHARS.test(path)) {
    return false;
  }

  return path
    .slice(1)
    .split('/')
    .every((segment) => segment !== '' && segment !== '.' && segment !== '..');
}
