import { EventDetailsCard } from '@/components/EventRegDetailsCard';
import StripeEmbeddedCheckout from '@/components/StripeEmbeddedCheckout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGetEvent } from '@/hooks/useEvent';
import { useEventPaymentInfo } from '@/hooks/useEventPaymentInfo';
import { Link, useParams } from 'react-router-dom';
import { useTitle } from 'react-use';

export default function EventPayment() {
  useTitle('Event payment');

  const { eventId } = useParams();
  const { data } = useGetEvent(eventId!);

  const [paymentInfo, , deletePaymentInfo] = useEventPaymentInfo(eventId!);

  if (data === undefined) {
    return <></>;
  }

  if (paymentInfo === undefined) {
    return (
      <div className="flex flex-col items-center pt-8 gap-y-2">
        <div>
          It looks like you do not have a pending payment for this event!
        </div>
        <div>If you would like to sign up, go to the event page.</div>
        <Button className="max-w-64">
          <Link to={`/events/${eventId}/event-details`}>Go to event</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <EventDetailsCard event={data.event} />
      <div className="pb-4">
        Note that if you do not pay within 30 minutes, your registration will be
        cancelled and you will need to re-register.
      </div>
      <div className="flex flex-col items-center">
        <Card className="w-full md:w-1/2">
          <StripeEmbeddedCheckout
            clientSecret={paymentInfo.clientSecret}
            onComplete={() => {
              deletePaymentInfo();
            }}
          />
        </Card>
      </div>
    </div>
  );
}
