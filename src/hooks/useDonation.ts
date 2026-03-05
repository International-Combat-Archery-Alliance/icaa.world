import { useDonationQueryClient } from '@/context/donationQueryClientContext';

export function useCreateDonation() {
  const client = useDonationQueryClient();

  return client.useMutation('post', '/donations/v1');
}

export function useGetDonations(
  limit: number = 20,
  dateRange?: { from?: Date; to?: Date },
) {
  const client = useDonationQueryClient();

  return client.useInfiniteQuery(
    'get',
    '/donations/v1',
    {
      params: {
        query: {
          limit,
          cursor: undefined,
          created_after: dateRange?.from?.toISOString(),
          created_before: dateRange?.to?.toISOString(),
        },
      },
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: null as string | null,
    },
  );
}

export function useGetDonationsByState(dateRange?: { from?: Date; to?: Date }) {
  const client = useDonationQueryClient();

  return client.useQuery('get', '/donations/v1/per-state', {
    params: {
      query: {
        created_after: dateRange?.from?.toISOString(),
        created_before: dateRange?.to?.toISOString(),
      },
    },
  });
}
