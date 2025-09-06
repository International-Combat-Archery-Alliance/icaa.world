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
                  <TableCell>0-0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>2</TableCell>
                  <TableCell>Draw Blood</TableCell>
                  <TableCell>0-0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>3</TableCell>
                  <TableCell>Tag Alongs</TableCell>
                  <TableCell>0-0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>4</TableCell>
                  <TableCell>Team V</TableCell>
                  <TableCell>0-0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      {/* Schedule */}
      <div className="lg:col-start-3 lg:col-span-1 lg:row-start-1 lg:row-span-3">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-primary">Schedule</CardTitle>
          </CardHeader>
          <CardContent className="max-h-96 overflow-y-auto lg:max-h-none lg:overflow-y-visible">
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
                <TableRow>
                  <TableCell className="text-center">1</TableCell>
                  <TableCell className="text-center">Team V</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">Tag Alongs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">2</TableCell>
                  <TableCell className="text-center">Draw Blood</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">Renegades</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">3</TableCell>
                  <TableCell className="text-center">Renegades</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">Team V</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">4</TableCell>
                  <TableCell className="text-center">Tag Alongs</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">Draw Blood</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">5</TableCell>
                  <TableCell className="text-center">Team V</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">Draw Blood</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">6</TableCell>
                  <TableCell className="text-center">Renegades</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">Tag Alongs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">7</TableCell>
                  <TableCell className="text-center">Tag Alongs</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">Team V</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">8</TableCell>
                  <TableCell className="text-center">Renegades</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">Draw Blood</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">9</TableCell>
                  <TableCell className="text-center">Team V</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">Renegades</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">10</TableCell>
                  <TableCell className="text-center">Draw Blood</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">Tag Alongs</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">11</TableCell>
                  <TableCell className="text-center">Draw Blood</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">Team V</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-center">12</TableCell>
                  <TableCell className="text-center">Tag Alongs</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">-</TableCell>
                  <TableCell className="text-center">Renegades</TableCell>
                </TableRow>
              </TableBody>
            </Table>
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
                src={`/docs/${event.rulesDocLink}`}
                className="w-full h-[50vh] bg-white border-0 rounded-xl"
              />
            ) : (
              <p>Rules document not available for this event.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
