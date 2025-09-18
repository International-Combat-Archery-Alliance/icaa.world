import { Link } from 'react-router-dom';
import { Button } from './ui/button';

export default function InProgressPayment({ eventId }: { eventId: string }) {
  return (
    <>
      <div>
        It looks like you already have a registration in progress that you have
        not completed payment for.
      </div>
      <Button>
        <Link to={`/events/${eventId}/payment`}>Complete payment</Link>
      </Button>
    </>
  );
}
