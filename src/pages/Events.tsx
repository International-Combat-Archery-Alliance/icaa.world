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

function EventContent({
  events,
  isFetching,
  refetch,
}: {
  events: Event[] | undefined;
  isFetching: boolean;
  refetch: () => void;
}) {
  const CardGrid = ({ children }: { children: React.ReactNode[] }) => (
    <div className="flex flex-wrap gap-2 justify-evenly">{children}</div>
  );

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
            src={`images/logos/${event.imageName}`}
            alt="Boston International Championship Logo"
            className="event-logo justify-self-center"
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
          <div>
            {date.toLocaleString({
              ...DateTime.DATETIME_FULL,
              weekday: 'long',
            })}
          </div>
          {event.rulesDocLink && (
            <Button variant="secondary" asChild className="mt-2">
              <a
                href={`/docs/${event.rulesDocLink}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Rules
              </a>
            </Button>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch gap-2">
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
        <p className="text-center text-sm text-muted-foreground pt-2">
          Registration Closes: {closeRegDate.toLocaleString(DateTime.DATE_HUGE)}
        </p>
      </CardFooter>
    </Card>
  );
}

function EventCardSkeleton() {
  return (
    <Card className="flex-grow w-full lg:max-w-[375px]">
      <CardHeader>
        <Skeleton className="h-24 w-24 justify-self-center mb-2 rounded-xl" />
        <CardTitle>
          <Skeleton className="w-3/4 h-4" />
        </CardTitle>
        <CardDescription>
          <div className="flex flex-col gap-1">
            <Skeleton className="w-1/2 h-2" />
            <Skeleton className="w-1/2 h-2" />
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <Skeleton className="w-3/4 h-2" />
          <Skeleton className="h-10" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col gap-2 w-full">
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
    <div className="text-center p-8">
      <h3 className="text-lg font-semibold text-red-600 mb-2">{mainMessage}</h3>
      <p className="text-gray-600 mb-4">{subMessage} </p>
      <Button onClick={() => refetch()}>Retry</Button>
    </div>
  );
}
