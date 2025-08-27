import type { Event } from '@/hooks/useEvent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';

interface EventDetailsCardProps {
  event: Event;
}

export function EventDetailsCard({ event }: EventDetailsCardProps) {
    const formattedDate = format(parseISO(event.startTime),'eeee, MMMM dd, yyyy');
    const formattedStartTime = format(new Date(event.startTime), 'p');
    const formattedEndTime = format(new Date(event.endTime), 'p');
    const dateString = ` ${formattedDate} at ${formattedStartTime} to ${formattedEndTime}`;
    const byIndividualOpt = event.registrationOptions.find(
    (e) => e.registrationType === 'ByIndividual',
  );
    const byTeamOpt = event.registrationOptions.find(
    (e) => e.registrationType === 'ByTeam',
  );

  return (
    <Card className="w-full max-w-screen-lg mx-auto mb-8">
      <CardContent className="flex gap-20">
        {event.imageName && (
            <img
              src={'\\public\\images\\logos\\ICAA Logo.png'}
              alt={`${event.name} logo`}
              className="w-3xs rounded-md object-cover"
            />
          )}
        <div className='grid'>
            <p>
            <strong>Event:</strong> {event.name}
            </p>
            <p>
            <strong>Date:</strong> {dateString}
            </p>
            <p>
            <strong>Venue:</strong> {event.location.name}
            </p>
            <p>
            <strong>Address:</strong> {event.location.address.city},{' '}
            {event.location.address.state}, {event.location.address.postalCode}
            </p>
            {byIndividualOpt && (
            <p>
                <strong>Free Agent Price:</strong> {byIndividualOpt.price.amount}{' '}
                {byIndividualOpt.price.currency}
            </p>
            )}
            {byTeamOpt && (
            <p>
                <strong>Team Price:</strong> {byTeamOpt.price.amount}{' '}
                {byTeamOpt.price.currency}
            </p>
        )}
        </div>
      </CardContent>
    </Card>
  );
}