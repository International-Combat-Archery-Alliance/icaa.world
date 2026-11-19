import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Download,
  GalleryHorizontal,
  LayoutGrid,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CarouselImages } from '@/components/CarouselImages';
import { EventFileRows } from '@/components/EventFileRows';
import { MediaLightbox } from '@/components/MediaLightbox';
import { useGetAssets } from '@/hooks/useAssets';
import { downloadAssetFile } from '@/lib/assetUtils';
import {
  resolveMediaRender,
  type EventMediaItem,
} from '@/lib/eventMediaGrouping';
import { paginateGallery } from '@/lib/galleryPagination';
import { cn } from '@/lib/utils';

type GalleryViewMode = 'carousel' | 'gallery';

interface EventFolderCardProps {
  item: EventMediaItem;
}

function EventFolderCard({ item }: EventFolderCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const { data, isLoading, error } = useGetAssets(item.source, 100);

  const assets = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );
  const render = useMemo(
    () => resolveMediaRender(item, assets),
    [item, assets],
  );

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
  const galleryPage = paginateGallery(render.images, pageIndex);

  return (
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-primary">
            {item.title || 'Event Photos'}
          </CardTitle>
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
            {isImageMode && imageCount >= 3 && (
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
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isImageMode && viewMode === 'carousel' && (
          <>
            <CarouselImages
              assetPath={item.source}
              autoplay={false}
              onImageClick={setLightboxIndex}
              onSlideChange={setActiveSlideIndex}
            />
            {carouselImage && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-muted-foreground text-sm tabular-nums">
                  Photo {carouselIndex + 1} of {render.images.length}
                </p>
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
            )}
          </>
        )}
        {isImageMode && viewMode === 'gallery' && (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {galleryPage.items.map((image, index) => (
                <div
                  key={`${image.path}/${image.name}`}
                  className="group relative overflow-hidden rounded-lg"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setLightboxIndex(galleryPage.startIndex + index)
                    }
                    aria-label={`View ${image.name}`}
                    className="focus-visible:ring-ring block w-full cursor-zoom-in rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                  >
                    <img
                      src={image.url}
                      alt={image.name}
                      loading="lazy"
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="icon"
                    aria-label={`Download ${image.name}`}
                    className="absolute right-2 bottom-2 size-9 border-0 bg-black/60 text-white shadow-sm backdrop-blur-sm hover:bg-black/75"
                    onClick={() =>
                      void downloadAssetFile(image.url, image.name)
                    }
                  >
                    <Download aria-hidden="true" className="size-4" />
                  </Button>
                </div>
              ))}
            </div>
            {galleryPage.pageCount > 1 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-muted-foreground text-sm tabular-nums">
                  Showing {galleryPage.startIndex + 1}–{galleryPage.endIndex} of{' '}
                  {galleryPage.totalCount}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={galleryPage.pageIndex === 0}
                    onClick={() => setPageIndex(galleryPage.pageIndex - 1)}
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
                    onClick={() => setPageIndex(galleryPage.pageIndex + 1)}
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
        title={item.title || 'Event Photos'}
      />
    </Card>
  );
}

export { EventFolderCard };
