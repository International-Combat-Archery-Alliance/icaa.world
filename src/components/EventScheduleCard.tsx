import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetGames, liveRevalidateInterval } from '@/hooks/useEvent';
import type { Event, Game } from '@/hooks/useEvent';

interface EventScheduleCardProps {
  eventId: string;
  eventStatus: Event['status'];
}

function sideLabel(game: Game, side: 'sideA' | 'sideB'): string {
  const entry = game[side];
  if (entry.isBye) {
    return 'BYE';
  }
  return entry.teamName ?? 'TBD';
}

function EventScheduleCard({ eventId, eventStatus }: EventScheduleCardProps) {
  const revalidate = liveRevalidateInterval(eventStatus);
  const { data, isLoading, isError } = useGetGames(eventId, revalidate);

  const games = data?.games ?? [];
  const hasSchedule = games.length > 0;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-primary">Schedule</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[50vh] overflow-y-auto lg:max-h-none lg:overflow-y-visible">
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : isError ? (
          <p>Couldn&apos;t load schedule</p>
        ) : !hasSchedule ? (
          <p>No schedule yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Game</TableHead>
                <TableHead className="text-center">Home</TableHead>
                <TableHead colSpan={2} className="text-center">
                  Score
                </TableHead>
                <TableHead className="text-center">Away</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game, index) => (
                <TableRow key={game.id ?? index}>
                  <TableCell className="text-center">{index + 1}</TableCell>
                  <TableCell className="text-center">
                    {sideLabel(game, 'sideA')}
                  </TableCell>
                  <TableCell className="text-center">
                    {game.scoreA ?? '–'}
                  </TableCell>
                  <TableCell className="text-center">
                    {game.scoreB ?? '–'}
                  </TableCell>
                  <TableCell className="text-center">
                    {sideLabel(game, 'sideB')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export { EventScheduleCard };
