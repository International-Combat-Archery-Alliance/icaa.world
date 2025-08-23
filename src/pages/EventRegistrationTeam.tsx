import { useGetEvent } from '@/hooks/useEvent';
import { useParams } from 'react-router-dom';

export default function EventRegistrationTeam() {
  const { eventId } = useParams();
  const { data } = useGetEvent(eventId!);
  
  //i pureley did this just to get link to push
  return(
    data
  )
}
