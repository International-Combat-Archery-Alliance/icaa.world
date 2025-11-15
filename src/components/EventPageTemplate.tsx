import { useTitle } from 'react-use';
import { useGetEvent, type Event } from '@/hooks/useEvent';
import { Link, useParams } from 'react-router-dom';
import { EventDetailsCard } from '@/components/EventRegDetailsCard';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { formatMoney } from '@/api/money';
import { DateTime } from 'luxon';

function EventDetailsPageSkeleton() {
  return (
    <div className="mx-auto max-w-screen-xl grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Right Column Skeleton */}
      <div className="lg:col-start-3 lg:col-span-1 lg:row-span-3">
        <Card className="h-full">
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-48" />
          </CardContent>
        </Card>
      </div>

      {/* Left Column Skeletons */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-24" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[50vh] w-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function EventDetailsPage() {
  useTitle('Event Details - ICAA');

  const { eventId } = useParams();
  const { data, isLoading } = useGetEvent(eventId!);

  return (
    <div className="px-4 py-4">
      <Link to="/events" className="back-btn">
        ← Back to Events
      </Link>
      {isLoading ? (
        <EventDetailsPageSkeleton />
      ) : data ? (
        <EventDetailsTemplate event={data.event} />
      ) : null}
    </div>
  );
}

function EventDetailsTemplate({ event }: { event: Event }) {
  const byIndividualOpt = event.registrationOptions.find(
    (e) => e.registrationType === 'ByIndividual',
  );
  const byTeamOpt = event.registrationOptions.find(
    (e) => e.registrationType === 'ByTeam',
  );
  const closeRegDate = DateTime.fromISO(event.registrationCloseTime, {
    zone: event.timeZone,
  });
  const isRegistrationClosed = DateTime.now() > closeRegDate;
  const bostonChampionshipsGameResults = [
    {
      game: 1,
      greenTeam: 'Boston Renegades',
      greenScore: 6,
      yellowTeam: 'Draw Blood',
      yellowScore: 1,
    },
    {
      game: 2,
      greenTeam: 'Lolipops',
      greenScore: 1,
      yellowTeam: 'Casual Tease',
      yellowScore: 6,
    },
    {
      game: 3,
      greenTeam: 'Tag Alongs',
      greenScore: 1,
      yellowTeam: 'MTL Originals',
      yellowScore: 6,
    },
    {
      game: 4,
      greenTeam: 'Boston Renegades',
      greenScore: 7,
      yellowTeam: 'Lolipops',
      yellowScore: 0,
    },
    {
      game: 5,
      greenTeam: 'MTL Originals',
      greenScore: 6,
      yellowTeam: 'Draw Blood',
      yellowScore: 1,
    },
    {
      game: 6,
      greenTeam: 'Tag Alongs',
      greenScore: 3,
      yellowTeam: 'Casual Tease',
      yellowScore: 4,
    },
    {
      game: 7,
      greenTeam: 'MTL Originals',
      greenScore: 3,
      yellowTeam: 'Boston Renegades',
      yellowScore: 4,
    },
    {
      game: 8,
      greenTeam: 'Draw Blood',
      greenScore: 0,
      yellowTeam: 'Casual Tease',
      yellowScore: 7,
    },
    {
      game: 9,
      greenTeam: 'Lolipops',
      greenScore: 2,
      yellowTeam: 'Tag Alongs',
      yellowScore: 4,
    },
    {
      game: 10,
      greenTeam: 'Casual Tease',
      greenScore: 1,
      yellowTeam: 'Boston Renegades',
      yellowScore: 6,
    },
    {
      game: 11,
      greenTeam: 'MTL Originals',
      greenScore: 7,
      yellowTeam: 'Lolipops',
      yellowScore: 0,
    },
    {
      game: 12,
      greenTeam: 'Draw Blood',
      greenScore: 4,
      yellowTeam: 'Tag Alongs',
      yellowScore: 1,
    },
    {
      game: 13,
      greenTeam: 'Casual Tease',
      greenScore: 4,
      yellowTeam: 'MTL Originals',
      yellowScore: 3,
    },
    {
      game: 14,
      greenTeam: 'Lolipops',
      greenScore: 4,
      yellowTeam: 'Draw Blood',
      yellowScore: 3,
    },
    {
      game: 15,
      greenTeam: 'Boston Renegades',
      greenScore: 6,
      yellowTeam: 'Tag Alongs',
      yellowScore: 1,
    },
  ];
  const bostonPlayInGameResults = [
    {
      game: 1,
      homeTeam: 'V',
      homeScore: 0,
      awayTeam: 'Tag Alongs',
      awayScore: 5,
    },
    {
      game: 2,
      homeTeam: 'Draw Blood',
      homeScore: 0,
      awayTeam: 'Renegades',
      awayScore: 5,
    },
    {
      game: 3,
      homeTeam: 'Renegades',
      homeScore: 5,
      awayTeam: 'V',
      awayScore: 0,
    },
    {
      game: 4,
      homeTeam: 'Tag Alongs',
      homeScore: 2,
      awayTeam: 'Draw Blood',
      awayScore: 3,
    },
    {
      game: 5,
      homeTeam: 'V',
      homeScore: 0,
      awayTeam: 'Draw Blood',
      awayScore: 5,
    },
    {
      game: 6,
      homeTeam: 'Renegades',
      homeScore: 5,
      awayTeam: 'Tag Alongs',
      awayScore: 0,
    },
    {
      game: 7,
      homeTeam: 'Tag Alongs',
      homeScore: 5,
      awayTeam: 'V',
      awayScore: 0,
    },
    {
      game: 8,
      homeTeam: 'Renegades',
      homeScore: 5,
      awayTeam: 'Draw Blood',
      awayScore: 0,
    },
    {
      game: 9,
      homeTeam: 'V',
      homeScore: 0,
      awayTeam: 'Renegades',
      awayScore: 5,
    },
    {
      game: 10,
      homeTeam: 'Draw Blood',
      homeScore: 3,
      awayTeam: 'Tag Alongs',
      awayScore: 2,
    },
    {
      game: 11,
      homeTeam: 'Draw Blood',
      homeScore: 4,
      awayTeam: 'V',
      awayScore: 1,
    },
    {
      game: 12,
      homeTeam: 'Tag Alongs',
      homeScore: 0,
      awayTeam: 'Renegades',
      awayScore: 5,
    },
  ];
  const isBostonPlayInEvent =
    event.id === '0219a408-e86a-4404-bc0d-473e68b310dc';
  const isBostonChampionships =
    event.id === '78af69ec-e323-436b-96b6-1b5dc9acf46b';
  return (
    <div className="mx-auto max-w-screen-xl grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Details */}
      <div className="lg:col-span-2 lg:row-start-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <EventDetailsCard event={event} />

            {isRegistrationClosed ? (
              <p className="text-center font-semibold text-destructive my-4 pt-2">
                Registration has closed
              </p>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row justify-center gap-4 my-4">
                  {byIndividualOpt !== undefined ? (
                    <Button asChild>
                      <Link to={`/events/${event.id}/register-free-agent`}>
                        Free Agent Sign Up ({formatMoney(byIndividualOpt.price)}
                        )
                      </Link>
                    </Button>
                  ) : null}
                  {byTeamOpt !== undefined ? (
                    <Button asChild>
                      <Link to={`/events/${event.id}/register-team`}>
                        Team Sign Up ({formatMoney(byTeamOpt.price)})
                      </Link>
                    </Button>
                  ) : null}
                </div>
                <p className="text-center text-sm text-muted-foreground pt-2">
                  Registration Closes:{' '}
                  {closeRegDate.toLocaleString(DateTime.DATE_HUGE)}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Standings */}
      <div className="lg:col-span-2 lg:row-start-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Standings</CardTitle>
          </CardHeader>
          <CardContent>
            {isBostonPlayInEvent ? (
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
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>Boston Renegades</TableCell>
                    <TableCell>6-0</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>30</TableCell>
                    <TableCell>0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2</TableCell>
                    <TableCell>Draw Blood</TableCell>
                    <TableCell>4-2</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell>15</TableCell>
                    <TableCell>15</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>3</TableCell>
                    <TableCell>Tag Alongs</TableCell>
                    <TableCell>2-4</TableCell>
                    <TableCell>-2</TableCell>
                    <TableCell>14</TableCell>
                    <TableCell>16</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>4</TableCell>
                    <TableCell>V</TableCell>
                    <TableCell>0-6</TableCell>
                    <TableCell>-28</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>29</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : isBostonChampionships ? (
              <img
                src="/images/other/2025_BC_Results.PNG"
                alt="2025 Boston Championship Final Standings"
                className="w-full rounded-lg"
              />
            ) : (
              <p>Standings coming soon</p>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Schedule */}
      <div className="lg:col-start-3 lg:col-span-1 lg:row-start-1 lg:row-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-primary">Schedule</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[50vh] overflow-y-auto lg:max-h-none lg:overflow-y-visible">
            {isBostonPlayInEvent ? (
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
                  {bostonPlayInGameResults.map((result) => (
                    <TableRow key={result.game}>
                      <TableCell className="text-center">
                        {result.game}
                      </TableCell>
                      <TableCell className="text-center">
                        {result.homeTeam}
                      </TableCell>
                      <TableCell className="text-center">
                        {result.homeScore}
                      </TableCell>
                      <TableCell className="text-center">
                        {result.awayScore}
                      </TableCell>
                      <TableCell className="text-center">
                        {result.awayTeam}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : isBostonChampionships ? (
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
                  {bostonChampionshipsGameResults.map((result) => (
                    <TableRow key={result.game}>
                      <TableCell className="text-center">
                        {result.game}
                      </TableCell>
                      <TableCell className="text-center">
                        {result.greenTeam}
                      </TableCell>
                      <TableCell className="text-center">
                        {result.greenScore}
                      </TableCell>
                      <TableCell className="text-center">
                        {result.yellowScore}
                      </TableCell>
                      <TableCell className="text-center">
                        {result.yellowTeam}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p>Schedule coming soon</p>
            )}
          </CardContent>
        </Card>
      </div>
      {/* Rules */}
      <div className="lg:col-span-2 lg:row-start-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Rules</CardTitle>
          </CardHeader>
          <CardContent>
            {event.rulesDocLink ? (
              <iframe
                src={`https://drive.google.com/viewerng/viewer?embedded=true&url=https://icaa.world/docs/${event.rulesDocLink}`}
                className="w-full h-[50vh] bg-white border-0 rounded-xl"
              />
            ) : (
              <p>Tournament Format coming soon.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
