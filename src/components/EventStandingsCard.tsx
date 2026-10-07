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
import { useGetStandings, liveRevalidateInterval } from '@/hooks/useEvent';
import type { Event } from '@/hooks/useEvent';

interface EventStandingsCardProps {
  eventId: string;
  eventStatus: Event['status'];
  hasSchedule: boolean | undefined;
}

function EventStandingsCard({
  eventId,
  eventStatus,
  hasSchedule,
}: EventStandingsCardProps) {
  const revalidate = liveRevalidateInterval(eventStatus);
  const { data, isLoading, isError } = useGetStandings(eventId, revalidate);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Standings</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading || hasSchedule === undefined ? (
          <Skeleton className="h-32 w-full" />
        ) : isError ? (
          <p>Couldn&apos;t load standings</p>
        ) : !hasSchedule ? (
          <p>No schedule yet</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Team</TableHead>
                <TableHead>Record</TableHead>
                <TableHead>Net Points</TableHead>
                <TableHead>Points For</TableHead>
                <TableHead>Points Against</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(data?.standings ?? []).map((row) => (
                <TableRow key={row.teamId}>
                  <TableCell>{row.dns ? '–' : row.rank}</TableCell>
                  <TableCell>{row.teamName}</TableCell>
                  <TableCell>
                    {row.wins}-{row.losses}
                  </TableCell>
                  <TableCell>{row.net}</TableCell>
                  <TableCell>{row.pf}</TableCell>
                  <TableCell>{row.pa}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export { EventStandingsCard };
