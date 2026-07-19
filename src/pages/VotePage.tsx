import { useState } from 'react';
import { useTitle } from 'react-use';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ArrowLeft, CheckCircle, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const VOTE_TIMELOCK_ENABLED =
  (import.meta as any).env.VITE_ENABLE_VOTE_TIMELOCK === 'true';

const matches = [
  {
    name: 'EASTERN FINALS',
    startTime: '2026-08-07T19:00:00-04:00', // 7:00 PM EDT
    teams: [
      {
        name: 'Team Boston',
        color: '#70b2e0',
        logoUrl:
          'https://assets.icaa.world/42e777a4-2757-4bbf-bdaa-79303aafc9ba.png',
        logoClassName: 'h-32 md:h-40',
        players: [
          {
            imageUrl:
              'https://assets.icaa.world/9ccd9c08-d3cb-4a25-a386-675c9c299c61.jpg',
            firstName: 'Cameron',
            lastName: 'Cardwell',
            number: '17',
          },
          {
            imageUrl:
              'https://assets.icaa.world/b7eccda4-f047-4ea8-911c-3a243fc9aa48.jpeg',
            firstName: 'Nate',
            lastName: 'Langh',
            number: '3',
          },
          {
            imageUrl:
              'https://assets.icaa.world/2b18bf29-bf2a-4d78-b32c-5aa51dc500e6.png',
            firstName: 'Bob',
            lastName: 'Beng',
            number: '80',
          },
          {
            imageUrl:
              'https://assets.icaa.world/2e13269a-5570-4618-9e34-1321933d12de.jpeg',
            firstName: 'Andrew',
            lastName: 'Mellen',
            number: '45',
          },
          {
            imageUrl:
              'https://assets.icaa.world/32fc6646-16cc-4017-a6df-8046641eaef9.jpg',
            firstName: 'Katt',
            lastName: 'H.',
            number: '13',
          },
          {
            imageUrl:
              'https://assets.icaa.world/701cc5fa-6695-4706-afc3-3607f684264a.jpg',
            firstName: 'David',
            lastName: 'McMillan',
            number: '20',
          },
          {
            imageUrl: '',
            firstName: 'Nick',
            lastName: 'Rancourt',
            number: '5',
          },
        ],
      },
      {
        name: 'Team Ottawa',
        color: '#33593a',
        logoUrl:
          'https://assets.icaa.world/e135fd46-636c-4758-b78b-4729d182a4fc.png',
        logoClassName: 'h-32 md:h-40',
        players: [
          {
            imageUrl: '',
            firstName: 'Kyle',
            lastName: 'White',
            number: '13',
          },
          {
            imageUrl:
              'https://assets.icaa.world/b0da1aed-85d5-4705-bb09-00956dd01a39.png',
            firstName: 'Brandon',
            lastName: 'Nemeth',
            number: '7',
          },
          {
            imageUrl: '',
            firstName: 'Angel',
            lastName: 'MacEachern',
            number: '1',
          },
          {
            imageUrl:
              'https://assets.icaa.world/93ebc1f8-147a-4983-b37b-848b3138042d.jpg',
            firstName: 'Andrew',
            lastName: 'Bui',
            number: '23',
          },
          {
            imageUrl:
              'https://assets.icaa.world/e90de502-456c-48b4-88d7-62d9fd768d99.jpg',
            firstName: 'Kyle',
            lastName: 'Best',
            number: '6',
          },
          {
            imageUrl: '',
            firstName: 'Danny',
            lastName: 'Pleshek',
            number: '4',
          },
          {
            imageUrl:
              'https://assets.icaa.world/29b61f2a-caed-4f10-96ed-57db5f1a95f2.jpg',
            firstName: 'Mark',
            lastName: 'Elrod',
            number: '8',
          },
        ],
      },
    ],
  },
  {
    name: 'WESTERN FINALS',
    startTime: '2026-08-07T19:00:00-04:00', // 7:00 PM EDT
    teams: [
      {
        name: 'Team Toronto',
        color: '#b02026',
        logoUrl:
          'https://assets.icaa.world/b9715dc3-dd6a-4be4-8df7-eb63bc1cd771.png',
        logoClassName: 'h-32 md:h-40',
        players: [
          {
            imageUrl:
              'https://assets.icaa.world/19639410-208f-4b44-bcf2-fec0f8ecd5c1.jpg',
            firstName: 'James',
            lastName: 'McDougall',
            number: '3',
          },
          {
            imageUrl: '',
            firstName: 'Tim',
            lastName: 'Ahong',
            number: '21',
          },
          {
            imageUrl: '',
            firstName: 'Russel',
            lastName: 'Padua',
            number: '13',
          },
          {
            imageUrl:
              'https://assets.icaa.world/2775b4c8-e476-4382-9dc0-a4484d5b0a99.png',
            firstName: 'Daniel',
            lastName: 'Martinez',
            number: '28',
          },
          {
            imageUrl: '',
            firstName: 'Christina',
            lastName: 'Laconsay',
            number: '14',
          },
          {
            imageUrl:
              'https://assets.icaa.world/320a250f-f069-4ca2-97c5-d7133640d2ae.JPG',
            firstName: 'Yousef',
            lastName: 'Hariri',
            number: '76',
          },
          {
            imageUrl:
              'https://assets.icaa.world/578f8d21-5ca0-4287-9b39-b881206be767.jpg',
            firstName: 'Sim',
            lastName: 'Singh',
            number: '25',
          },
        ],
      },
      {
        name: 'Team Barrie',
        color: '#3163a6',
        logoUrl:
          'https://assets.icaa.world/fa86e579-203d-4361-83e6-77c2ac405bb4.png',
        logoClassName: 'h-24 md:h-32',
        players: [
          {
            imageUrl:
              'https://assets.icaa.world/e5c921e5-dc44-49ad-be25-9b7629a2f72c.jpeg',
            firstName: 'Thomas',
            lastName: 'Parker',
            number: '6',
          },
          {
            imageUrl:
              'https://assets.icaa.world/4cd090bb-4f3d-4702-bd2e-1e2867744418.jpeg',
            firstName: 'Kristin',
            lastName: 'Drescher',
            number: '5',
          },
          {
            imageUrl:
              'https://assets.icaa.world/57765442-59c3-494a-b284-7013ea85f969.jpeg',
            firstName: 'Robert',
            lastName: 'Chitiu',
            number: '3',
          },
          {
            imageUrl:
              'https://assets.icaa.world/8803d050-b749-4905-9033-b9bbdf473059.png',
            firstName: 'BJ',
            lastName: 'Thompson',
            number: '28',
          },
          {
            imageUrl:
              'https://assets.icaa.world/e9f9bdbb-a687-450a-b630-d73dcf68d315.jpeg',
            firstName: 'Dayton',
            lastName: 'Marchese',
            number: '53',
          },
          {
            imageUrl:
              'https://assets.icaa.world/ff9d01d2-ae5a-4256-8805-2b6fc4488f32.jpg',
            firstName: 'Dave',
            lastName: 'Brown',
            number: '64',
          },
          {
            imageUrl:
              'https://assets.icaa.world/9d106066-b24f-4009-89e4-93d101e3e7c2.jpeg',
            firstName: 'Jay',
            lastName: 'Pusateri',
            number: '84',
          },
        ],
      },
    ],
  },
];

