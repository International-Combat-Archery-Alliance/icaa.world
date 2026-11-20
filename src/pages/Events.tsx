import React, { useState } from 'react';
import { AssetImage } from '@/components/AssetImage';
import { useGetEvents, type Event } from '../hooks/useEvent';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DateTime } from 'luxon';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { formatMoney } from '@/lib/money';
import { cn } from '@/lib/utils';

export default function Events() {
  const { data, isPending, isFetching, error, refetch } = useGetEvents();

  // TODO: eventually support paginating through multiple pages
  const [pageNum] = useState(0);

  return (
    <div className="px-4 py-4">
      {error ? (
        <ErrorMessage
          mainMessage="Error Loading Events"
          subMessage="Failed to load events. Please try again later."
          refetch={refetch}
        />
      ) : (
        <EventContent
          events={data?.pages[pageNum].data}
          isFetching={isPending || isFetching}
          refetch={refetch}
        />
      )}
    </div>
  );
}

function CardGrid({ children }: { children: React.ReactNode[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {children}
    </div>
  );
}

function EventContent({
  events,
  isFetching,
  refetch,
}: {
  events: Event[] | undefined;
  isFetching: boolean;
  refetch: () => void;
}) {
  if (isFetching) {
    return (
      <CardGrid>
        {Array.from({ length: 6 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </CardGrid>
    );
  }

  if (events === undefined || events.length === 0) {
    return (
      <ErrorMessage
        mainMessage="No events found!"
        subMessage="We don't have any events to sign up for right now, please check back later!"
        refetch={refetch}
      />
    );
  }

  const now = DateTime.now();
  const upcoming = events
    .filter(
      (event) =>
        DateTime.fromISO(event.endTime, { zone: event.timeZone }) >= now,
    )
    .sort(
      (a, b) =>
        DateTime.fromISO(a.startTime, { zone: a.timeZone }).toMillis() -
        DateTime.fromISO(b.startTime, { zone: b.timeZone }).toMillis(),
    );
  const past = events
    .filter(
      (event) =>
        DateTime.fromISO(event.endTime, { zone: event.timeZone }) < now,
    )
    .sort(
      (a, b) =>
        DateTime.fromISO(b.startTime, { zone: b.timeZone }).toMillis() -
        DateTime.fromISO(a.startTime, { zone: a.timeZone }).toMillis(),
    );

  return (
    <div className="space-y-8">
      {upcoming.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-primary text-2xl font-semibold">
            Upcoming Events
          </h2>
          <CardGrid>
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </CardGrid>
        </section>
      ) : (
        <p className="text-muted-foreground text-sm">
          No upcoming events scheduled.
        </p>
      )}

      {past.length > 0 ? (
        <section className="space-y-4">
          <h2 className="text-primary text-2xl font-semibold">Past Events</h2>
          <CardGrid>
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </CardGrid>
        </section>
      ) : null}
    </div>
  );
}

function EventCard({ event, className }: { event: Event; className?: string }) {
  const date = DateTime.fromISO(event.startTime, { zone: event.timeZone });
  const closeRegDate = DateTime.fromISO(event.registrationCloseTime, {
    zone: event.timeZone,
  });
  const isRegistrationClosed = DateTime.now() > closeRegDate;
  const isEventInPast =
    DateTime.now() > DateTime.fromISO(event.endTime, { zone: event.timeZone });
  const showRegistrationClosed = isRegistrationClosed && !isEventInPast;

  const byIndividualOpt = event.registrationOptions.find(
    (e) => e.registrationType === 'ByIndividual',
  );
  const byTeamOpt = event.registrationOptions.find(
    (e) => e.registrationType === 'ByTeam',
  );

  return (
    <Card className={cn('h-full', className)}>
      <CardHeader className="items-center text-center">
        <div className="mb-4 flex h-28 w-full items-center justify-center">
          {event.imageName ? (
            <AssetImage
              src={event.imageName}
              alt={`${event.name} logo`}
              imageWidth={320}
              imageFit="scale-down"
              className="max-h-full w-auto max-w-[140px] object-contain"
            />
          ) : null}
        </div>
        <CardTitle className="min-h-[3.5rem] leading-tight text-balance">
          {event.name}
        </CardTitle>
        <CardDescription className="min-h-[2.75rem]">
          <div>{event.location.name}</div>
          <div>
            {event.location.address.city}, {event.location.address.state}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <div className="min-h-[3.25rem]">
          <div>{date.toLocaleString(DateTime.DATE_HUGE)}</div>
          <div>
            {date.toLocaleString({
              ...DateTime.TIME_WITH_SHORT_OFFSET,
              second: undefined,
            })}
          </div>
        </div>
        <Button variant="secondary" asChild className="mt-2">
          <Link to={`/events/${event.id}/event-details`}>
            {isEventInPast && isRegistrationClosed
              ? 'View Results'
              : 'Event Details'}
          </Link>
        </Button>
      </CardContent>
      {!isEventInPast || !isRegistrationClosed ? (
        <CardFooter className="mt-auto flex flex-col items-stretch gap-2">
          {showRegistrationClosed ? (
            <p className="text-destructive pt-2 text-center font-semibold">
              Registration has closed
            </p>
          ) : (
            <>
              {byIndividualOpt !== undefined ? (
                <Button asChild>
                  <Link to={`/events/${event.id}/register-free-agent`}>
                    Free Agent Sign Up ({formatMoney(byIndividualOpt.price)})
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
              <p className="text-muted-foreground pt-2 text-center text-sm">
                Registration Closes:{' '}
                {closeRegDate.toLocaleString(DateTime.DATE_HUGE)}
              </p>
            </>
          )}
        </CardFooter>
      ) : null}
    </Card>
  );
}

function EventCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader className="items-center">
        <div className="mb-4 flex h-28 w-full items-center justify-center">
          <Skeleton className="h-24 w-24 rounded-xl" />
        </div>
        <CardTitle className="w-full">
          <Skeleton className="mx-auto h-6 w-3/4" />
        </CardTitle>
        <CardDescription className="w-full">
          <div className="mx-auto flex max-w-[220px] flex-col gap-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
      <CardFooter className="mt-auto">
        <div className="flex w-full flex-col gap-2">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </CardFooter>
    </Card>
  );
}

function ErrorMessage({
  mainMessage,
  subMessage,
  refetch,
}: {
  mainMessage: string;
  subMessage: string;
  refetch: () => void;
}) {
  return (
    <div className="p-8 text-center">
      <h3 className="mb-2 text-lg font-semibold text-red-600">{mainMessage}</h3>
      <p className="mb-4 text-gray-600">{subMessage} </p>
      <Button onClick={() => refetch()}>Retry</Button>
    </div>
  );
}
