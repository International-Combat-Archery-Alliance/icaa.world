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

export function EventsV2() {
  const { data, isPending, isFetching, error, hasNextPage } = useGetEvents();

  // TODO: eventually support paginating through multiple pages
  const [pageNum, setPageNum] = useState(0);

  return (
    <>
      <h2 className="section-title">Events</h2>
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-4">
          <EventContent
            events={data?.pages[0].data}
            isFetching={isPending || isFetching}
          />
        </div>
      </div>
    </>
  );
}

function EventContent({
  events,
  isFetching,
}: {
  events: Event[] | undefined;
  isFetching: boolean;
}) {
  if (isFetching) {
    return Array.from({ length: 6 }).map((_, i) => (
      <Skeleton
        key={i}
        className="h-[285px] w-full md:max-w-[375px] rounded-xl"
      />
    ));
  }

  if (events === undefined || events.length === 0) {
    return <div>No events found, check back later!</div>;
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

function formatMoney(money: components['schemas']['Money']): string {
  return Dinero({
    amount: money.amount,
    currency: money.currency as Currency,
  }).toFormat();
}
