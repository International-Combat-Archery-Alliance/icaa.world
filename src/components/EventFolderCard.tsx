import { useMemo, useState } from 'react';
import { Images } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CarouselImages } from '@/components/CarouselImages';
import { EventFileRows } from '@/components/EventFileRows';
import { MediaLightbox } from '@/components/MediaLightbox';
import { useGetAssets } from '@/hooks/useAssets';
import {
  resolveMediaRender,
  type EventMediaItem,
} from '@/lib/eventMediaGrouping';

interface EventFolderCardProps {
  item: EventMediaItem;
}

function EventFolderCard({ item }: EventFolderCardProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const { data, isLoading, error } = useGetAssets(item.source, 100);

  const assets = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );
  const render = useMemo(
    () => resolveMediaRender(item, assets),
    [item, assets],
  );

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="space-y-1">
          <CardTitle className="text-primary">
            {item.title || 'Event Photos'}
          </CardTitle>
          {item.description && (
            <p className="text-muted-foreground text-sm">{item.description}</p>
          )}
        </div>
        {render.images.length > 0 && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setLightboxIndex(0)}
          >
            <Images aria-hidden="true" className="mr-2 size-4" />
            View all photos ({render.images.length})
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {render.mode === 'carousel' && (
          <CarouselImages
            assetPath={item.source}
            autoplay={false}
            onImageClick={setLightboxIndex}
          />
        )}
        {render.mode === 'gallery' && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {render.images.map((image, index) => (
              <button
                key={`${image.path}/${image.name}`}
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`View ${image.name}`}
                className="group focus-visible:ring-ring overflow-hidden rounded-lg focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <img
                  src={image.url}
                  alt={image.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
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
