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
        <h1 className="text-center text-4xl font-extrabold tracking-tight text-balance sm:text-5xl md:text-6xl">
          International <span className="text-primary">Combat Archery</span>{' '}
          Alliance
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-3xl text-center text-lg md:text-xl">
          Building a global alliance for the sport of Combat Archery.
        </p>
      </header>

      <div className="mt-8 flex flex-col items-center gap-4 px-4 pb-6 lg:px-12">
        <Card className="w-full max-w-[1016px]">
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <iframe
              src="https://www.youtube.com/embed/Aet-ZNe9X4E"
              title="ESPN8: The Ocho - Combat Archery All Stars 2026"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              // oxlint-disable-next-line react/iframe-missing-sandbox
              sandbox="allow-scripts allow-same-origin allow-presentation"
            ></iframe>
          </div>
          <div className="p-6 text-center">
            <CardHeader className="mb-4 p-0">
              <CardTitle className="text-primary text-2xl md:text-3xl">
                ESPN8: The Ocho - Combat Archery All Stars 2026
              </CardTitle>
              <CardDescription className="text-lg">
                The biggest names in Combat Archery compete on the world stage.
              </CardDescription>
            </CardHeader>
            <CardContent className="mb-6 space-y-4 p-0">
              <p>
                The ICAA is proud to partner with ESPN to bring Combat Archery
                to The Ocho! Watch the top players from across North America
                battle it out for the title of All-Star Champion.
              </p>
              <p className="text-primary text-2xl font-bold md:text-3xl">
                Watch live on ESPN2 August 7th at 3:00 PM EST!
              </p>
              <p className="text-secondary text-2xl font-bold md:text-3xl">
                Also Streaming on ESPN+!
              </p>
            </CardContent>
            <CardFooter className="flex justify-center p-0">
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

        <div className="flex w-full max-w-[1016px] flex-col gap-4 lg:flex-row">
          <NewsContainer className="h-auto min-w-0 flex-1" />
          <EventsContainer className="h-auto min-w-0 flex-1" />
        </div>
      </div>
    </>
  );
};

export default Home;
