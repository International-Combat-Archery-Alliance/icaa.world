import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  GalleryHorizontal,
  LayoutGrid,
  Link2,
  ListChecks,
} from 'lucide-react';
import { AssetImage } from '@/components/AssetImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CarouselImages } from '@/components/CarouselImages';
import { EventFileRows } from '@/components/EventFileRows';
import { GallerySelectionBar } from '@/components/GallerySelectionBar';
import { MediaLightbox } from '@/components/MediaLightbox';
import { useCopyPhotoLink } from '@/hooks/useCopyPhotoLink';
import { useGetAssets } from '@/hooks/useAssets';
import { usePhotoSelection } from '@/hooks/usePhotoSelection';
import { useSwipeGesture } from '@/hooks/useSwipeGesture';
import { downloadAssetFile } from '@/lib/assetUtils';
import {
  resolveMediaRender,
  type EventFileAsset,
  type EventMediaItem,
} from '@/lib/eventMediaGrouping';
import { paginateGallery } from '@/lib/galleryPagination';
import { cn } from '@/lib/utils';

type GalleryViewMode = 'carousel' | 'gallery';

const EMPTY_PHOTOS: EventFileAsset[] = [];

interface EventFolderCardProps {
  item: EventMediaItem;
}

function EventFolderCard({ item }: EventFolderCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const copyPhotoLink = useCopyPhotoLink();
  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAssets(item.source, 100);

  const assets = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );
  const render = useMemo(
    () => resolveMediaRender(item, assets),
    [item, assets],
  );
  const galleryTitle = item.title || 'Event Photos';
  const photos = render.section === 'folders' ? render.images : EMPTY_PHOTOS;
  const photoSelection = usePhotoSelection(photos, galleryTitle);
  const galleryPage = paginateGallery(photos, pageIndex);
  const gridRef = useRef<HTMLElement>(null);
  const [pageDirection, setPageDirection] = useState<'next' | 'previous'>(
    'next',
  );

  const changeGalleryPage = useCallback(
    (delta: -1 | 1) => {
      setPageDirection(delta > 0 ? 'next' : 'previous');
      setPageIndex((current) =>
        Math.min(Math.max(current + delta, 0), galleryPage.pageCount - 1),
      );
    },
    [galleryPage.pageCount],
  );
  const showNextGalleryPage = useCallback(
    () => changeGalleryPage(1),
    [changeGalleryPage],
  );
  const showPreviousGalleryPage = useCallback(
    () => changeGalleryPage(-1),
    [changeGalleryPage],
  );
  const { shouldSuppressClick } = useSwipeGesture({
    targetRef: gridRef,
    allowSwipeFromAnywhere: true,
    edgeGuardDistance: 56,
    minSwipeDistance: 60,
    onSwipeLeft: galleryPage.pageCount > 1 ? showNextGalleryPage : undefined,
    onSwipeRight:
      galleryPage.pageCount > 1 ? showPreviousGalleryPage : undefined,
  });

  const imageCount = render.section === 'folders' ? render.images.length : 0;
  const isImageMode =
    render.section === 'folders' &&
    (render.mode === 'carousel' || render.mode === 'gallery');
  const resolvedViewMode: GalleryViewMode =
    render.section === 'folders' && render.mode === 'gallery'
      ? 'gallery'
      : 'carousel';
  const [viewMode, setViewMode] = useState<GalleryViewMode>(resolvedViewMode);

  useEffect(() => {
    setViewMode(resolvedViewMode);
  }, [resolvedViewMode]);

  useEffect(() => {
    if (activeSlideIndex >= imageCount) setActiveSlideIndex(0);
  }, [activeSlideIndex, imageCount]);

  useEffect(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    if (!isImageMode || viewMode !== 'gallery' || galleryPage.pageCount <= 1) {
      return;
    }

    const element = gridRef.current;
    if (!element) return;

    let accumulated = 0;
    let lastNavigation = 0;

    const handleWheel = (event: WheelEvent) => {
      const scale =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? 100 : 1;
      const rawX = event.deltaX * scale;
      const rawY = event.deltaY * scale;
      const swapsAxes = event.shiftKey && Math.abs(rawX) < Math.abs(rawY);
      const horizontal = swapsAxes ? rawY : rawX;
      const vertical = swapsAxes ? rawX : rawY;

      if (
        Math.abs(horizontal) <= Math.abs(vertical) ||
        Math.abs(horizontal) < 5
      ) {
        return;
      }

      event.preventDefault();

      const now = Date.now();
      if (now - lastNavigation < 450) return;

      accumulated += horizontal;
      if (Math.abs(accumulated) < 60) return;

      changeGalleryPage(accumulated > 0 ? 1 : -1);
      accumulated = 0;
      lastNavigation = now;
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleWheel);
  }, [changeGalleryPage, galleryPage.pageCount, isImageMode, viewMode]);

  if (error) return null;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="aspect-video w-full rounded-xl" />
        </CardContent>
      </Card>
    );
  }

  if (render.section !== 'folders' || render.mode === 'empty') return null;

  const lightboxImages = render.images.map((image) => ({
    url: image.url,
    alt: image.name,
  }));

  const carouselIndex =
    activeSlideIndex < render.images.length ? activeSlideIndex : 0;
  const carouselImage = render.images[carouselIndex];

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-primary">{galleryTitle}</CardTitle>
          {item.description && (
            <p className="text-muted-foreground text-sm">{item.description}</p>
          )}
        </div>
        {render.images.length > 0 && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="text-muted-foreground text-sm tabular-nums">
              {render.images.length}{' '}
              {render.images.length === 1 ? 'photo' : 'photos'}
            </span>
            {isImageMode && imageCount >= 3 && !photoSelection.isSelecting && (
              <div className="border-border bg-muted/50 inline-flex items-center gap-0.5 rounded-md border p-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={viewMode === 'carousel'}
                  className={cn(
                    'h-7 px-2',
                    viewMode === 'carousel' && 'bg-background shadow-xs',
                  )}
                  onClick={() => setViewMode('carousel')}
                >
                  <GalleryHorizontal aria-hidden="true" className="size-4" />
                  Carousel
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-pressed={viewMode === 'gallery'}
                  className={cn(
                    'h-7 px-2',
                    viewMode === 'gallery' && 'bg-background shadow-xs',
                  )}
                  onClick={() => setViewMode('gallery')}
                >
                  <LayoutGrid aria-hidden="true" className="size-4" />
                  Grid
                </Button>
              </div>
            )}
            {isImageMode &&
              photoSelection.saveMode === 'download' &&
              !photoSelection.isSelecting && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 px-2"
                  disabled={
                    photoSelection.isSaving || hasNextPage || isFetchingNextPage
                  }
                  onClick={() => void photoSelection.downloadAll()}
                >
                  <Download aria-hidden="true" className="size-4" />
                  {hasNextPage || isFetchingNextPage
                    ? 'Loading photos…'
                    : 'Download all'}
                </Button>
              )}
            {isImageMode && (
              <Button
                type="button"
                variant={photoSelection.isSelecting ? 'default' : 'outline'}
                size="sm"
                className="h-7 px-2"
                aria-pressed={photoSelection.isSelecting}
                onClick={() => {
                  if (photoSelection.isSelecting) {
                    photoSelection.stopSelecting();
                    return;
                  }
                  setViewMode('gallery');
                  photoSelection.startSelecting();
                }}
              >
                <ListChecks aria-hidden="true" className="size-4" />
                {photoSelection.isSelecting ? 'Cancel' : 'Select'}
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isImageMode && viewMode === 'carousel' && (
          <>
            <CarouselImages
              assetPath={item.source}
              autoplay={false}
              imageWidth={960}
              onImageClick={setLightboxIndex}
              onSlideChange={setActiveSlideIndex}
            />
            {carouselImage && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-muted-foreground text-sm tabular-nums">
                  Photo {carouselIndex + 1} of {render.images.length}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => void copyPhotoLink(carouselImage.url)}
                  >
                    <Link2 aria-hidden="true" className="size-4" />
                    Copy link
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      void downloadAssetFile(
                        carouselImage.url,
                        carouselImage.name,
                      )
                    }
                  >
                    <Download aria-hidden="true" className="size-4" />
                    Download photo
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        {isImageMode && viewMode === 'gallery' && (
          <>
            {photoSelection.isSelecting && (
              <GallerySelectionBar
                selectedCount={photoSelection.selectedCount}
                maxSelectable={photoSelection.maxSelectable}
                failedCount={photoSelection.failedCount}
                totalCount={imageCount}
                isPreparing={photoSelection.isPreparing}
                isSaving={photoSelection.isSaving}
                saveMode={photoSelection.saveMode}
                onSelectAll={photoSelection.selectAll}
                onClear={photoSelection.clearSelection}
                onRetry={photoSelection.retryFailed}
                onSave={() => void photoSelection.saveSelected()}
                onDone={photoSelection.stopSelecting}
              />
            )}
            <section
              ref={gridRef}
              aria-label="Photo gallery pages"
              tabIndex={-1}
              onClickCapture={(event) => {
                if (shouldSuppressClick()) {
                  event.preventDefault();
                  event.stopPropagation();
                }
              }}
              onKeyDown={(event) => {
                if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
                  return;
                }
                event.preventDefault();
                changeGalleryPage(event.key === 'ArrowRight' ? 1 : -1);
                gridRef.current?.focus();
              }}
            >
              <div
                key={galleryPage.pageIndex}
                className={cn(
                  'animate-in fade-in duration-200 motion-reduce:animate-none',
                  pageDirection === 'next'
                    ? 'slide-in-from-right-2'
                    : 'slide-in-from-left-2',
                )}
              >
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {galleryPage.items.map((image, index) => {
                    const selected = photoSelection.isSelected(image.url);

                    return (
                      <div
                        key={`${image.path}/${image.name}`}
                        className={cn(
                          'group relative overflow-hidden rounded-lg',
                          selected && 'ring-primary ring-2 ring-offset-2',
                        )}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (photoSelection.isSelecting) {
                              photoSelection.togglePhoto(image);
                              return;
                            }
                            setLightboxIndex(galleryPage.startIndex + index);
                          }}
                          aria-label={
                            photoSelection.isSelecting
                              ? `${selected ? 'Deselect' : 'Select'} ${image.name}`
                              : `View ${image.name}`
                          }
                          aria-pressed={
                            photoSelection.isSelecting ? selected : undefined
                          }
                          className={cn(
                            'focus-visible:ring-ring block w-full rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                            photoSelection.isSelecting
                              ? 'cursor-pointer'
                              : 'cursor-zoom-in',
                          )}
                        >
                          <AssetImage
                            src={image.url}
                            alt={image.name}
                            imageWidth={480}
                            imageHeight={480}
                            imageFit="cover"
                            className={cn(
                              'aspect-square w-full object-cover transition-transform duration-300',
                              !photoSelection.isSelecting &&
                                'group-hover:scale-105',
                            )}
                          />
                          {photoSelection.isSelecting && (
                            <span
                              className={cn(
                                'absolute top-2 left-2 flex size-6 items-center justify-center rounded-full border-2 shadow-sm transition-colors',
                                selected
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-white bg-black/40 text-transparent',
                              )}
                            >
                              <Check aria-hidden="true" className="size-4" />
                            </span>
                          )}
                        </button>
                        {!photoSelection.isSelecting && (
                          <div className="absolute right-2 bottom-2 flex gap-1">
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon"
                              aria-label={`Copy link to ${image.name}`}
                              className="size-9 border-0 bg-black/60 text-white shadow-sm backdrop-blur-sm hover:bg-black/75"
                              onClick={() => void copyPhotoLink(image.url)}
                            >
                              <Link2 aria-hidden="true" className="size-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon"
                              aria-label={`Download ${image.name}`}
                              className="size-9 border-0 bg-black/60 text-white shadow-sm backdrop-blur-sm hover:bg-black/75"
                              onClick={() =>
                                void downloadAssetFile(image.url, image.name)
                              }
                            >
                              <Download aria-hidden="true" className="size-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
            {galleryPage.pageCount > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p
                  className="text-muted-foreground text-sm tabular-nums"
                  aria-live="polite"
                >
                  Showing {galleryPage.startIndex + 1}–{galleryPage.endIndex} of{' '}
                  {galleryPage.totalCount}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={galleryPage.pageIndex === 0}
                    onClick={() => changeGalleryPage(-1)}
                  >
                    <ChevronLeft aria-hidden="true" className="size-4" />
                    Previous
                  </Button>
                  <span className="text-muted-foreground text-sm tabular-nums">
                    Page {galleryPage.pageIndex + 1} of {galleryPage.pageCount}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={
                      galleryPage.pageIndex === galleryPage.pageCount - 1
                    }
                    onClick={() => changeGalleryPage(1)}
                  >
                    Next
                    <ChevronRight aria-hidden="true" className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
        {render.mode === 'file_list' && <EventFileRows files={render.files} />}
        {render.mode !== 'file_list' && render.otherFiles.length > 0 && (
          <EventFileRows files={render.otherFiles} />
        )}
      </CardContent>
      <MediaLightbox
        images={lightboxImages}
        open={lightboxIndex !== null}
        activeIndex={lightboxIndex ?? 0}
        onOpenChange={(open) => {
          if (!open) setLightboxIndex(null);
        }}
        onIndexChange={setLightboxIndex}
        title={galleryTitle}
      />
    </Card>
  );
}

export { EventFolderCard };
