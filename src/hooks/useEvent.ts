import { useQueryClient } from '@tanstack/react-query';
import { useEventQueryClient } from '../context/eventQueryClientContext';
import type { paths, components } from '@/api/events-v1';

export type Event = components['schemas']['Event'];

export function useGetEvent(eventId: string | undefined) {
  const client = useEventQueryClient();

  return client.useQuery(
    'get',
    '/events/v1/{id}',
    {
      params: {
        path: { id: eventId! },
      },
    },
    { enabled: !!eventId },
  );
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

export function useUpdateEventDataAfterMutate() {
  const tanstackClient = useQueryClient();

  return (event: Event) => {
    // TODO: I would love to not need to manually figure out query keys for this
    // https://github.com/openapi-ts/openapi-typescript/issues/1806
    tanstackClient.setQueryData(
      ['get', '/events/v1/{id}', { params: { path: { id: event.id } } }],
      (old: { event: Event }) => {
        return {
          event: {
            ...old,
            ...event,
          },
        };
      },
    );
    tanstackClient.setQueryData(
      ['get', '/events/v1', { params: { query: { limit: 10 } } }],
      (oldEvents: {
        pageParams: string[];
        pages: paths['/events/v1']['get']['responses']['200']['content']['application/json'][];
      }) => {
        return {
          ...oldEvents,
          pages: oldEvents.pages.map((page) => ({
            ...page,
            data: page.data.map((v) => (v.id === event.id ? event : v)),
          })),
        };
      },
    );
  };
}

export function useRegisterForEvent() {
  const client = useEventQueryClient();

  return client.useMutation('post', '/events/v1/{eventId}/register');
}

export function useRegisterForEventWithPayment() {
  const client = useEventQueryClient();

  return client.useMutation('post', '/events/v1/{eventId}/registrations');
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

export function useUpdateEvent() {
  const client = useEventQueryClient();

  return client.useMutation('patch', '/events/v1/{id}');
}
