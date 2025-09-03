import { useGetEvents } from '../hooks/useEvent';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateTime } from 'luxon';

const UpcomingEventsContainer = ({ className }: { className?: string }) => {
  const { data, isPending, error } = useGetEvents();
  const events = data?.pages.flatMap((page) => page.data);

  const upcomingEvents = events
    ?.filter((event) => new Date(event.startTime) > new Date())
    .sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    )
    .slice(0, 2);

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <CalendarDays className="h-6 w-6 text-primary" />
          <span>Upcoming Events</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid flex-grow gap-4">
        {isPending ? (
          <div className="grid gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="grid gap-2 p-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-40" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p className="text-center text-red-600 p-4">Error loading events.</p>
        ) : upcomingEvents && upcomingEvents.length > 0 ? (
          upcomingEvents.map((event) => (
            <div key={event.id} className="grid gap-1 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                {DateTime.fromISO(event.startTime).toLocaleString(
                  DateTime.DATE_FULL,
                )}
              </p>
              <h4 className="font-semibold group-hover:text-primary">
                {event.name}
              </h4>
              {event.location && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {`${event.location.name} - ${event.location.address.city}, ${event.location.address.state}`}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground p-4">
            No upcoming events scheduled.
          </p>
        )}
      </CardContent>
      <CardFooter className="mt-auto border-t px-6 pt-6">
        <Button variant="outline" className="w-full" asChild>
          <Link to="/events">View All Events</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingEventsContainer;
