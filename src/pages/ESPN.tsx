import { useTitle } from 'react-use';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SponsorsBanner } from '@/components/SponsorsBanner';
import { PlayerRoster } from '@/components/PlayerRoster';
import { CountdownTimer } from '@/components/CountdownTimer';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const matches = [
  {
    name: 'EASTERN FINALS',
    teams: [
      {
        name: 'Team Boston',
        color: '#70b2e0',
        logoUrl:
          'https://assets.icaa.world/42e777a4-2757-4bbf-bdaa-79303aafc9ba.png',
        logoClassName: 'h-48 md:h-64',
        players: [
          {
            imageUrl:
              'https://assets.icaa.world/9ccd9c08-d3cb-4a25-a386-675c9c299c61.jpg',
            firstName: 'Cameron',
            lastName: 'Cardwell',
            number: '17',
            position: 'Flex',
            city: 'Boston',
            experience: '5',
          },
          {
            imageUrl:
              'https://assets.icaa.world/b7eccda4-f047-4ea8-911c-3a243fc9aa48.jpeg',
            firstName: 'Nate',
            lastName: 'Langh',
            number: '3',
            position: 'Flex',
            city: 'Boston',
            experience: '3',
          },
          {
            imageUrl:
              'https://assets.icaa.world/2b18bf29-bf2a-4d78-b32c-5aa51dc500e6.png',
            firstName: 'Bob',
            lastName: 'Beng',
            number: '80',
            position: 'Forward',
            city: 'Boston',
            experience: '8',
          },
          {
            imageUrl:
              'https://assets.icaa.world/2e13269a-5570-4618-9e34-1321933d12de.jpeg',
            firstName: 'Andrew',
            lastName: 'Mellen',
            number: '45',
            position: 'Flex',
            city: 'Boston',
            experience: '3',
          },
          {
            imageUrl:
              'https://assets.icaa.world/32fc6646-16cc-4017-a6df-8046641eaef9.jpg',
            firstName: 'Katt',
            lastName: 'H.',
            number: '13',
            position: 'Rear Guard',
            city: 'Boston',
            experience: '7',
          },
          {
            imageUrl:
              'https://assets.icaa.world/701cc5fa-6695-4706-afc3-3607f684264a.jpg',
            firstName: 'David',
            lastName: 'McMillan',
            number: '20',
            position: 'Centerback',
            city: 'Ottawa',
            experience: '10',
          },
          {
            imageUrl: '', // No image provided for Nick Rancourt
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
        color: '#33593a',
        logoUrl:
          'https://assets.icaa.world/e135fd46-636c-4758-b78b-4729d182a4fc.png',
        logoClassName: 'h-48 md:h-64',
        players: [
          {
            imageUrl: '', // No image provided for Kyle White
            firstName: 'Kyle',
            lastName: 'White',
            number: '13',
            position: 'Forward',
            city: 'Ottawa',
            experience: '8',
          },
          {
            imageUrl:
              'https://assets.icaa.world/b0da1aed-85d5-4705-bb09-00956dd01a39.png',
            firstName: 'Brandon',
            lastName: 'Nemeth',
            number: '7',
            position: 'Flex',
            city: 'Ottawa',
            experience: '8',
          },
          {
            imageUrl: '', // No image provided for Angel MacEachern
            firstName: 'Angel',
            lastName: 'MacEachern',
            number: '1',
            position: 'Centerback',
            city: 'Ottawa',
            experience: '2.5',
          },
          {
            imageUrl:
              'https://assets.icaa.world/93ebc1f8-147a-4983-b37b-848b3138042d.jpg',
            firstName: 'Andrew',
            lastName: 'Bui',
            number: '23',
            position: 'Flex',
            city: 'Ottawa',
            experience: '1',
          },
          {
            imageUrl:
              'https://assets.icaa.world/e90de502-456c-48b4-88d7-62d9fd768d99.jpg',
            firstName: 'Kyle',
            lastName: 'Best',
            number: '6',
            position: 'Flex',
            city: 'Boston',
            experience: '2',
          },
          {
            imageUrl: '', // No image provided for Danny Pleshek
            firstName: 'Danny',
            lastName: 'Pleshek',
            number: '4',
            position: 'Forward',
            city: 'Boston',
            experience: '2',
          },
          {
            imageUrl:
              'https://assets.icaa.world/29b61f2a-caed-4f10-96ed-57db5f1a95f2.jpg',
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
        color: '#b02026',
        logoUrl:
          'https://assets.icaa.world/b9715dc3-dd6a-4be4-8df7-eb63bc1cd771.png',
        logoClassName: 'h-48 md:h-64',
        players: [
          {
            imageUrl:
              'https://assets.icaa.world/19639410-208f-4b44-bcf2-fec0f8ecd5c1.jpg',
            firstName: 'James',
            lastName: 'McDougall',
            number: '3',
            position: 'Centerback',
            city: 'Toronto',
            experience: '8',
          },
          {
            imageUrl: '', // No image provided for Tim Ahong
            firstName: 'Tim',
            lastName: 'Ahong',
            number: '21',
            position: 'Flex',
            city: 'Toronto',
            experience: '7',
          },
          {
            imageUrl: '', // No image provided for Russel Padua
            firstName: 'Russel',
            lastName: 'Padua',
            number: '13',
            position: 'Forward',
            city: 'Toronto',
            experience: '2.5',
          },
          {
            imageUrl:
              'https://assets.icaa.world/2775b4c8-e476-4382-9dc0-a4484d5b0a99.png',
            firstName: 'Daniel',
            lastName: 'Martinez',
            number: '28',
            position: 'Flex',
            city: 'Toronto',
            experience: '3',
          },
          {
            imageUrl: '', // No image provided for Christina Laconsay
            firstName: 'Christina',
            lastName: 'Laconsay',
            number: '14',
            position: 'Flex',
            city: 'Toronto',
            experience: '4',
          },
          {
            imageUrl:
              'https://assets.icaa.world/320a250f-f069-4ca2-97c5-d7133640d2ae.JPG',
            firstName: 'Yousef',
            lastName: 'Hariri',
            number: '76',
            position: 'Flex',
            city: 'Boston',
            experience: '7',
          },
          {
            imageUrl:
              'https://assets.icaa.world/578f8d21-5ca0-4287-9b39-b881206be767.jpg',
            firstName: 'Sim',
            lastName: 'Singh', // Simran Singh
            number: '25',
            position: 'Flex',
            city: 'Boston',
            experience: '6',
          },
        ],
      },
      {
        name: 'Team Barrie',
        color: '#3163a6',
        logoUrl:
          'https://assets.icaa.world/fa86e579-203d-4361-83e6-77c2ac405bb4.png',
        logoClassName: 'h-32 md:h-48',
        players: [
          {
            imageUrl:
              'https://assets.icaa.world/e5c921e5-dc44-49ad-be25-9b7629a2f72c.jpeg',
            firstName: 'Thomas',
            lastName: 'Parker',
            number: '6',
            position: 'Flex',
            city: 'Barrie',
            experience: '2',
          },
          {
            imageUrl:
              'https://assets.icaa.world/4cd090bb-4f3d-4702-bd2e-1e2867744418.jpeg',
            firstName: 'Kristin',
            lastName: 'Drescher',
            number: '5',
            position: 'Rear Guard',
            city: 'Barrie',
            experience: '2',
          },
          {
            imageUrl:
              'https://assets.icaa.world/57765442-59c3-494a-b284-7013ea85f969.jpeg',
            firstName: 'Robert',
            lastName: 'Chitiu',
            number: '3',
            position: 'Flex',
            city: 'Ottawa',
            experience: '2',
          },
          {
            imageUrl:
              'https://assets.icaa.world/8803d050-b749-4905-9033-b9bbdf473059.png',
            firstName: 'BJ',
            lastName: 'Thompson',
            number: '28',
            position: 'Forward',
            city: 'Boston',
            experience: '3',
          },
          {
            imageUrl:
              'https://assets.icaa.world/e9f9bdbb-a687-450a-b630-d73dcf68d315.jpeg',
            firstName: 'Dayton',
            lastName: 'Marchese',
            number: '53',
            position: 'Forward',
            city: 'Boston',
            experience: '6',
          },
          {
            imageUrl:
              'https://assets.icaa.world/ff9d01d2-ae5a-4256-8805-2b6fc4488f32.jpg',
            firstName: 'Dave',
            lastName: 'Brown',
            number: '64',
            position: 'Flex',
            city: 'Boston',
            experience: '2',
          },
          {
            imageUrl:
              'https://assets.icaa.world/9d106066-b24f-4009-89e4-93d101e3e7c2.jpeg',
            firstName: 'Jay',
            lastName: 'Pusateri', // Jayson Pusateri
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

export default function ESPNPage() {
  useTitle('ESPN8: All Stars 2026 - ICAA');

  const sponsors = [
    {
      logoUrl:
        'https://assets.icaa.world/78939a33-6cda-4f07-9922-87419f18b861.png',
      websiteUrl: 'https://www.silverscreendesign.com/',
    },
    {
      logoUrl:
        'https://assets.icaa.world/934b85f0-2d0e-4c6a-bc8e-1bb8fa66b332.svg',
      websiteUrl: 'https://www.experiencekissimmee.com/',
    },
    {
      logoUrl:
        'https://assets.icaa.world/07d37824-656e-4975-95c7-36b6cf85de27.png',
      websiteUrl: 'https://coastalelectricsarasota.com/',
    },
    {
      logoUrl:
        'https://assets.icaa.world/cb44df9c-ec30-493a-9b75-3dcf66e0444e.png',
      websiteUrl: 'https://www.archerygamesboston.com/',
    },
    {
      logoUrl:
        'https://assets.icaa.world/afec2749-f882-46a5-8e57-d4818b970062.png',
      websiteUrl: 'https://combatdarchers.ca/en/',
    },
  ];

  return (
    <section className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-center">
        <img
          src="https://assets.icaa.world/1b266230-4d77-4360-8bb4-af814f83e2ec.png"
          alt="All Stars 2026"
          className="w-full max-w-4xl h-auto rounded-lg"
        />
      </div>
      <div className="flex justify-center">
        <img
          src="https://assets.icaa.world/16e6fb58-ef7d-4c84-8799-d325fae6a343.png"
          alt="ESPN8 The Ocho"
          className="w-full max-w-xs h-auto"
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 my-12">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>About The Sport</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">
              Learn about the fast-paced, high-energy sport of Combat Archery.
            </p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild className="w-full">
              <Link to="/about-sport">Learn More</Link>
            </Button>
          </div>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Full Rules</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">
              Get a quick overview of the rules or dive into the official ICAA
              rulebook.
            </p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild className="w-full">
              <Link to="/official-rules">View Rules</Link>
            </Button>
          </div>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Where to Play</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">
              Find a location that you can play Combat Archery Today!
            </p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild className="w-full">
              <Link to="/our-communities">Find a Community</Link>
            </Button>
          </div>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>About The ICAA</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-muted-foreground">
              Learn about the organization, its mission, and the people behind
              it.
            </p>
          </CardContent>
          <div className="p-6 pt-0">
            <Button asChild className="w-full">
              <Link to="/about-icaa">Meet The Team</Link>
            </Button>
          </div>
        </Card>
      </div>

      <div className="space-y-16 pt-16">
        {matches.map((match, matchIndex) => (
          <div key={match.name} className="space-y-8">
            <div className="relative text-center my-12">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t-2 border-primary" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-primary px-6 text-5xl font-bold tracking-tight text-secondary">
                  {match.name}
                </span>
              </div>
            </div>
            <div className="relative grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] lg:gap-x-8">
              {/* Team 1 */}
              <div className="space-y-6">
                <div
                  className="flex h-64 items-center justify-center rounded-lg p-4"
                  style={{ backgroundColor: match.teams[0].color }}
                >
                  <img
                    src={match.teams[0].logoUrl}
                    alt={`${match.teams[0].name} Logo`}
                    className={`${match.teams[0].logoClassName} w-auto mx-auto object-contain`}
                  />
                </div>
                <PlayerRoster
                  players={match.teams[0].players}
                  teamColor={match.teams[0].color}
                />
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
                <div
                  className="flex h-64 items-center justify-center rounded-lg p-4"
                  style={{ backgroundColor: match.teams[1].color }}
                >
                  <img
                    src={match.teams[1].logoUrl}
                    alt={`${match.teams[1].name} Logo`}
                    className={`${match.teams[1].logoClassName} w-auto mx-auto object-contain`}
                  />
                </div>
                <PlayerRoster
                  players={match.teams[1].players}
                  teamColor={match.teams[1].color}
                />
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Button asChild>
                <Link to="/vote">Vote for {match.name} MVP!</Link>
              </Button>
            </div>
            {matchIndex < matches.length - 1}
          </div>
        ))}
      </div>
      <SponsorsBanner sponsors={sponsors} />
    </section>
  );
}
