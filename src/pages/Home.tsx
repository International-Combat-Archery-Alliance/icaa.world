import { useTitle } from 'react-use';
import NewsContainer from '@/components/NewsContainer';
import EventsContainer from '@/components/EventsContainer';
import { CarouselImages } from '@/components/CarouselImages';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { SponsorsBanner } from '@/components/SponsorsBanner';

const Home = () => {
  useTitle('ICAA - International Combat Archery Alliance');

  const sponsors = [
    {
      logoUrl:
        'https://assets.icaa.world/78939a33-6cda-4f07-9922-87419f18b861.png',
      websiteUrl: 'https://www.silverscreendesign.com/',
    },
    {
      logoUrl:
        'https://assets.icaa.world/07d37824-656e-4975-95c7-36b6cf85de27.png',
      websiteUrl: 'https://coastalelectricsarasota.com/',
    },
    {
      logoUrl:
        'https://assets.icaa.world/afec2749-f882-46a5-8e57-d4818b970062.png',
      websiteUrl: 'https://combatdarchers.ca/en/',
    },
    {
      logoUrl:
        'https://assets.icaa.world/cb44df9c-ec30-493a-9b75-3dcf66e0444e.png',
      websiteUrl: 'https://www.archerygamesboston.com/',
    },
    {
      logoUrl:
        'https://assets.icaa.world/934b85f0-2d0e-4c6a-bc8e-1bb8fa66b332.svg',
      websiteUrl: 'https://www.experiencekissimmee.com/',
    },
  ];

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
        <Card className="w-full max-w-[1016px]">
          <img
            src="https://assets.icaa.world/1b266230-4d77-4360-8bb4-af814f83e2ec.png"
            alt="All Stars 2026"
            className="w-full h-auto object-cover rounded-t-lg"
          />
          <div className="p-6 text-center">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-2xl md:text-3xl text-primary">
                ESPN8: All Stars 2026
              </CardTitle>
              <CardDescription className="text-lg">
                The biggest names in Combat Archery compete on the world stage.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0 mb-6 space-y-4">
              <p>
                The ICAA is proud to partner with ESPN to bring Combat Archery
                to The Ocho! Watch the top players from across North America
                battle it out for the title of All-Star Champion.
              </p>
              <p className="text-2xl md:text-3xl font-bold text-primary">
                Watch live on ESPN2 at 3:00 PM EST!
              </p>
            </CardContent>
            <CardFooter className="p-0 flex justify-center">
              <Button asChild>
                <Link to="/espn">See the Rosters & Event Info</Link>
              </Button>
            </CardFooter>
          </div>
        </Card>
        <div className="w-full max-w-[1016px]">
          <SponsorsBanner sponsors={sponsors} />
        </div>
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
