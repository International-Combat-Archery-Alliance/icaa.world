import { useAssetsQueryClient } from '../context/assetsQueryClientContext';
import type { paths, components } from '@/api/assets-api-v1';

export type Asset = components['schemas']['Asset'];
export type AdminAsset = components['schemas']['AdminAsset'];
export type AdminFile = components['schemas']['AdminFile'];
export type AdminFolder = components['schemas']['AdminFolder'];
export type FileStatus = components['schemas']['FileStatus'];

export function useGetAssets(path: string, limit: number = 50) {
  const client = useAssetsQueryClient();

  return client.useInfiniteQuery(
    'get',
    '/assets/v1',
    {
      params: {
        query: { path, limit, cursor: undefined },
      },
    },
    {
      enabled: !!path,
      getNextPageParam: (
        lastPage: paths['/assets/v1']['get']['responses']['200']['content']['application/json'],
      ) => (lastPage.hasNextPage ? lastPage.cursor : undefined),
      initialPageParam: null,
    },
  );
}

export function useGetAssetByPath(assetPath: string) {
  const client = useAssetsQueryClient();

  return client.useQuery(
    'get',
    '/assets/v1/by-path',
    {
      params: {
        query: { path: assetPath },
      },
    },
    { enabled: !!assetPath },
  );
}

export function useCreateFolder() {
  const client = useAssetsQueryClient();
  return client.useMutation('post', '/assets/v1/folders');
}

export function useDeleteAsset() {
  const client = useAssetsQueryClient();
  return client.useMutation('delete', '/assets/v1/by-path');
}

export function useGetUploadUrl() {
  const client = useAssetsQueryClient();
  return client.useMutation('post', '/assets/v1/upload-url');
}

export function useConfirmUpload() {
  const client = useAssetsQueryClient();
  return client.useMutation('post', '/assets/v1/by-path/confirm');
}
