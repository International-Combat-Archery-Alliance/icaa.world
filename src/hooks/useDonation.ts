import { useDonationQueryClient } from '@/context/donationQueryClientContext';

export function useCreateDonation() {
  const client = useDonationQueryClient();

  return client.useMutation('post', '/donations/v1');
}
