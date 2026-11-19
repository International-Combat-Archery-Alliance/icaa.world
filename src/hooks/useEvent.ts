import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  getEventsV1EventIdRegistrationsInfiniteOptions,
  getEventsV1IdOptions,
  getEventsV1IdQueryKey,
  getEventsV1InfiniteOptions,
  patchEventsV1IdMutation,
  postEventsV1EventIdRegistrationsMutation,
  postEventsV1Mutation,
} from '@/api/events/@tanstack/react-query.gen';
import { client } from '@/api/events/client.gen';
import type {
  Event,
  GetEventsV1EventIdRegistrationsResponse,
  GetEventsV1Response,
} from '@/api/events';

export type { Event };

export function useGetEvent(eventId: string | undefined) {
  return useQuery({
    ...getEventsV1IdOptions({ path: { id: eventId ?? '' } }),
    enabled: !!eventId,
  });
}

export function useGetEvents(limit: number = 10) {
  return useInfiniteQuery({
    ...getEventsV1InfiniteOptions({ query: { limit } }),
    initialPageParam: { query: { cursor: undefined } },
    getNextPageParam: (lastPage: GetEventsV1Response) => lastPage.cursor,
  });
}

export function useUpdateEventDataAfterMutate() {
  const tanstackClient = useQueryClient();

  return (event: Event) => {
    tanstackClient.setQueryData(
      getEventsV1IdQueryKey({ client, path: { id: event.id } }),
      (old: { event: Event } | undefined) => {
        if (!old) return { event };
        return {
          event: {
            ...old.event,
            ...event,
          },
        };
      },
    );
    // Match every cached event list regardless of the requested `limit`.
    tanstackClient.setQueriesData<InfiniteData<GetEventsV1Response>>(
      { queryKey: [{ _id: 'getEventsV1' }] },
      (oldEvents) => {
        if (!oldEvents?.pages) return oldEvents;
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

export function useRegisterForEventWithPayment() {
  return useMutation(postEventsV1EventIdRegistrationsMutation());
}

export function useCreateEvent() {
  return useMutation(postEventsV1Mutation());
}

export function useGetRegistrations(
  eventId: string | undefined,
  limit: number = 10,
) {
  return useInfiniteQuery({
    ...getEventsV1EventIdRegistrationsInfiniteOptions({
      path: { eventId: eventId ?? '' },
      query: { limit },
    }),
    enabled: !!eventId,
    initialPageParam: {
      path: { eventId: eventId ?? '' },
      query: { limit, cursor: undefined },
    },
    getNextPageParam: (lastPage: GetEventsV1EventIdRegistrationsResponse) =>
      lastPage.cursor,
  });
}

export function useUpdateEvent() {
  return useMutation(patchEventsV1IdMutation());
}
