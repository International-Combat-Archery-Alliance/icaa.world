import { useTitle } from 'react-use';
import NewsContainer from '@/components/NewsContainer';
import EventsContainer from '@/components/EventsContainer';
import { CarouselImages } from '@/components/CarouselImages';
import {
  Card,
  CardContent,
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
          <div className="p-6 text-center">
            <CardHeader className="mb-4 p-0">
              <CardTitle className="text-primary text-2xl md:text-3xl">
                2026 Boston Championships - Saturday November 14th, 2026
              </CardTitle>
            </CardHeader>
            <CardContent className="mb-6 space-y-4 p-0">
              <p className="text-secondary text-2xl font-bold md:text-3xl">
                Livestreaming on both Twitch and YouTube! Links below
              </p>
            </CardContent>
            <CardFooter className="flex flex-col items-stretch justify-center gap-3 p-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Button asChild>
                <Link to="https://www.twitch.tv/icaa_world">
                  Watch on Twitch!
                </Link>
              </Button>
              <Button asChild>
                <Link to="https://www.youtube.com/@Icaa-world/streams">
                  Watch on YouTube!
                </Link>
              </Button>
              <Button asChild>
                <Link to="https://docs.google.com/spreadsheets/d/1P0v-8G1bryNlo8plQ-c2lbOj8Yq1ZTTS_HVZvLTC33k/edit?gid=673306283#gid=673306283">
                  Follow live standings here
                </Link>
              </Button>
              <Button asChild>
                <Link to="https://icaa.world/events/fa5aa500-a528-4213-9b48-c318d549ad85/event-details">
                  Event Page
                </Link>
              </Button>
            </CardFooter>
          </div>
        </Card>

        <Card className="w-full max-w-[1016px]">
          <div className="aspect-video w-full overflow-hidden rounded-t-lg">
            <iframe
              src="https://www.youtube.com/embed/_5QUttXHcxI?si=LCb65stCA4Pa1-Nm"
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
                As seen on ESPN8: The Ocho!
              </CardTitle>
            </CardHeader>
            <CardContent className="mb-6 space-y-4 p-0">
              <p className="text-primary text-2xl font-bold md:text-3xl">
                Relive the magic on ESPN+ or the video above!
              </p>
            </CardContent>
            <CardFooter className="flex justify-center p-0">
              <Button asChild>
                <Link to="/espn">See the Rosters & Event Results!</Link>
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
