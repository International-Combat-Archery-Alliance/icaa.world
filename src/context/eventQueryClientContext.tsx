import { createContext, useContext, useMemo, type ReactNode } from 'react';
import createFetchClient from 'openapi-fetch';
import createClient, { type OpenapiQueryClient } from 'openapi-react-query';
import type { paths } from '@/api/events-v1';

// Create the context with a null default value
const EventQueryClientContext = createContext<OpenapiQueryClient<paths> | null>(
  null,
);

export const EventQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { eventQueryClient } = useMemo(() => {
    const eventAPIFetchClient = createFetchClient<paths>({
      baseUrl: import.meta.env.VITE_EVENT_API_URL,
    });
    const eventQueryClient = createClient(eventAPIFetchClient);
    return { eventQueryClient };
  }, []);

  return (
    <EventQueryClientContext.Provider value={eventQueryClient}>
      {children}
    </EventQueryClientContext.Provider>
  );
};

export const useEventQueryClient = () => {
  const context = useContext(EventQueryClientContext);
  if (!context) {
    throw new Error(
      'useEventQueryClient must be used within an EventQueryClientProvider',
    );
  }
  return context;
};
