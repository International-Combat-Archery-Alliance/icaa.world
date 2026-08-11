import React, { useState } from 'react';
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
import { formatMoney } from '@/api/money';

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
  return <div className="flex flex-wrap justify-evenly gap-2">{children}</div>;
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

  return (
    <CardGrid>
      {events?.map((event) => (
        <EventCard
          className="flex-grow lg:max-w-[375px]"
          key={event.id}
          event={event}
        />
      ))}
    </CardGrid>
  );
}

function EventCard({ event, className }: { event: Event; className?: string }) {
  const date = DateTime.fromISO(event.startTime, { zone: event.timeZone });
  const closeRegDate = DateTime.fromISO(event.registrationCloseTime, {
    zone: event.timeZone,
  });
  const isRegistrationClosed = DateTime.now() > closeRegDate;

  const byIndividualOpt = event.registrationOptions.find(
    (e) => e.registrationType === 'ByIndividual',
  );
  const byTeamOpt = event.registrationOptions.find(
    (e) => e.registrationType === 'ByTeam',
  );

  return (
    <Card className={className}>
      <CardHeader>
        {event.imageName ? (
          <img
            src={event.imageName}
            alt="Boston International Championship Logo"
            className="mb-4 inline-block h-auto max-w-[100px] justify-self-center"
          />
        ) : null}
        <CardTitle>{event.name}</CardTitle>
        <CardDescription>
          {event.location.name}
          <div>
            {event.location.address.city}, {event.location.address.state}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col">
          <div>{date.toLocaleString(DateTime.DATE_HUGE)}</div>
          <div>
            {date.toLocaleString({
              ...DateTime.TIME_WITH_SHORT_OFFSET,
              second: undefined,
            })}
          </div>
          <Button variant="secondary" asChild>
            <Link to={`/events/${event.id}/event-details`}>Event Details</Link>
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2">
        {isRegistrationClosed ? (
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
    </Card>
  );
}

function EventCardSkeleton() {
  return (
    <Card className="w-full flex-grow lg:max-w-[375px]">
      <CardHeader>
        <Skeleton className="mb-2 h-24 w-24 justify-self-center rounded-xl" />
        <CardTitle>
          <Skeleton className="h-4 w-3/4" />
        </CardTitle>
        <CardDescription>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-2 w-1/2" />
            <Skeleton className="h-2 w-1/2" />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-2 w-3/4" />
          <Skeleton className="h-10" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col gap-2">
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
