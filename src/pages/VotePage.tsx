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
import { CheckCircle } from 'lucide-react';

const matches = [
  {
    name: 'EASTERN FINALS',
    teams: [
      {
        name: 'Team Boston',
        logoUrl: '/images/espn/BostonLogo.png',
        logoClassName: 'h-32 md:h-40',
        players: [
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Cameron',
            lastName: 'Cardwell',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Nate',
            lastName: 'Langh',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Bob',
            lastName: 'Beng',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Andrew',
            lastName: 'Mellen',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Katt',
            lastName: 'H.',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'David',
            lastName: 'McMillan',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Nick',
            lastName: 'Rancourt',
          },
        ],
      },
      {
        name: 'Team Ottawa',
        logoUrl: '/images/espn/OttawaLogo.png',
        logoClassName: 'h-32 md:h-40',
        players: [
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Kyle',
            lastName: 'White',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Brandon',
            lastName: 'Nemeth',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Angel',
            lastName: 'MacEachern',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Andrew',
            lastName: 'Bui',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Kyle',
            lastName: 'Best',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Danny',
            lastName: 'Pleshek',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Mark',
            lastName: 'Elrod',
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
        logoClassName: 'h-32 md:h-40',
        players: [
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'James',
            lastName: 'McDougall',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Tim',
            lastName: 'Ahong',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Russel',
            lastName: 'Padua',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Daniel',
            lastName: 'Martinez',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Christina',
            lastName: 'Player',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Yousef',
            lastName: 'Hariri',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Sim',
            lastName: 'Singh',
          },
        ],
      },
      {
        name: 'Team Barrie',
        logoUrl: '/images/espn/BarrieLogo.png',
        logoClassName: 'h-24 md:h-32',
        players: [
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Thomas',
            lastName: 'Parker',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Kristin',
            lastName: 'Drescher',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Robert',
            lastName: 'Chitiu',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'BJ',
            lastName: 'Thompson',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Dayton',
            lastName: 'Marchese',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Dave',
            lastName: 'Brown',
          },
          {
            imageUrl: '/images/espn/player.png',
            firstName: 'Jay',
            lastName: 'Pusateri',
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

  return (
    <section className="container mx-auto space-y-12 px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">MVP Voting</h1>
        <p className="text-muted-foreground">Select one MVP for each match.</p>
      </div>

      {matches.map((match) => (
        <Card key={match.name}>
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
                    <img
                      src={team.logoUrl}
                      alt={`${team.name} Logo`}
                      className={cn('w-auto mx-auto mb-4', team.logoClassName)}
                    />
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
                            <Avatar className="h-20 w-20">
                              <AvatarImage src={player.imageUrl} />
                              <AvatarFallback>
                                {player.firstName[0]}
                                {player.lastName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{`${player.firstName} ${player.lastName}`}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
                <div className="flex justify-center pt-4">
                  <Button
                    size="lg"
                    onClick={() => handleSubmit(match.name)}
                    disabled={!votes[match.name]}
                  >
                    Submit Vote for {match.name}
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
