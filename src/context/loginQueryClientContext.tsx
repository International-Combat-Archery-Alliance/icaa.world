import type { ReactNode } from 'react';
import { client } from '@/api/login/client.gen';
import { configureApiClient } from '@/lib/apiClient';

configureApiClient(client, {
  baseUrl: import.meta.env.VITE_LOGIN_API_URL,
  loginBaseUrl: import.meta.env.VITE_LOGIN_API_URL,
});

export const LoginQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <>{children}</>;
};
