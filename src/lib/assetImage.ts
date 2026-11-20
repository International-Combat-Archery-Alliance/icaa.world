export interface AssetImageTransform {
  width: number;
  height?: number;
  fit?: 'cover' | 'scale-down' | 'contain';
  quality?: number;
}

const TRANSFORM_PREFIX = '/cdn-cgi/image/';
const SKIPPED_EXTENSIONS = /\.(svg|gif)$/i;
const DEFAULT_QUALITY = 75;
const DEFAULT_ASSETS_CDN_URL = 'https://assets.icaa.world';

function resolveCdnBaseUrl(): string {
  return import.meta.env.VITE_ASSETS_CDN_URL ?? DEFAULT_ASSETS_CDN_URL;
}

export function assetImageUrl(
  url: string,
  transform: AssetImageTransform,
  cdnBaseUrl: string = resolveCdnBaseUrl(),
): string {
  if (!Number.isFinite(transform.width) || transform.width <= 0) {
    return url;
  }

  let image: URL;
  let cdn: URL;
  try {
    image = new URL(url);
    cdn = new URL(cdnBaseUrl);
  } catch {
    return url;
  }

  if (image.protocol !== 'https:' || image.origin !== cdn.origin) return url;
  if (image.pathname.startsWith(TRANSFORM_PREFIX)) return url;
  if (SKIPPED_EXTENSIONS.test(image.pathname)) return url;

  const options = [
    `width=${Math.round(transform.width)}`,
    ...(transform.height ? [`height=${Math.round(transform.height)}`] : []),
    `fit=${transform.fit ?? 'scale-down'}`,
    'format=auto',
    `quality=${transform.quality ?? DEFAULT_QUALITY}`,
    'onerror=redirect',
  ];
  const source = `${image.pathname.replace(/^\//, '')}${image.search}`;

  return `${image.origin}${TRANSFORM_PREFIX}${options.join(',')}/${source}`;
}
