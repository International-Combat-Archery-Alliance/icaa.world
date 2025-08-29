import { useEventQueryClient } from '../context/eventQueryClientContext';
import type { paths, components } from '@/api/events-v1';

export type Event = components['schemas']['Event'];

export function useGetEvent(eventId: string) {
  const client = useEventQueryClient();

  return client.useQuery('get', '/events/v1/{id}', {
    params: {
      path: { id: eventId },
    },
  });
}

export function useGetEvents(limit: number = 10) {
  const client = useEventQueryClient();

  return client.useInfiniteQuery(
    'get',
    '/events/v1',
    {
      params: {
        query: {
          limit,
          cursor: undefined,
        },
      },
    },
    {
      getNextPageParam: (
        lastPage: paths['/events/v1']['get']['responses']['200']['content']['application/json'],
      ) => lastPage.cursor,
      initialPageParam: null,
    },
  );
}

export function useRegisterForEvent() {
  const client = useEventQueryClient();

  return client.useMutation('post', '/events/v1/{eventId}/register');
}

export function useCreateEvent() {
  const client = useEventQueryClient();

  return client.useMutation('post', '/events/v1');
}

export function useGetRegistrations(
  eventId: string | undefined,
  limit: number = 10,
) {
  const client = useEventQueryClient();

  return client.useInfiniteQuery(
    'get',
    '/events/v1/{eventId}/registrations',
    {
      credentials: 'include',
      params: {
        query: {
          limit,
          cursor: undefined,
        },
        path: {
          eventId: eventId!,
        },
      },
    },
    {
      enabled: !!eventId,
      getNextPageParam: (
        lastPage: paths['/events/v1/{eventId}/registrations']['get']['responses']['200']['content']['application/json'],
      ) => lastPage.cursor,
      initialPageParam: null,
    },
  );
}
