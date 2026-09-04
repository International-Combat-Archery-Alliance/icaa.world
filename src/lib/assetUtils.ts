export const MAX_ASSET_UPLOAD_BYTES = 50 * 1024 * 1024;

export function joinAssetPath(basePath: string, name: string): string {
  if (basePath === '/') return `/${name}`;
  return `${basePath}/${name}`;
}
