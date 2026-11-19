import type { ReactNode } from 'react';
import { client } from '@/api/assets/client.gen';
import { configureApiClient } from '@/lib/apiClient';

configureApiClient(client, {
  baseUrl: import.meta.env.VITE_ASSETS_API_URL,
  loginBaseUrl: import.meta.env.VITE_LOGIN_API_URL,
});

export const AssetsQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <>{children}</>;
};
