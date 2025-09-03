import type { Event } from '@/hooks/useEvent';
import { Card, CardContent } from '@/components/ui/card';
import { formatMoney } from '@/api/money';
import { DateTime } from 'luxon';

interface EventDetailsCardProps {
  event: Event;
}

export function EventDetailsCard({ event }: EventDetailsCardProps) {
  const startTime = DateTime.fromISO(event.startTime);
  const endTime = DateTime.fromISO(event.endTime);
  const dateString = `${startTime.toLocaleString(DateTime.DATE_HUGE)} at ${startTime.toLocaleString(DateTime.TIME_SIMPLE)} to ${endTime.toLocaleString({ ...DateTime.TIME_WITH_SHORT_OFFSET, second: undefined })}`;

  const byIndividualOpt = event.registrationOptions.find(
    (e) => e.registrationType === 'ByIndividual',
  );
  const byTeamOpt = event.registrationOptions.find(
    (e) => e.registrationType === 'ByTeam',
  );

  return (
    <Card className="w-full max-w-screen-lg mx-auto mb-8">
      <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6">
        {event.imageName && (
          <img
            src={`/images/logos/${event.imageName}`}
            alt={`${event.name} logo`}
            className="w-32 h-32 rounded-md object-contain flex-shrink-0"
          />
        )}
        <div className="grid gap-1 text-center md:text-left">
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
              <strong>Free Agent Price:</strong>{' '}
              {formatMoney(byIndividualOpt.price)}
            </p>
          )}
          {byTeamOpt && (
            <p>
              <strong>Team Price:</strong> {formatMoney(byTeamOpt.price)}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
