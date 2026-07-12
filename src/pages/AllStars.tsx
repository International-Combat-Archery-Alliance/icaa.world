import { useTitle } from 'react-use';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SponsorsBanner } from '@/components/SponsorsBanner';
import { PlayerRoster } from '@/components/PlayerRoster';
import { Separator } from '@/components/ui/separator';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const matches = [
  {
    name: 'EASTERN FINALS',
    teams: [
      {
        name: 'Team Boston',
        logoUrl: '/images/espn/BostonLogo.png',
        logoClassName: 'h-48 md:h-64',
        players: [
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Cameron',
            lastName: 'Cardwell',
            number: '17',
            position: 'Flex',
            city: 'Boston',
            experience: '5',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Nate',
            lastName: 'Langh',
            number: '3',
            position: 'Flex',
            city: 'Boston',
            experience: '3',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Bob',
            lastName: 'Beng',
            number: '80',
            position: 'Forward',
            city: 'Boston',
            experience: '8',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Andrew',
            lastName: 'Mellen',
            number: '45',
            position: 'Flex',
            city: 'Boston',
            experience: '3',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Katt',
            lastName: 'H.',
            number: '13',
            position: 'Rear Guard',
            city: 'Boston',
            experience: '7',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'David',
            lastName: 'McMillan',
            number: '20',
            position: 'Centerback',
            city: 'Ottawa',
            experience: '10',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Nick',
            lastName: 'Rancourt',
            number: '5',
            position: 'Flex',
            city: 'Ottawa',
            experience: '3',
          },
        ],
      },
      {
        name: 'Team Ottawa',
        logoUrl: '/images/espn/OttawaLogo.png',
        logoClassName: 'h-48 md:h-64',
        players: [
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Kyle',
            lastName: 'White',
            number: '0',
            position: 'Forward',
            city: 'Ottawa',
            experience: '0',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Brandon',
            lastName: 'Nemeth',
            number: '7',
            position: 'Flex',
            city: 'Ottawa',
            experience: '8',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Angel',
            lastName: 'MacEachern',
            number: '1',
            position: 'Centerback',
            city: 'Ottawa',
            experience: '2.5',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Andrew',
            lastName: 'Bui',
            number: '23',
            position: 'Flex',
            city: 'Ottawa',
            experience: '1',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Kyle',
            lastName: 'Best',
            number: '6',
            position: 'Flex',
            city: 'Boston',
            experience: '2',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Danny',
            lastName: 'Pleshek',
            number: '4',
            position: 'Forward',
            city: 'Boston',
            experience: '2',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Mark',
            lastName: 'Elrod',
            number: '8',
            position: 'Forward',
            city: 'Boston',
            experience: '8',
          },
        ],
      },
    ],
  },
  {
    name: 'WESTERN FINALS',
    teams: [
      {
        name: 'Team Toronto',
        logoUrl: '/images/espn/TorontoLogo.png',
        logoClassName: 'h-48 md:h-64',
        players: [
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'James',
            lastName: 'McDougall',
            number: '3',
            position: 'Centerback',
            city: 'Toronto',
            experience: '8',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Tim',
            lastName: 'Ahong',
            number: '21',
            position: 'Flex',
            city: 'Toronto',
            experience: '7',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Russel',
            lastName: 'Padua',
            number: '13',
            position: 'Forward',
            city: 'Toronto',
            experience: '2.5',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Daniel',
            lastName: 'Martinez',
            number: '28',
            position: 'Flex',
            city: 'Toronto',
            experience: '3',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Christina',
            lastName: 'Player',
            number: '00',
            position: 'Flex',
            city: 'Toronto',
            experience: '0',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Yousef',
            lastName: 'Hariri',
            number: '76',
            position: 'Flex',
            city: 'Boston',
            experience: '7',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Sim',
            lastName: 'Singh',
            number: '25',
            position: 'Flex',
            city: 'Boston',
            experience: '6',
          },
        ],
      },
      {
        name: 'Team Barrie',
        logoUrl: '/images/espn/BarrieLogo.png',
        logoClassName: 'h-32 md:h-48',
        players: [
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Thomas',
            lastName: 'Parker',
            number: '6',
            position: 'Flex',
            city: 'Barrie',
            experience: '2',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Kristin',
            lastName: 'Drescher',
            number: '5',
            position: 'Rear Guard',
            city: 'Barrie',
            experience: '2',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Robert',
            lastName: 'Shitzu',
            number: '3',
            position: 'Flex',
            city: 'Ottawa',
            experience: '2',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'BJ',
            lastName: 'Thompson',
            number: '28',
            position: 'Forward',
            city: 'Boston',
            experience: '3',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Dayton',
            lastName: 'Marchese',
            number: '53',
            position: 'Forward',
            city: 'Boston',
            experience: '6',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Dave',
            lastName: 'Brown',
            number: '64',
            position: 'Flex',
            city: 'Boston',
            experience: '2',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Jay',
            lastName: 'Pusateri',
            number: '84',
            position: 'Forward',
            city: 'Boston',
            experience: '2',
          },
        ],
      },
    ],
  },
];

