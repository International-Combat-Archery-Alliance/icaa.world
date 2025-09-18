import { EventDetailsCard } from '@/components/EventRegDetailsCard';
import { useGetEvent } from '@/hooks/useEvent';
import { useEventPaymentInfo } from '@/hooks/useEventPaymentInfo';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTitle } from 'react-use';

export default function EventPaymentSuccess() {
  useTitle('Successful sign up');

  const { eventId } = useParams();
  const { data } = useGetEvent(eventId!);
  const [, , deletePaymentInfo] = useEventPaymentInfo(eventId!);

  useEffect(() => {
    deletePaymentInfo();
  }, [deletePaymentInfo]);

  if (data === undefined) {
    return <></>;
  }

  return (
    <div className="p-4">
      <EventDetailsCard event={data?.event} />
      <div className="flex flex-col items-center gap-4 md:gap-2">
        <div className="">
          Thank you for signing up to our event, we are excited to have you!
        </div>
        <div>
          You will receive an email shortly with your event confirmation and
          details about the event.
        </div>
        <div>
          Reach out to us at{' '}
          <a href="mailto:info@icaa.world" className="font-bold text-primary">
            info@icaa.world
          </a>{' '}
          if you have any questions.
        </div>
      </div>
    </div>
  );
}
