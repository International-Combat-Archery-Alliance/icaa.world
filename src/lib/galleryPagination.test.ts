import { describe, expect, it } from 'bun:test';
import { GALLERY_PAGE_SIZE, paginateGallery } from '@/lib/galleryPagination';

function images(count: number): string[] {
  return Array.from({ length: count }, (_, index) => `photo-${index + 1}`);
}

describe('paginateGallery', () => {
  it('returns the first page of a full gallery', () => {
    const page = paginateGallery(images(48), 0);
    expect(page).toEqual({
      items: images(12),
      pageIndex: 0,
      pageCount: 4,
      startIndex: 0,
      endIndex: 12,
      totalCount: 48,
    });
  });

  it('slices a middle page with its global offset', () => {
    const page = paginateGallery(images(48), 2);
    expect(page.pageIndex).toBe(2);
    expect(page.startIndex).toBe(24);
    expect(page.endIndex).toBe(36);
    expect(page.items[0]).toBe('photo-25');
  });

  it('slices a short final page', () => {
    const page = paginateGallery(images(26), 2);
    expect(page.items).toHaveLength(2);
    expect(page.endIndex).toBe(26);
  });

  it('keeps a single page for images below the page size', () => {
    const page = paginateGallery(images(GALLERY_PAGE_SIZE), 0);
    expect(page.pageCount).toBe(1);
    expect(page.items).toHaveLength(GALLERY_PAGE_SIZE);
  });

  it('clamps out-of-range page indexes', () => {
    expect(paginateGallery(images(13), 4).pageIndex).toBe(1);
    expect(paginateGallery(images(13), -2).pageIndex).toBe(0);
  });

  it('reports an empty page for an empty gallery', () => {
    const page = paginateGallery([], 0);
    expect(page).toEqual({
      items: [],
      pageIndex: 0,
      pageCount: 1,
      startIndex: 0,
      endIndex: 0,
      totalCount: 0,
    });
  });
});
