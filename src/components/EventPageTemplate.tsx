import { useTitle } from 'react-use';
import { useGetEvent, type Event } from '@/hooks/useEvent';
import { Link, useParams } from 'react-router-dom';
import { BackButton } from '@/components/BackButton';
import { EventDetailsCard } from '@/components/EventRegDetailsCard';
import { EventMediaSections } from '@/components/EventMediaSections';
import { PdfEmbed } from '@/components/PdfEmbed';
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
import { formatMoney } from '@/lib/money';
import { DateTime } from 'luxon';
import { buildPdfEmbedData, parseSafeHttpUrl } from '@/lib/embedUtils';

function EventDetailsPageSkeleton() {
  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 md:flex-row">
          <Skeleton className="h-32 w-32 flex-shrink-0 rounded-md" />
          <div className="w-full space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-9 w-48" />
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        {[0, 1].map((section) => (
          <Card key={section}>
            <CardHeader>
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

export default function EventDetailsPage() {
  useTitle('Event Details - ICAA');

  const { eventId } = useParams();
  const { data, isLoading } = useGetEvent(eventId!);

  return (
    <div className="px-4 py-4 md:px-6 xl:px-8">
      <div className="mb-4">
        <BackButton to="/events">Back to Events</BackButton>
      </div>
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
  const boston2026Schedule = [
    {
      game: 1,
      greenTeam: 'Panic Shooters',
      greenScore: 0,
      yellowTeam: 'Kitty Party',
      yellowScore: 7,
    },
    {
      game: 2,
      greenTeam: 'Upstarts',
      greenScore: 7,
      yellowTeam: 'Vortex',
      yellowScore: 7,
    },
    {
      game: 3,
      greenTeam: 'TimeOut',
      greenScore: 1,
      yellowTeam: 'Ottawa',
      yellowScore: 7,
    },
    {
      game: 4,
      greenTeam: 'Kitty Party',
      greenScore: 1,
      yellowTeam: 'Renegades',
      yellowScore: 7,
    },
    {
      game: 5,
      greenTeam: 'Vortex',
      greenScore: 7,
      yellowTeam: 'Panic Shooters',
      yellowScore: 1,
    },
    {
      game: 6,
      greenTeam: 'Ottawa',
      greenScore: 7,
      yellowTeam: 'Upstarts',
      yellowScore: 5,
    },
    {
      game: 7,
      greenTeam: 'Renegades',
      greenScore: 7,
      yellowTeam: 'TimeOut',
      yellowScore: 1,
    },
    {
      game: 8,
      greenTeam: 'Vortex',
      greenScore: 7,
      yellowTeam: 'Kitty Party',
      yellowScore: 2,
    },
    {
      game: 9,
      greenTeam: 'Upstarts',
      greenScore: 7,
      yellowTeam: 'Panic Shooters',
      yellowScore: 3,
    },
    {
      game: 10,
      greenTeam: 'Renegades',
      greenScore: 7,
      yellowTeam: 'Ottawa',
      yellowScore: 4,
    },
    {
      game: 11,
      greenTeam: 'Kitty Party',
      greenScore: 7,
      yellowTeam: 'TimeOut',
      yellowScore: 0,
    },
    {
      game: 12,
      greenTeam: 'Ottawa',
      greenScore: 7,
      yellowTeam: 'Vortex',
      yellowScore: 1,
    },
    {
      game: 13,
      greenTeam: 'Panic Shooters',
      greenScore: 0,
      yellowTeam: 'Renegades',
      yellowScore: 7,
    },
    {
      game: 14,
      greenTeam: 'TimeOut',
      greenScore: 0,
      yellowTeam: 'Upstarts',
      yellowScore: 7,
    },
    {
      game: 15,
      greenTeam: 'Ottawa',
      greenScore: 7,
      yellowTeam: 'Kitty Party',
      yellowScore: 0,
    },
    {
      game: 16,
      greenTeam: 'Renegades',
      greenScore: 7,
      yellowTeam: 'Vortex',
      yellowScore: 0,
    },
    {
      game: 17,
      greenTeam: 'TimeOut',
      greenScore: 7,
      yellowTeam: 'Panic Shooters',
      yellowScore: 2,
    },
    {
      game: 18,
      greenTeam: 'Kitty Party',
      greenScore: 3,
      yellowTeam: 'Upstarts',
      yellowScore: 7,
    },
    {
      game: 19,
      greenTeam: 'Panic Shooters',
      greenScore: 1,
      yellowTeam: 'Ottawa',
      yellowScore: 7,
    },
    {
      game: 20,
      greenTeam: 'Vortex',
      greenScore: 7,
      yellowTeam: 'TimeOut',
      yellowScore: 0,
    },
    {
      game: 21,
      greenTeam: 'Upstarts',
      greenScore: 2,
      yellowTeam: 'Renegades',
      yellowScore: 7,
    },
    {
      game: '22 (Semifinals)',
      greenTeam: 'Renegades (1)',
      greenScore: 7,
      yellowTeam: 'Vortex (4)',
      yellowScore: 0,
    },
    {
      game: '23 (Semifinals)',
      greenTeam: 'Ottawa (2)',
      greenScore: 4,
      yellowTeam: 'Upstarts (3)',
      yellowScore: 7,
    },
    {
      game: '24 (3rd Place)',
      greenTeam: 'Ottawa (2)',
      greenScore: 6,
      yellowTeam: 'Vortex (4)',
      yellowScore: 3,
    },
    {
      game: '25 (Finals)',
      greenTeam: 'Renegades (1)',
      greenScore: 7,
      yellowTeam: 'Upstarts (3)',
      yellowScore: 2,
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
  const isBoston2026 = event.id === 'fa5aa500-a528-4213-9b48-c318d549ad85';
  const rulesDocUrl = event.rulesDocLink
    ? parseSafeHttpUrl(event.rulesDocLink)
    : null;
  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 xl:flex-row xl:flex-wrap xl:items-center xl:justify-between">
          <EventDetailsCard event={event} embedded />

          <div className="flex flex-col items-center justify-center xl:items-end">
            {isRegistrationClosed ? (
              <p className="text-destructive font-semibold">
                Registration has closed
              </p>
            ) : (
              <>
                <div className="flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
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
                <p className="text-muted-foreground pt-2 text-center text-sm xl:text-right">
                  Registration Closes:{' '}
                  {closeRegDate.toLocaleString(DateTime.DATE_HUGE)}
                </p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-primary">Standings</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-center">
            {isBostonPlayInEvent ? (
              <div className="mx-auto w-full max-w-2xl 2xl:max-w-none">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16 text-center">Rank</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead className="text-center">Record</TableHead>
                      <TableHead className="text-right">Net Points</TableHead>
                      <TableHead className="text-right">Points For</TableHead>
                      <TableHead className="text-right">
                        Points Against
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-center font-medium">
                        1
                      </TableCell>
                      <TableCell className="font-medium">
                        Boston Renegades
                      </TableCell>
                      <TableCell className="text-center">6-0</TableCell>
                      <TableCell className="text-right">30</TableCell>
                      <TableCell className="text-right">30</TableCell>
                      <TableCell className="text-right">0</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center font-medium">
                        2
                      </TableCell>
                      <TableCell className="font-medium">Draw Blood</TableCell>
                      <TableCell className="text-center">4-2</TableCell>
                      <TableCell className="text-right">0</TableCell>
                      <TableCell className="text-right">15</TableCell>
                      <TableCell className="text-right">15</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center font-medium">
                        3
                      </TableCell>
                      <TableCell className="font-medium">Tag Alongs</TableCell>
                      <TableCell className="text-center">2-4</TableCell>
                      <TableCell className="text-right">-2</TableCell>
                      <TableCell className="text-right">14</TableCell>
                      <TableCell className="text-right">16</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="text-center font-medium">
                        4
                      </TableCell>
                      <TableCell className="font-medium">V</TableCell>
                      <TableCell className="text-center">0-6</TableCell>
                      <TableCell className="text-right">-28</TableCell>
                      <TableCell className="text-right">1</TableCell>
                      <TableCell className="text-right">29</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            ) : isBostonChampionships ? (
              <img
                src="/images/other/2025_BC_Results.PNG"
                alt="2025 Boston Championship Final Standings"
                className="mx-auto w-full max-w-2xl rounded-lg 2xl:max-w-none"
              />
            ) : isBoston2026 ? (
              <img
                src="https://assets.icaa.world/f8b99126-68b8-4799-ac88-804d72a06732.png"
                alt="2026 Boston Championship Final Standings"
                className="mx-auto w-full max-w-2xl rounded-lg 2xl:max-w-none"
              />
            ) : (
              <p>Standings coming soon</p>
            )}
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-primary">Schedule</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[36rem] overflow-y-auto 2xl:max-h-none 2xl:overflow-y-visible">
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
            ) : isBoston2026 ? (
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
                  {boston2026Schedule.map((result) => (
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

      <EventMediaSections event={event} />

      {rulesDocUrl ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Rules</CardTitle>
          </CardHeader>
          <CardContent>
            <PdfEmbed
              src={buildPdfEmbedData(rulesDocUrl.href).embed}
              title="Event Rules"
              className="h-[50vh]"
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
