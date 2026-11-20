import { describe, expect, it } from 'bun:test';
import { assetImageUrl } from '@/lib/assetImage';

const CDN = 'https://assets.icaa.world';
const ASSET =
  'https://assets.icaa.world/67ed1a77-7fe5-403b-b220-bfd34bff7258.jpg';

describe('assetImageUrl', () => {
  it('builds a transformation URL for CDN assets', () => {
    expect(
      assetImageUrl(
        ASSET,
        { width: 480, height: 480, fit: 'cover', quality: 75 },
        CDN,
      ),
    ).toBe(
      'https://assets.icaa.world/cdn-cgi/image/width=480,height=480,fit=cover,format=auto,quality=75,onerror=redirect/67ed1a77-7fe5-403b-b220-bfd34bff7258.jpg',
    );
  });

  it('defaults to scale-down without a height', () => {
    expect(assetImageUrl(ASSET, { width: 960 }, CDN)).toBe(
      'https://assets.icaa.world/cdn-cgi/image/width=960,fit=scale-down,format=auto,quality=75,onerror=redirect/67ed1a77-7fe5-403b-b220-bfd34bff7258.jpg',
    );
  });

  it('preserves query strings', () => {
    expect(assetImageUrl(`${ASSET}?v=2`, { width: 400 }, CDN)).toContain(
      '/67ed1a77-7fe5-403b-b220-bfd34bff7258.jpg?v=2',
    );
  });

  it('leaves non-CDN URLs untouched', () => {
    expect(
      assetImageUrl('https://example.com/photo.jpg', { width: 400 }, CDN),
    ).toBe('https://example.com/photo.jpg');
  });

  it('leaves http URLs untouched', () => {
    expect(
      assetImageUrl(
        'http://localhost:9000/icaa-assets/photo.jpg',
        { width: 400 },
        CDN,
      ),
    ).toBe('http://localhost:9000/icaa-assets/photo.jpg');
  });

  it('leaves SVGs and GIFs untouched', () => {
    expect(assetImageUrl(`${CDN}/logo.svg`, { width: 400 }, CDN)).toBe(
      `${CDN}/logo.svg`,
    );
    expect(assetImageUrl(`${CDN}/logo.SVG`, { width: 400 }, CDN)).toBe(
      `${CDN}/logo.SVG`,
    );
    expect(assetImageUrl(`${CDN}/anim.gif`, { width: 400 }, CDN)).toBe(
      `${CDN}/anim.gif`,
    );
  });

  it('does not double-transform', () => {
    const transformed = assetImageUrl(ASSET, { width: 400 }, CDN);

    expect(assetImageUrl(transformed, { width: 800 }, CDN)).toBe(transformed);
  });

  it('leaves invalid dimensions untouched', () => {
    expect(assetImageUrl(ASSET, { width: 0 }, CDN)).toBe(ASSET);
    expect(assetImageUrl(ASSET, { width: 400, height: -1 }, CDN)).toBe(ASSET);
    expect(assetImageUrl(ASSET, { width: 400, quality: 101 }, CDN)).toBe(ASSET);
  });

  it('requires a height for cover crops', () => {
    expect(assetImageUrl(ASSET, { width: 400, fit: 'cover' }, CDN)).toBe(ASSET);
  });
});
