export const MAX_ASSET_UPLOAD_BYTES = 50 * 1024 * 1024;
// Matches CreateFolderRequest.name maxLength in assets-api/spec/api.yaml.
export const MAX_ASSET_FOLDER_NAME_LENGTH = 255;

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
