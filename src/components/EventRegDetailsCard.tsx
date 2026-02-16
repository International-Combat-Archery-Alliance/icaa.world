import type { Event } from '@/hooks/useEvent';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatMoney } from '@/api/money';
import { DateTime } from 'luxon';
import { Share2, CalendarPlus, Download } from 'lucide-react';

interface EventDetailsCardProps {
  event: Event;
}

export function EventDetailsCard({ event }: EventDetailsCardProps) {
  const startTime = DateTime.fromISO(event.startTime, { zone: event.timeZone });
  const endTime = DateTime.fromISO(event.endTime, { zone: event.timeZone });
  const dateString = `${startTime.toLocaleString(DateTime.DATE_HUGE)} at ${startTime.toLocaleString(DateTime.TIME_SIMPLE)} to ${endTime.toLocaleString({ ...DateTime.TIME_WITH_SHORT_OFFSET, second: undefined })}`;

  const byIndividualOpt = event.registrationOptions.find(
    (e) => e.registrationType === 'ByIndividual',
  );
  const byTeamOpt = event.registrationOptions.find(
    (e) => e.registrationType === 'ByTeam',
  );

  const googleCalendarUrl = (() => {
    const start = startTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const end = endTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const details = `Event: ${event.name}`;
    const location = `${event.location.name}, ${event.location.address.street}, ${event.location.address.city}`;

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.name,
      dates: `${start}/${end}`,
      details: details,
      location: location,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  })();

  const handleDownloadIcs = () => {
    const start = startTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const end = endTime.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const location = `${event.location.name}, ${event.location.address.street}, ${event.location.address.city}`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `URL:${window.location.href}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${event.name}`,
      `DESCRIPTION:Join us for ${event.name}!`,
      `LOCATION:${location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');

    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.name.replace(/\s+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    const shareData = {
      title: event.name,
      text: `Check out ${event.name}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

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
            <strong>Address:</strong> {event.location.address.street},{' '}
            {event.location.address.city}, {event.location.address.state},{' '}
            {event.location.address.postalCode}
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
          <div className="flex flex-col sm:flex-row gap-2 mt-4">
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={handleShare}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="w-full md:w-auto" asChild>
              <a
                href={googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <CalendarPlus className="mr-2 h-4 w-4" />
                Google Calendar
              </a>
            </Button>
            <Button
              variant="outline"
              className="w-full md:w-auto"
              onClick={handleDownloadIcs}
            >
              <Download className="mr-2 h-4 w-4" />
              iCal / Outlook
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
