import { useEventQueryClient } from '../context/eventQueryClientContext';
import type { paths, components } from '@/events/v1';

export type Event = components['schemas']['Event'];

export function useGetEvent(eventId: string) {
  const client = useEventQueryClient();

  return client.useQuery('get', '/v1/events/{id}', {
    params: {
      path: { id: eventId },
    },
  });
}

export function useGetEvents(limit: number = 10) {
  const client = useEventQueryClient();

  return client.useInfiniteQuery(
    'get',
    '/v1/events',
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
        lastPage: paths['/v1/events']['get']['responses']['200']['content']['application/json'],
      ) => lastPage.cursor,
      initialPageParam: null,
    },
  );
}

export function useRegisterForEvent() {
  const client = useEventQueryClient();

  return client.useMutation('post', '/v1/events/{eventId}/register');
}
