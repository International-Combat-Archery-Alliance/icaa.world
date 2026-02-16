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

      <div className="mt-8 grid grid-cols-1 pb-6 px-4 gap-4 lg:px-12 lg:grid-cols-2">
        <div className="lg:col-span-2 flex justify-center">
          <div className="w-full max-w-[1016px]">
            <CarouselImages assetPath="/Carousel-Images" />
          </div>
        </div>

        <NewsContainer className="lg:justify-self-end lg:max-w-[500px]" />

        <EventsContainer className="lg:max-w-[500px]" />
      </div>
    </>
  );
};

export default Home;
