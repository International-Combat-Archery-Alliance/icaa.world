import { createContext, useContext, useMemo, type ReactNode } from 'react';
import createFetchClient from 'openapi-fetch';
import createClient, { type OpenapiQueryClient } from 'openapi-react-query';
import type { paths } from '@/api/assets-api-v1';

const AssetsQueryClientContext =
  createContext<OpenapiQueryClient<paths> | null>(null);

export const AssetsQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { assetsQueryClient } = useMemo(() => {
    const assetsAPIFetchClient = createFetchClient<paths>({
      baseUrl: import.meta.env.VITE_ASSETS_API_URL,
      credentials: 'include',
    });
    const assetsQueryClient = createClient(assetsAPIFetchClient);
    return { assetsQueryClient };
  }, []);

  return (
    <AssetsQueryClientContext.Provider value={assetsQueryClient}>
      {children}
    </AssetsQueryClientContext.Provider>
  );
};

export const useAssetsQueryClient = () => {
  const context = useContext(AssetsQueryClientContext);
  if (!context) {
    throw new Error(
      'useAssetsQueryClient must be used within an AssetsQueryClientProvider',
    );
  }
  return context;
};
