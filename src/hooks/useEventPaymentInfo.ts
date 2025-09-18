import { DateTime } from 'luxon';
import { useEffect } from 'react';
import { useLocalStorage } from 'react-use';

export interface EventPaymentInfo {
  clientSecret: string;
  expiresAt: string;
}

export function useEventPaymentInfo(
  eventId: string,
): [
  EventPaymentInfo | undefined,
  React.Dispatch<React.SetStateAction<EventPaymentInfo | undefined>>,
  () => void,
] {
  const [paymentInfo, setPaymentInfo, deletePaymentInfo] = useLocalStorage<
    EventPaymentInfo | undefined
  >(`eventPaymentInfo-${eventId}`, undefined);

  // expire payment info if it's past expire at time
  useEffect(() => {
    if (
      paymentInfo !== undefined &&
      DateTime.fromISO(paymentInfo.expiresAt) <= DateTime.now()
    ) {
      deletePaymentInfo();
    }
  }, [paymentInfo, deletePaymentInfo]);

  return [paymentInfo, setPaymentInfo, deletePaymentInfo];
}
