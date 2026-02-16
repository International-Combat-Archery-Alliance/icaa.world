import { useMemo, useState, useEffect, useCallback } from 'react';
import { useTitle } from 'react-use';
//import { Link } from 'react-router-dom';
import NewsContainer from '@/components/NewsContainer';
//import { Button } from '@/components/ui/button';
import EventsContainer from '@/components/EventsContainer';
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
  isVisible,
}: {
  src: string;
  alt: string;
  isVisible: boolean;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsLoaded(false);
    }
  }, [isVisible]);

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-lg bg-gray-100">
      {!isLoaded && isVisible && (
        <Skeleton className="absolute inset-0 rounded-lg" />
      )}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          isLoaded && isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        loading="eager"
      />
    </div>
  );
}

// Hook to preload images
function useImagePreloader() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const preloadImages = useCallback(
    (urls: string[]) => {
      urls.forEach((url) => {
        if (!loadedImages.has(url)) {
          const img = new Image();
          img.src = url;
          img.onload = () => {
            setLoadedImages((prev) => new Set(prev).add(url));
          };
        }
      });
    },
    [loadedImages],
  );

  return { preloadImages };
}

const Home = () => {
  useTitle('ICAA - International Combat Archery Alliance');

  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data, isLoading } = useGetAssets('/Carousel-Images', 100);

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

  return (
    <>
      <header id="hero-section" className="content-section active">
        <h1 className="text-balance text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
          International <span className="text-primary">Combat Archery</span>{' '}
          Alliance
        </h1>
        <p className="mx-auto mt-4 max-w-3xl text-center text-lg text-muted-foreground md:text-xl">
          Building a global alliance for the sport of Combat Archery.
        </p>
      </header>
      {/*
      <div className="mt-6 flex justify-center">
        <Button asChild size="lg" className="px-8 text-lg">
          <Link to="/registration">Join the Alliance</Link>
        </Button>
      </div>
      */}

      <div className="mt-8 grid grid-cols-1 pb-6 px-4 gap-4 lg:px-12 lg:grid-cols-2">
        <div className="lg:col-span-2">
          {isLoading ? (
            <Skeleton className="w-full h-[400px] rounded-lg" />
          ) : images.length > 0 ? (
            <Carousel
              setApi={setApi}
              plugins={[
                Autoplay({
                  delay: 10000,
                  stopOnInteraction: false,
                }),
              ]}
              opts={{
                align: 'start',
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {images.map((url, index) => (
                  <CarouselItem key={index}>
                    <CarouselImage
                      src={url}
                      alt={`Combat archery photo ${index + 1}`}
                      isVisible={index === currentIndex}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          ) : (
            <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
              <span className="text-gray-400">No images found</span>
            </div>
          )}
        </div>

        <NewsContainer className="lg:justify-self-end lg:max-w-[500px]" />

        <EventsContainer className="lg:max-w-[500px]" />
      </div>
    </>
  );
};

export default Home;
