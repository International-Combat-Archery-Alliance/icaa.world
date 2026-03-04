import { useDonationQueryClient } from '@/context/donationQueryClientContext';

export function useCreateDonation() {
  const client = useDonationQueryClient();

  return client.useMutation('post', '/donations/v1');
}

export function useGetDonations(params?: {
  limit?: number;
  cursor?: string;
  created_after?: string;
  created_before?: string;
}) {
  const client = useDonationQueryClient();

  return client.useQuery('get', '/donations/v1', {
    params: {
      query: params,
    },
  });
}

export function useGetDonationsByState(params?: {
  created_after?: string;
  created_before?: string;
}) {
  const client = useDonationQueryClient();

  return client.useQuery('get', '/donations/v1/per-state', {
    params: {
      query: params,
    },
  });
}
