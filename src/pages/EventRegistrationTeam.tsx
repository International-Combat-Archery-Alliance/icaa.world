import { useGetEvent } from '@/hooks/useEvent';
import { useParams } from 'react-router-dom';

export default function EventRegistrationTeam() {
  const { eventId } = useParams();
  const { data } = useGetEvent(eventId!);

  return <></>;
}
