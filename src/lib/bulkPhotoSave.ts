import { isAbortError } from '@/lib/assetUtils';

export const MAX_BULK_PHOTO_COUNT = 50;

const DOWNLOAD_INTERVAL_MS = 250;
const OBJECT_URL_REVOKE_DELAY_MS = 1000;

export type BulkSaveMode = 'share' | 'download';

export type BulkSaveResult = 'shared' | 'downloaded' | 'cancelled';

export interface BulkPhoto {
  url: string;
  name: string;
}

export interface DownloadPhotoUrlsResult {
  downloaded: number;
  failedPhotos: BulkPhoto[];
}

export function resolveBulkSaveMode(): BulkSaveMode {
  if (
    typeof navigator === 'undefined' ||
    navigator.maxTouchPoints === 0 ||
    typeof navigator.share !== 'function' ||
    typeof navigator.canShare !== 'function'
  ) {
    return 'download';
  }

  const probe = new File([new Uint8Array(1)], 'photo.jpg', {
    type: 'image/jpeg',
  });
  return navigator.canShare({ files: [probe] }) ? 'share' : 'download';
}

export async function preparePhotoFile(
  url: string,
  name: string,
  signal?: AbortSignal,
): Promise<File> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`Failed to fetch ${url}`);
  const blob = await response.blob();
  return new File([blob], name, { type: blob.type });
}

export async function savePhotoFiles(
  files: File[],
  mode: BulkSaveMode,
  title?: string,
): Promise<BulkSaveResult> {
  if (mode === 'share') {
    try {
      await navigator.share({ ...(title ? { title } : {}), files });
      return 'shared';
    } catch (error) {
      if (isAbortError(error)) return 'cancelled';
    }
  }

  await downloadPhotoFiles(files);
  return 'downloaded';
}

export async function downloadPhotoUrls(
  photos: readonly BulkPhoto[],
): Promise<DownloadPhotoUrlsResult> {
  const failedPhotos: BulkPhoto[] = [];
  let downloaded = 0;

  for (const [index, photo] of photos.entries()) {
    try {
      const file = await preparePhotoFile(photo.url, photo.name);
      triggerFileDownload(file);
      downloaded += 1;
    } catch {
      failedPhotos.push(photo);
    }

    if (index < photos.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, DOWNLOAD_INTERVAL_MS));
    }
  }

  return { downloaded, failedPhotos };
}

async function downloadPhotoFiles(files: File[]): Promise<void> {
  for (const [index, file] of files.entries()) {
    triggerFileDownload(file);
    if (index < files.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, DOWNLOAD_INTERVAL_MS));
    }
  }
}

function triggerFileDownload(file: File): void {
  const objectUrl = URL.createObjectURL(file);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), OBJECT_URL_REVOKE_DELAY_MS);
}
