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
import { Button } from '@/components/ui/button';

export function EventsV2() {
  const { data, isFetching, error, hasNextPage } = useGetEvents();

  // TODO: eventually support paginating through multiple pages
  const [pageNum, setPageNum] = useState(0);

  return (
    <>
      <h2 className="section-title">Events</h2>
      <div className="px-4 pb-4">
        <div className="grid md:grid-cols-2 gap-4">
          {data?.pages[pageNum].data.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </>
  );
}

function EventCard({ event }: { event: components['schemas']['Event'] }) {
  const date = parseISO(event.startTime);

  return (
    <Card>
      <CardHeader>
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
          <div>{format(date, 'eeee MMMM do, yyyy')}</div>
          <div>Starting at {format(date, 'h:mm a')}</div>
          <Button variant="secondary">Rules</Button>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col w-full gap-2">
          {event.registrationTypes.includes('ByIndividual') ? (
            <Button>Free Agent Sign Up</Button>
          ) : null}
          {event.registrationTypes.includes('ByTeam') ? (
            <Button>Team Sign Up</Button>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}
