import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import {
  getDonationsV1InfiniteOptions,
  getDonationsV1PerStateOptions,
  postDonationsV1Mutation,
} from '@/api/donations/@tanstack/react-query.gen';
import '@/context/donationQueryClientContext';
import type { DonationListResponse } from '@/api/donations';

export function useCreateDonation() {
  return useMutation(postDonationsV1Mutation());
}

export function useGetDonations(
  limit: number = 20,
  dateRange?: { from?: Date; to?: Date },
) {
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

  return useInfiniteQuery({
    ...getDonationsV1InfiniteOptions({
      query: {
        limit,
        created_after: createdAfter,
        created_before: createdBefore,
      },
    }),
    initialPageParam: { query: { cursor: undefined } },
    getNextPageParam: (lastPage: DonationListResponse) =>
      lastPage.nextCursor ?? undefined,
  });
}

export function useGetDonationsByState(dateRange?: { from?: Date; to?: Date }) {
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

  return useQuery(
    getDonationsV1PerStateOptions({
      query: {
        created_after: createdAfter,
        created_before: createdBefore,
      },
    }),
  );
}
