import { describe, expect, it } from 'bun:test';
import {
  MAX_ASSET_FOLDER_NAME_LENGTH,
  getFolderNameError,
  isCanonicalAssetFolderPath,
  joinAssetPath,
} from '@/lib/assetUtils';

describe('joinAssetPath', () => {
  it('joins root and nested paths', () => {
    expect(joinAssetPath('/', 'images')).toBe('/images');
    expect(joinAssetPath('/images', 'events')).toBe('/images/events');
  });
});

describe('getFolderNameError', () => {
  it.each(['events', 'boston-2026', 'Photos_2026', 'a b'])(
    'accepts %s',
    (name) => {
      expect(getFolderNameError(name)).toBeNull();
    },
  );

  it('accepts a name trimmed to the maximum length', () => {
    expect(
      getFolderNameError('a'.repeat(MAX_ASSET_FOLDER_NAME_LENGTH)),
    ).toBeNull();
  });

  it('rejects empty and whitespace-only names', () => {
    expect(getFolderNameError('')).not.toBeNull();
    expect(getFolderNameError('   ')).not.toBeNull();
  });

  it('rejects names over the maximum length', () => {
    expect(
      getFolderNameError('a'.repeat(MAX_ASSET_FOLDER_NAME_LENGTH + 1)),
    ).not.toBeNull();
  });

  it.each(['.', '..', 'a/b', 'a\\b', 'a?b', 'a#b', 'a%b', 'a\tb', 'a\nb'])(
    'rejects %p',
    (name) => {
      expect(getFolderNameError(name)).not.toBeNull();
    },
  );
});

describe('isCanonicalAssetFolderPath', () => {
  it.each([
    '/',
    '/images',
    '/images/events',
    '/images/events/boston-2026',
    '/Event-Logos',
  ])('accepts %s', (path) => {
    expect(isCanonicalAssetFolderPath(path)).toBe(true);
  });

  it.each([
    '',
    'images',
    '/images/',
    '/images//events',
    '/images/./events',
    '/images/../events',
    '/images/..',
    '/images\\events',
    '/images?draft=true',
    '/images#top',
    '/images%2Fevents',
    '/images%2e%2eevents',
    '/images/\u0000events',
  ])('rejects %p', (path) => {
    expect(isCanonicalAssetFolderPath(path)).toBe(false);
  });
});
