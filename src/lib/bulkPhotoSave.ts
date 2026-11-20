import { downloadZip } from 'client-zip';
import { isAbortError, OBJECT_URL_REVOKE_DELAY_MS } from '@/lib/assetUtils';
import { hasCoarsePointer } from '@/lib/device';

export const MAX_BULK_PHOTO_COUNT = 50;
export const MAX_ZIP_PHOTO_COUNT = 50;

const DOWNLOAD_INTERVAL_MS = 250;

export type BulkSaveMode = 'share' | 'download';

export type BulkSaveResult = 'shared' | 'downloaded' | 'cancelled';

export type BulkDownloadStrategy = 'directory' | 'zip' | 'file';

export interface BulkPhoto {
  url: string;
  name: string;
}

export interface DownloadPhotoUrlsResult {
  downloaded: number;
  failedPhotos: BulkPhoto[];
  canceled?: boolean;
}

export interface DownloadPhotoUrlsOptions {
  signal?: AbortSignal;
  onProgress?: (completed: number, total: number) => void;
  strategy?: BulkDownloadStrategy;
  archiveName?: string;
  directory?: PhotoDirectoryHandle | null;
}

export function resolveBulkSaveMode(): BulkSaveMode {
  if (
    typeof navigator === 'undefined' ||
    navigator.maxTouchPoints === 0 ||
    !hasCoarsePointer() ||
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

export function supportsDirectoryPicker(): boolean {
  return getDirectoryPicker() !== null;
}

export async function requestDirectoryHandle(): Promise<PhotoDirectoryHandle | null> {
  const picker = getDirectoryPicker();
  if (!picker) return null;

  return picker({
    id: 'icaa-photo-downloads',
    mode: 'readwrite',
    startIn: 'downloads',
  });
}

export function toArchiveName(title?: string): string {
  const base = title
    ?.trim()
    .replace(/[^\w.-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return `${base || 'event-photos'}.zip`;
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
  options: DownloadPhotoUrlsOptions = {},
): Promise<DownloadPhotoUrlsResult> {
  const strategy =
    options.strategy ??
    (options.directory !== undefined
      ? options.directory
        ? 'directory'
        : 'zip'
      : supportsDirectoryPicker()
        ? 'directory'
        : 'zip');

  if (
    strategy === 'file' ||
    (strategy === 'zip' && photos.length > MAX_ZIP_PHOTO_COUNT)
  ) {
    return downloadPhotoUrlsIndividually(photos, options);
  }

  if (strategy === 'directory') {
    if (options.directory) {
      return downloadPhotosToDirectory(photos, options.directory, options);
    }

    if (options.directory === undefined) {
      const picker = getDirectoryPicker();
      if (picker) {
        try {
          const directory = await picker({
            id: 'icaa-photo-downloads',
            mode: 'readwrite',
            startIn: 'downloads',
          });
          return await downloadPhotosToDirectory(photos, directory, options);
        } catch (error) {
          if (isAbortError(error)) {
            return { downloaded: 0, failedPhotos: [], canceled: true };
          }
        }
      }
    }
  }

  return downloadPhotosAsZip(photos, options);
}

async function downloadPhotoUrlsIndividually(
  photos: readonly BulkPhoto[],
  options: DownloadPhotoUrlsOptions,
): Promise<DownloadPhotoUrlsResult> {
  const failedPhotos: BulkPhoto[] = [];
  let downloaded = 0;

  for (const [index, photo] of photos.entries()) {
    if (options.signal?.aborted) break;

    try {
      const file = await preparePhotoFile(
        photo.url,
        photo.name,
        options.signal,
      );
      triggerFileDownload(file);
      downloaded += 1;
    } catch {
      if (options.signal?.aborted) break;
      failedPhotos.push(photo);
    }

    options.onProgress?.(index + 1, photos.length);

    if (index < photos.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, DOWNLOAD_INTERVAL_MS));
    }
  }

  return { downloaded, failedPhotos };
}

async function downloadPhotosToDirectory(
  photos: readonly BulkPhoto[],
  directory: PhotoDirectoryHandle,
  options: DownloadPhotoUrlsOptions,
): Promise<DownloadPhotoUrlsResult> {
  const failedPhotos: BulkPhoto[] = [];
  let downloaded = 0;

  for (const [index, photo] of photos.entries()) {
    if (options.signal?.aborted) break;

    try {
      const file = await preparePhotoFile(
        photo.url,
        photo.name,
        options.signal,
      );
      const fileName = await uniqueFileName(directory, photo.name);
      const handle = await directory.getFileHandle(fileName, {
        create: true,
      });
      const writable = await handle.createWritable();

      try {
        await writable.write(file);
        await writable.close();
      } catch (error) {
        await writable.abort?.();
        throw error;
      }

      downloaded += 1;
    } catch {
      if (options.signal?.aborted) break;
      failedPhotos.push(photo);
    }

    options.onProgress?.(index + 1, photos.length);
  }

  return { downloaded, failedPhotos };
}

async function downloadPhotosAsZip(
  photos: readonly BulkPhoto[],
  options: DownloadPhotoUrlsOptions,
): Promise<DownloadPhotoUrlsResult> {
  const failedPhotos: BulkPhoto[] = [];
  let downloaded = 0;
  let completed = 0;

  async function* entries(): AsyncGenerator<{ name: string; input: File }> {
    for (const photo of photos) {
      if (options.signal?.aborted) return;

      try {
        const file = await preparePhotoFile(
          photo.url,
          photo.name,
          options.signal,
        );
        downloaded += 1;
        completed += 1;
        options.onProgress?.(completed, photos.length);
        yield { name: photo.name, input: file };
      } catch {
        if (options.signal?.aborted) return;
        failedPhotos.push(photo);
        completed += 1;
        options.onProgress?.(completed, photos.length);
      }
    }
  }

  try {
    const blob = await downloadZip(entries()).blob();

    if (options.signal?.aborted) {
      return { downloaded: 0, failedPhotos, canceled: true };
    }

    if (downloaded === 0) {
      return { downloaded: 0, failedPhotos };
    }

    triggerBlobDownload(blob, options.archiveName ?? 'event-photos.zip');
    return { downloaded, failedPhotos };
  } catch {
    return { downloaded: 0, failedPhotos: [...photos] };
  }
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
  triggerBlobDownload(file, file.name);
}

function triggerBlobDownload(blob: Blob, fileName: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), OBJECT_URL_REVOKE_DELAY_MS);
}

