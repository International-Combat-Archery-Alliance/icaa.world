import type { ReactNode } from 'react';
import { client } from '@/api/mailing-list/client.gen';
import { configureApiClient } from '@/lib/apiClient';

configureApiClient(client, {
  baseUrl: import.meta.env.VITE_MAILING_LIST_API_URL,
  loginBaseUrl: import.meta.env.VITE_LOGIN_API_URL,
  authenticated: false,
});

export const MailingListQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <>{children}</>;
};
