import { createContext, useContext, useMemo, type ReactNode } from 'react';
import createFetchClient, { type Client } from 'openapi-fetch';
import createClient, { type OpenapiQueryClient } from 'openapi-react-query';
import type { paths } from '@/api/assets-api-v1';
import { createAuthMiddleware } from '@/lib/authMiddleware';

export type AssetsFetchClient = Client<paths>;

let _assetsFetchClient: AssetsFetchClient | null = null;

export function getAssetsFetchClient(): AssetsFetchClient {
  if (!_assetsFetchClient) {
    throw new Error(
      'Assets fetch client not initialized. Ensure AssetsQueryClientProvider is mounted.',
    );
  }
  return _assetsFetchClient;
}

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
    assetsAPIFetchClient.use(createAuthMiddleware());
    _assetsFetchClient = assetsAPIFetchClient;
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