async function uniqueFileName(
  directory: PhotoDirectoryHandle,
  name: string,
): Promise<string> {
  const dot = name.lastIndexOf('.');
  const base = dot > 0 ? name.slice(0, dot) : name;
  const extension = dot > 0 ? name.slice(dot) : '';
  let candidate = name;

  for (let index = 1; index <= 1000; index += 1) {
    try {
      await directory.getFileHandle(candidate);
      candidate = `${base} (${index})${extension}`;
    } catch {
      return candidate;
    }
  }

  return `${base} (${Date.now()})${extension}`;
}

interface WritablePhotoFile {
  write(data: Blob): Promise<void>;
  close(): Promise<void>;
  abort?(): Promise<void>;
}

interface PhotoFileHandle {
  createWritable(): Promise<WritablePhotoFile>;
}

export interface PhotoDirectoryHandle {
  getFileHandle(
    name: string,
    options?: { create?: boolean },
  ): Promise<PhotoFileHandle>;
}

type DirectoryPicker = (options?: {
  id?: string;
  mode?: 'read' | 'readwrite';
  startIn?: string;
}) => Promise<PhotoDirectoryHandle>;

function getDirectoryPicker(): DirectoryPicker | null {
  if (typeof window === 'undefined') return null;
  const picker = (
    window as unknown as { showDirectoryPicker?: DirectoryPicker }
  ).showDirectoryPicker;
  return typeof picker === 'function' ? picker : null;
}
