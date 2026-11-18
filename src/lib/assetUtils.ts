export const MAX_ASSET_UPLOAD_BYTES = 50 * 1024 * 1024;
export const MAX_ASSET_FOLDER_NAME_LENGTH = 100;

const INVALID_FOLDER_NAME_CHARS = /[/\\?#%\p{Cc}]/u;

const INVALID_FOLDER_PATH_CHARS = /[\\?#%\p{Cc}]/u;

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
