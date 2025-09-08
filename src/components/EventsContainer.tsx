import { useGetEvents } from '../hooks/useEvent';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateTime } from 'luxon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EventsContainer = ({ className }: { className?: string }) => {
  const { data, isPending, error } = useGetEvents();
  const events = data?.pages.flatMap((page) => page.data);

  const upcomingEvents = events
    ?.filter((event) => new Date(event.startTime) > new Date())
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )
    .slice(0, 2);

  const pastEvents = events
    ?.filter((event) => new Date(event.startTime) <= new Date())
    .sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime(),
    )
    .slice(0, 2);

  const renderEventList = (
    eventList: typeof upcomingEvents | undefined,
    emptyMessage: string,
  ) => {
    if (isPending) {
      return (
        <div className="grid gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="grid gap-2 p-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <p className="text-center text-red-600 p-4">Error loading events.</p>
      );
    }
    if (eventList && eventList.length > 0) {
      return (
        <div className="grid gap-4">
          {eventList.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}/event-details`}
              className="group grid gap-1 rounded-lg p-3 transition-colors hover:bg-muted/50"
            >
              <p className="text-sm text-muted-foreground">
                {DateTime.fromISO(event.startTime, {
                  zone: event.timeZone,
                }).toLocaleString(DateTime.DATE_FULL)}
              </p>
              <h4 className="font-semibold group-hover:text-primary transition-colors">
                {event.name}
              </h4>
              {event.location && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {`${event.location.name} - ${event.location.address.city}, ${event.location.address.state}`}
                </p>
              )}
            </Link>
          ))}
        </div>
      );
    }
    return (
      <p className="text-center text-muted-foreground p-4">{emptyMessage}</p>
    );
  };

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <CalendarDays className="h-6 w-6 text-primary" />
          <span>Events</span>
        </CardTitle>
      </CardHeader>
      <Tabs defaultValue="upcoming" className="flex flex-col flex-grow">
        <div className="px-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </div>
        <div className="p-6 pt-4 flex-grow">
          <TabsContent value="upcoming" className="mt-0">
            {renderEventList(upcomingEvents, 'No upcoming events scheduled.')}
          </TabsContent>
          <TabsContent value="past" className="mt-0">
            {renderEventList(pastEvents, 'No past events to show.')}
          </TabsContent>
        </div>
      </Tabs>
      <CardFooter className="mt-auto border-t px-6 pt-6">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/events">View All Events</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventsContainer;