export default function VotePage() {
  useTitle('MVP Voting - ICAA');

  const [votes, setVotes] = useState<{ [matchName: string]: string }>({});
  const [submitted, setSubmitted] = useState<{ [matchName: string]: boolean }>(
    {},
  );

  const handleVote = (matchName: string, playerIdentifier: string) => {
    setVotes((prev) => ({
      ...prev,
      [matchName]: playerIdentifier,
    }));
  };

  const handleSubmit = (matchName: string) => {
    setSubmitted((prev) => ({ ...prev, [matchName]: true }));
  };

  const eventHasStarted = (startTime: string) =>
    new Date() >= new Date(startTime);
  const canSubmit = (startTime: string) =>
    !VOTE_TIMELOCK_ENABLED || eventHasStarted(startTime);

  return (
    <section className="container mx-auto space-y-12 px-4 py-8">
      <div className="mb-4">
        <Button asChild>
          <Link to="/espn#vote">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to ESPN Page
          </Link>
        </Button>
      </div>
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">MVP Voting</h1>
        <p className="text-muted-foreground">Select one MVP for each match.</p>
      </div>

      {matches.map((match) => (
        <Card key={match.name} className="max-w-5xl mx-auto">
          {submitted[match.name] ? (
            <div className="flex flex-col items-center gap-4 p-8 text-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <h3 className="text-2xl font-bold">Thank You For Voting!</h3>
              <p className="text-muted-foreground">
                Your MVP vote for the {match.name} has been cast.
              </p>
            </div>
          ) : (
            <>
              <CardHeader className="text-center">
                <CardTitle>{match.name} MVP</CardTitle>
                <CardDescription>
                  Choose the player you think was the Most Valuable Player.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {match.teams.map((team) => (
                  <div key={team.name}>
                    <div
                      className="flex items-center justify-center rounded-lg p-4 mb-4 mx-auto max-w-sm"
                      style={{ backgroundColor: team.color }}
                    >
                      <img
                        src={team.logoUrl}
                        alt={`${team.name} Logo`}
                        className={cn('w-auto', team.logoClassName)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                      {team.players.map((player) => {
                        const playerIdentifier = `${player.firstName}-${player.lastName}`;
                        const isSelected =
                          votes[match.name] === playerIdentifier;
                        return (
                          <div
                            key={playerIdentifier}
                            className={cn(
                              'flex flex-col cursor-pointer items-center space-y-2 rounded-lg border p-4 transition-all hover:bg-muted/50 text-center',
                              isSelected &&
                                'border-primary ring-2 ring-primary',
                            )}
                            onClick={() =>
                              handleVote(match.name, playerIdentifier)
                            }
                          >
                            <Avatar className="h-28 w-28">
                              <AvatarImage src={player.imageUrl} />
                              <AvatarFallback className="bg-muted">
                                <User className="h-14 w-14 text-muted-foreground" />
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{`${player.firstName} ${player.lastName}`}</div>
                            <div className="text-sm text-muted-foreground">
                              #{player.number}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={() =>
                      canSubmit(match.startTime) && handleSubmit(match.name)
                    }
                    disabled={!votes[match.name] || !canSubmit(match.startTime)}
                  >
                    {canSubmit(match.startTime)
                      ? `Submit Vote for ${match.name}`
                      : 'Voting will open when the event starts'}
                  </Button>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      ))}
    </section>
  );
}
