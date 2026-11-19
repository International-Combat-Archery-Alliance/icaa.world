import type { ReactNode } from 'react';
import { client } from '@/api/voting/client.gen';
import { configureApiClient } from '@/lib/apiClient';

configureApiClient(client, {
  baseUrl: import.meta.env.VITE_VOTING_API_URL,
  loginBaseUrl: import.meta.env.VITE_LOGIN_API_URL,
});

export const VotingQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <>{children}</>;
};
