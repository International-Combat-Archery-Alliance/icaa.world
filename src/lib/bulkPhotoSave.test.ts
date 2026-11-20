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

const originalWindow = (globalThis as { window?: unknown }).window;

function setWindow(value: unknown): void {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value,
  });
}

function restoreWindow(): void {
  if (originalWindow === undefined) {
    Reflect.deleteProperty(globalThis, 'window');
    return;
  }
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: originalWindow,
  });
}

function resetEnvironment(): void {
  resetNavigator();
  restoreWindow();
}

beforeEach(resetEnvironment);
afterEach(resetEnvironment);

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

  it('uses the share sheet on a coarse-pointer touch device', () => {
    setNavigatorProperty('share', () => Promise.resolve());
    setNavigatorProperty('canShare', () => true);
    setNavigatorProperty('maxTouchPoints', 5);
    setWindow({ matchMedia: () => ({ matches: true }) });

    expect(resolveBulkSaveMode()).toBe('share');
  });

  it('uses downloads on a touch device with a fine pointer', () => {
    setNavigatorProperty('share', () => Promise.resolve());
    setNavigatorProperty('canShare', () => true);
    setNavigatorProperty('maxTouchPoints', 5);
    setWindow({ matchMedia: () => ({ matches: false }) });

    expect(resolveBulkSaveMode()).toBe('download');
  });

  it('falls back when files are not shareable', () => {
    setNavigatorProperty('share', () => Promise.resolve());
    setNavigatorProperty('canShare', () => false);
    setNavigatorProperty('maxTouchPoints', 5);

    expect(resolveBulkSaveMode()).toBe('download');
  });
});
