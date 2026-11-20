import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resolveBulkSaveMode } from '@/lib/bulkPhotoSave';

function setNavigatorProperty(key: string, value: unknown): void {
  Object.defineProperty(navigator, key, { configurable: true, value });
}

function clearNavigatorProperty(key: string): void {
  Reflect.deleteProperty(navigator, key);
}

function resetNavigator(): void {
  clearNavigatorProperty('share');
  clearNavigatorProperty('canShare');
  clearNavigatorProperty('maxTouchPoints');
}

beforeEach(resetNavigator);
afterEach(resetNavigator);

describe('resolveBulkSaveMode', () => {
  it('falls back to downloads without Web Share support', () => {
    expect(resolveBulkSaveMode()).toBe('download');
  });

  it('uses downloads on non-touch devices', () => {
    setNavigatorProperty('share', () => Promise.resolve());
    setNavigatorProperty('canShare', () => true);
    setNavigatorProperty('maxTouchPoints', 0);

    expect(resolveBulkSaveMode()).toBe('download');
  });

  it('uses the share sheet when files are shareable', () => {
    setNavigatorProperty('share', () => Promise.resolve());
    setNavigatorProperty('canShare', () => true);
    setNavigatorProperty('maxTouchPoints', 5);

    expect(resolveBulkSaveMode()).toBe('share');
  });

  it('falls back when files are not shareable', () => {
    setNavigatorProperty('share', () => Promise.resolve());
    setNavigatorProperty('canShare', () => false);
    setNavigatorProperty('maxTouchPoints', 5);

    expect(resolveBulkSaveMode()).toBe('download');
  });
});
