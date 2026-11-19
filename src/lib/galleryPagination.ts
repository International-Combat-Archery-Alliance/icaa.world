export const GALLERY_PAGE_SIZE = 12;

export interface GalleryPage<T> {
  items: T[];
  pageIndex: number;
  pageCount: number;
  startIndex: number;
  endIndex: number;
  totalCount: number;
}

export function paginateGallery<T>(
  items: readonly T[],
  pageIndex: number,
): GalleryPage<T> {
  const pageCount = Math.max(1, Math.ceil(items.length / GALLERY_PAGE_SIZE));
  const currentPageIndex = Math.min(Math.max(pageIndex, 0), pageCount - 1);
  const startIndex = currentPageIndex * GALLERY_PAGE_SIZE;
  const pageItems = items.slice(startIndex, startIndex + GALLERY_PAGE_SIZE);

  return {
    items: pageItems,
    pageIndex: currentPageIndex,
    pageCount,
    startIndex,
    endIndex: startIndex + pageItems.length,
    totalCount: items.length,
  };
}
