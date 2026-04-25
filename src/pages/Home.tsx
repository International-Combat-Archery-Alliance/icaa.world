import { useTitle } from 'react-use';
import NewsContainer from '@/components/NewsContainer';
import EventsContainer from '@/components/EventsContainer';
import { CarouselImages } from '@/components/CarouselImages';

const Home = () => {
  useTitle('ICAA - International Combat Archery Alliance');

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

      <div className="mt-8 pb-6 px-4 flex flex-col items-center gap-4 lg:px-12">
        <div className="w-full max-w-[1016px]">
          <CarouselImages assetPath="/Carousel-Images" />
        </div>
        <div className="w-full max-w-[1016px] flex flex-col gap-4 lg:flex-row">
          <NewsContainer className="flex-1 min-w-0 h-auto" />
          <EventsContainer className="flex-1 min-w-0 h-auto" />
        </div>
      </div>
    </>
  );
};

export default Home;
