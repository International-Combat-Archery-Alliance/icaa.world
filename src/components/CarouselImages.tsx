import { useMemo, useState, useEffect, useCallback } from 'react';
import { useGetAssets } from '@/hooks/useAssets';
import type { Asset } from '@/hooks/useAssets';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';

const isImageAsset = (asset: Asset): boolean => {
  return (
    asset.type === 'file' &&
    asset.contentType.toLowerCase().startsWith('image/')
  );
};

// Component to handle image loading with fade-in
function CarouselImage({
  src,
  alt,
  height,
}: {
  src: string;
  alt: string;
  height: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="relative w-full overflow-hidden rounded-lg bg-gray-100"
      style={{ height }}
    >
      {!isLoaded && <Skeleton className="absolute inset-0 rounded-lg" />}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}

// Hook to preload images
function useImagePreloader() {
  const preloadImages = useCallback((urls: string[]) => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  return { preloadImages };
}

interface CarouselImagesProps {
  assetPath: string;
  height?: string;
  autoplayDelay?: number;
  maxAssets?: number;
  className?: string;
}

export function CarouselImages({
  assetPath,
  height = '400px',
  autoplayDelay = 10000,
  maxAssets = 100,
  className,
}: CarouselImagesProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading } = useGetAssets(assetPath, maxAssets);

  const images = useMemo(() => {
    const allAssets = data?.pages.flatMap((page) => page.data) || [];
    return allAssets
      .filter(isImageAsset)
      .map((asset) => ('url' in asset ? asset.url : ''))
      .filter((url): url is string => url !== '');
  }, [data]);

  const { preloadImages } = useImagePreloader();

  // Preload next 2 images when current changes
  useEffect(() => {
    if (images.length === 0) return;

    const nextIndex1 = (currentIndex + 1) % images.length;
    const nextIndex2 = (currentIndex + 2) % images.length;

    preloadImages([images[nextIndex1], images[nextIndex2]]);
  }, [currentIndex, images, preloadImages]);

  // Track carousel index changes
  useEffect(() => {
    if (!api) return;

    setCurrentIndex(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrentIndex(api.selectedScrollSnap());
    });
  }, [api]);

  if (isLoading) {
    return (
      <Skeleton
        className={cn('w-full rounded-lg', className)}
        style={{ height }}
      />
    );
  }

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'w-full flex items-center justify-center bg-gray-100 rounded-lg',
          className,
        )}
        style={{ height }}
      >
        <span className="text-gray-400">No images found</span>
      </div>
    );
  }

  return (
    <Carousel
      setApi={setApi}
      plugins={[
        Autoplay({
          delay: autoplayDelay,
          stopOnInteraction: false,
        }),
      ]}
      opts={{
        align: 'start',
        loop: true,
      }}
      className={cn('w-full', className)}
    >
      <CarouselContent>
        {images.map((url, index) => (
          <CarouselItem key={index}>
            <CarouselImage
              src={url}
              alt={`Combat archery photo ${index + 1}`}
              height={height}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
