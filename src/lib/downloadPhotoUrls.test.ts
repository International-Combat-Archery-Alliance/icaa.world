import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { downloadPhotoUrls } from '@/lib/bulkPhotoSave';

const originalFetch = globalThis.fetch;
const originalDocumentDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  'document',
);
const originalCreateObjectUrl = Object.getOwnPropertyDescriptor(
  URL,
  'createObjectURL',
);
const originalRevokeObjectUrl = Object.getOwnPropertyDescriptor(
  URL,
  'revokeObjectURL',
);
const originalSetTimeout = globalThis.setTimeout;

let downloads: string[] = [];

function installBrowserMocks(): void {
  downloads = [];

  Object.defineProperty(globalThis, 'document', {
    configurable: true,
    value: {
      createElement: () => {
        const element = {
          href: '',
          download: '',
          click: () => {},
          remove: () => {},
        };
        element.click = () => downloads.push(element.download);
        return element;
      },
      body: {
        appendChild: () => {},
        removeChild: () => {},
      },
    },
  });

  Object.defineProperty(URL, 'createObjectURL', {
    configurable: true,
    value: () => 'blob:test',
  });
  Object.defineProperty(URL, 'revokeObjectURL', {
    configurable: true,
    value: () => {},
  });

  globalThis.setTimeout = ((callback: () => void) => {
    callback();
    return 0;
  }) as unknown as typeof setTimeout;
}

function restoreBrowserMocks(): void {
  globalThis.fetch = originalFetch;

  if (originalDocumentDescriptor) {
    Object.defineProperty(globalThis, 'document', originalDocumentDescriptor);
  } else {
    Reflect.deleteProperty(globalThis, 'document');
  }

  if (originalCreateObjectUrl) {
    Object.defineProperty(URL, 'createObjectURL', originalCreateObjectUrl);
  } else {
    Reflect.deleteProperty(URL, 'createObjectURL');
  }

  if (originalRevokeObjectUrl) {
    Object.defineProperty(URL, 'revokeObjectURL', originalRevokeObjectUrl);
  } else {
    Reflect.deleteProperty(URL, 'revokeObjectURL');
  }

  globalThis.setTimeout = originalSetTimeout;
}

beforeEach(installBrowserMocks);
afterEach(restoreBrowserMocks);

const PHOTOS = [
  { url: 'https://assets.icaa.world/a.jpg', name: 'a.jpg' },
  { url: 'https://assets.icaa.world/b.jpg', name: 'b.jpg' },
];

describe('downloadPhotoUrls', () => {
  it('downloads each photo and reports progress', async () => {
    globalThis.fetch = (async () =>
      new Response(new Blob(['x'], { type: 'image/jpeg' }), {
        status: 200,
      })) as unknown as typeof fetch;

    const progress: Array<[number, number]> = [];
    const result = await downloadPhotoUrls(PHOTOS, {
      onProgress: (completed, total) => progress.push([completed, total]),
    });

    expect(result.downloaded).toBe(2);
    expect(result.failedPhotos).toEqual([]);
    expect(progress).toEqual([
      [1, 2],
      [2, 2],
    ]);
    expect(downloads).toEqual(['a.jpg', 'b.jpg']);
  });

  it('continues after a failed photo', async () => {
    let call = 0;
    globalThis.fetch = (async () => {
      call += 1;
      if (call === 1) throw new Error('nope');
      return new Response(new Blob(['x'], { type: 'image/jpeg' }), {
        status: 200,
      });
    }) as unknown as typeof fetch;

    const result = await downloadPhotoUrls(PHOTOS);

    expect(result.downloaded).toBe(1);
    expect(result.failedPhotos).toEqual([PHOTOS[0]]);
    expect(downloads).toEqual(['b.jpg']);
  });

  it('stops when aborted', async () => {
    const controller = new AbortController();
    controller.abort();

    globalThis.fetch = (async () => {
      throw new Error('should not fetch');
    }) as unknown as typeof fetch;

    const result = await downloadPhotoUrls(PHOTOS, {
      signal: controller.signal,
    });

    expect(result.downloaded).toBe(0);
    expect(result.failedPhotos).toEqual([]);
    expect(downloads).toEqual([]);
  });
});
