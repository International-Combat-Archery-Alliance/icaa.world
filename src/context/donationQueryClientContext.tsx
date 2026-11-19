import type { ReactNode } from 'react';
import { client } from '@/api/donations/client.gen';
import { configureApiClient } from '@/lib/apiClient';

configureApiClient(client, {
  baseUrl: import.meta.env.VITE_DONATION_API_URL,
  loginBaseUrl: import.meta.env.VITE_LOGIN_API_URL,
});

export const DonationQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <>{children}</>;
};
