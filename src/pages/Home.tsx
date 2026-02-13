import { useMemo } from 'react';
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
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import Autoplay from 'embla-carousel-autoplay';

const isImageAsset = (asset: Asset): boolean => {
  return (
    asset.type === 'file' &&
    asset.contentType.toLowerCase().startsWith('image/')
  );
};

const Home = () => {
  useTitle('ICAA - International Combat Archery Alliance');

  const { data, isLoading } = useGetAssets('/Carousel-Images', 100);

  const images = useMemo(() => {
    const allAssets = data?.pages.flatMap((page) => page.data) || [];
    return allAssets
      .filter(isImageAsset)
      .map((asset) => ('url' in asset ? asset.url : ''))
      .filter((url): url is string => url !== '');
  }, [data]);

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
                    <img
                      src={url}
                      alt={`Combat archery photo ${index + 1}`}
                      className="w-full h-[400px] object-cover rounded-lg"
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
