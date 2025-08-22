import { useState } from 'react';
import { useGetEvents } from '../hooks/useEvent';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { components } from '@/events/v1';
import { format, parseISO } from 'date-fns';
import { tz } from '@date-fns/tz';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Dinero, { type Currency } from 'dinero.js';

type Event = components['schemas']['Event'];

export default function Events() {
  const { data, isPending, isFetching, error, refetch } = useGetEvents();

  // TODO: eventually support paginating through multiple pages
  const [pageNum] = useState(0);

  return (
    <>
      <h2 className="section-title">Events</h2>
      <div className="px-4 pb-4">
        {error ? (
          <ErrorMessage
            mainMessage="Error Loading Events"
            subMessage="Failed to load events. Please try again later."
            refetch={refetch}
          />
        ) : (
          <div className="flex flex-wrap gap-4">
            <EventContent
              events={data?.pages[pageNum].data}
              isFetching={isPending || isFetching}
              refetch={refetch}
            />
          </div>
        )}
      </div>
    </>
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
    return Array.from({ length: 6 }).map((_, i) => (
      <EventCardSkeleton key={i} />
    ));
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

  return events?.map((event) => (
    <EventCard
      className="flex-grow md:max-w-[375px]"
      key={event.id}
      event={event}
    />
  ));
}

function EventCard({ event, className }: { event: Event; className?: string }) {
  const date = parseISO(event.startTime);

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
            {format(date, 'eeee MMMM do, yyyy')} at{' '}
            {format(date, 'h:mm a', { in: tz('UTC') })}
          </div>
          <Button variant="secondary">Rules</Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col w-full gap-2">
          {byIndividualOpt !== undefined ? (
            <Button>
              Free Agent Sign Up ({formatMoney(byIndividualOpt.price)})
            </Button>
          ) : null}
          {byTeamOpt !== undefined ? (
            <Button>Team Sign Up ({formatMoney(byTeamOpt.price)})</Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}

function EventCardSkeleton() {
  return (
    <Card className="flex-grow w-full md:max-w-[375px]">
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

function formatMoney(money: components['schemas']['Money']): string {
  return Dinero({
    amount: money.amount,
    currency: money.currency as Currency,
  }).toFormat();
}
