import { useMemo, useState, useEffect, useCallback } from 'react';
import { useGetAssets } from '@/hooks/useAssets';
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
import { assetImageUrl } from '@/lib/assetImage';
import { isImageAsset } from '@/lib/assetUtils';
import { cn } from '@/lib/utils';

// Component to handle image loading with fade-in
function CarouselImage({
  src,
  fallbackSrc,
  alt,
  aspectRatio,
}: {
  src: string;
  fallbackSrc: string;
  alt: string;
  aspectRatio: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
  }, [src]);

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-lg bg-gray-100',
        aspectRatio,
      )}
    >
      {!isLoaded && <Skeleton className="absolute inset-0 rounded-lg" />}
      <img
        src={currentSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
        }}
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
  aspectRatio?: string;
  autoplayDelay?: number;
  maxAssets?: number;
  className?: string;
  autoplay?: boolean;
  imageWidth?: number;
  onImageClick?: (index: number) => void;
  onSlideChange?: (index: number) => void;
}

export function CarouselImages({
  assetPath,
  aspectRatio = 'aspect-video',
  autoplayDelay = 10000,
  maxAssets = 100,
  className,
  autoplay = true,
  imageWidth = 960,
  onImageClick,
  onSlideChange,
}: CarouselImagesProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading } = useGetAssets(assetPath, maxAssets);

  const images = useMemo(() => {
    const allAssets = data?.pages.flatMap((page) => page.data) || [];
    return allAssets
      .filter(isImageAsset)
      .map((asset) => ({
        original: asset.url,
        src: assetImageUrl(asset.url, {
          width: imageWidth,
          fit: 'scale-down',
        }),
      }))
      .filter((image) => image.original !== '');
  }, [data, imageWidth]);

  const { preloadImages } = useImagePreloader();

  // Preload next 2 images when current changes
  useEffect(() => {
    if (images.length === 0) return;

    const nextIndex1 = (currentIndex + 1) % images.length;
    const nextIndex2 = (currentIndex + 2) % images.length;

    preloadImages([images[nextIndex1].src, images[nextIndex2].src]);
  }, [currentIndex, images, preloadImages]);

  // Track carousel index changes
  useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      const index = api.selectedScrollSnap();
      setCurrentIndex(index);
      onSlideChange?.(index);
    };

    handleSelect();
    api.on('select', handleSelect);

    return () => {
      api.off('select', handleSelect);
    };
  }, [api, onSlideChange]);

  if (isLoading) {
    return (
      <Skeleton className={cn('w-full rounded-lg', aspectRatio, className)} />
    );
  }

  if (images.length === 0) {
    return (
      <div
        className={cn(
          'w-full flex items-center justify-center bg-gray-100 rounded-lg',
          aspectRatio,
          className,
        )}
      >
        <span className="text-gray-400">No images found</span>
      </div>
    );
  }

  return (
    <Carousel
      setApi={setApi}
      plugins={
        autoplay
          ? [
              Autoplay({
                delay: autoplayDelay,
                stopOnInteraction: false,
              }),
            ]
          : undefined
      }
      opts={{
        align: 'start',
        loop: true,
      }}
      className={cn('w-full', className)}
    >
      <CarouselContent>
        {images.map((image, index) => (
          <CarouselItem key={index}>
            {onImageClick ? (
              <button
                type="button"
                onClick={() => onImageClick(index)}
                aria-label={`View photo ${index + 1}`}
                className="focus-visible:ring-ring block w-full cursor-zoom-in rounded-lg focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-inset"
              >
                <CarouselImage
                  src={image.src}
                  fallbackSrc={image.original}
                  alt={`Combat archery photo ${index + 1}`}
                  aspectRatio={aspectRatio}
                />
              </button>
            ) : (
              <CarouselImage
                src={image.src}
                fallbackSrc={image.original}
                alt={`Combat archery photo ${index + 1}`}
                aspectRatio={aspectRatio}
              />
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-4" />
      <CarouselNext className="right-4" />
    </Carousel>
  );
}