export default function AllStarsPage() {
  useTitle('All Stars 2026 - ICAA');

  const sponsors = [
    {
      logoUrl: '/images/espn/ssd.png',
      websiteUrl: 'https://www.silverscreendesign.com/',
    },
    {
      logoUrl: '/images/espn/EK_Logo_horiz_white.svg',
      websiteUrl: 'https://www.experiencekissimmee.com/',
    },
    {
      logoUrl: '/images/espn/electric.png',
      websiteUrl: 'https://coastalelectricsarasota.com/',
    },
    {
      logoUrl: '/images/espn/AG.png',
      websiteUrl: 'https://www.archerygamesboston.com/',
    },
    {
      logoUrl: '/images/espn/combat.png',
      websiteUrl: 'https://combatdarchers.ca/en/',
    },
  ];

  return (
    <section className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-center">
        <img
          src="/images/espn/full_logo.png"
          alt="All Stars 2026"
          className="w-full max-w-4xl h-auto rounded-lg"
        />
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center">
            ESPN8: The Ocho - Combat Archery All Stars 2026
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-lg space-y-2">
          <p>Friday, August 7th. 7:00 PM EST</p>
          <p>Filmed live at the ESPN World Wide of Sports Complex in Orlando</p>
          <p>Watch the broadcast on ESPN2 @ 7:00 PM!</p>
          <a
            href="https://www.espnwwos.com/events/competitive-sports/espn8-the-ocho/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Check out the website
          </a>
        </CardContent>
      </Card>

      <CountdownTimer targetDate="2026-08-07T19:00:00" />

      <div className="space-y-16 pt-16">
        {matches.map((match, matchIndex) => (
          <div key={match.name} className="space-y-8">
            <h2 className="text-5xl font-bold tracking-tight text-center text-primary my-8">
              {match.name}
            </h2>
            <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-8">
              {/* Team 1 */}
              <div className="space-y-6">
                <div className="flex h-64 items-center justify-center">
                  <img
                    src={match.teams[0].logoUrl}
                    alt={`${match.teams[0].name} Logo`}
                    className={`${match.teams[0].logoClassName} w-auto mx-auto object-contain`}
                  />
                </div>
                <PlayerRoster players={match.teams[0].players} />
              </div>

              {/* "VS" separator for desktop */}
              <div className="hidden lg:flex h-64 items-center justify-center">
                <span className="text-5xl font-bold text-muted-foreground">
                  VS
                </span>
              </div>
              {/* "VS" separator for mobile */}
              <div className="lg:hidden text-center text-3xl font-bold text-muted-foreground py-4">
                VS
              </div>

              {/* Team 2 */}
              <div className="space-y-6">
                <div className="flex h-64 items-center justify-center">
                  <img
                    src={match.teams[1].logoUrl}
                    alt={`${match.teams[1].name} Logo`}
                    className={`${match.teams[1].logoClassName} w-auto mx-auto object-contain`}
                  />
                </div>
                <PlayerRoster players={match.teams[1].players} />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Button asChild>
                <Link to="/vote">Vote for {match.name} MVP!</Link>
              </Button>
            </div>
            {matchIndex < matches.length - 1 && (
              <Separator className="my-12 h-2 bg-primary" />
            )}
          </div>
        ))}
      </div>
      <SponsorsBanner sponsors={sponsors} />
    </section>
  );
}
