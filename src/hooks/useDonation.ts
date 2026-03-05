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

  // Adjust dates to be inclusive of entire days
  const createdAfter = dateRange?.from
    ? new Date(
        dateRange.from.getFullYear(),
        dateRange.from.getMonth(),
        dateRange.from.getDate(),
        0,
        0,
        0,
        0,
      ).toISOString()
    : undefined;

  const createdBefore = dateRange?.to
    ? new Date(
        dateRange.to.getFullYear(),
        dateRange.to.getMonth(),
        dateRange.to.getDate(),
        23,
        59,
        59,
        999,
      ).toISOString()
    : undefined;

  return client.useInfiniteQuery(
    'get',
    '/donations/v1',
    {
      params: {
        query: {
          limit,
          cursor: undefined,
          created_after: createdAfter,
          created_before: createdBefore,
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

  // Adjust dates to be inclusive of entire days
  const createdAfter = dateRange?.from
    ? new Date(
        dateRange.from.getFullYear(),
        dateRange.from.getMonth(),
        dateRange.from.getDate(),
        0,
        0,
        0,
        0,
      ).toISOString()
    : undefined;

  const createdBefore = dateRange?.to
    ? new Date(
        dateRange.to.getFullYear(),
        dateRange.to.getMonth(),
        dateRange.to.getDate(),
        23,
        59,
        59,
        999,
      ).toISOString()
    : undefined;

  return client.useQuery('get', '/donations/v1/per-state', {
    params: {
      query: {
        created_after: createdAfter,
        created_before: createdBefore,
      },
    },
  });
}
