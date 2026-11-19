import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import {
  deleteAssetsV1ByPathMutation,
  getAssetsV1ByPathOptions,
  getAssetsV1InfiniteOptions,
  postAssetsV1ByPathConfirmMutation,
  postAssetsV1ByPathReplaceUrlMutation,
  postAssetsV1FoldersMutation,
  postAssetsV1UploadUrlMutation,
} from '@/api/assets/@tanstack/react-query.gen';
import type { GetAssetsV1Response } from '@/api/assets';

export type {
  AdminAsset,
  AdminFile,
  AdminFolder,
  Asset,
  FileStatus,
} from '@/api/assets';

// TanStack matches this partial key against every generated asset-list key.
export const assetsListQueryKey = [{ _id: 'getAssetsV1' }];

export function useGetAssets(path: string, limit: number = 50) {
  return useInfiniteQuery({
    ...getAssetsV1InfiniteOptions({ query: { path, limit } }),
    enabled: !!path,
    initialPageParam: {
      query: { path, limit, cursor: undefined },
    },
    getNextPageParam: (lastPage: GetAssetsV1Response) =>
      lastPage.hasNextPage ? lastPage.cursor : undefined,
  });
}

export function useGetAssetByPath(assetPath: string) {
  return useQuery({
    ...getAssetsV1ByPathOptions({ query: { path: assetPath } }),
    enabled: !!assetPath,
  });
}

export function useCreateFolder() {
  return useMutation(postAssetsV1FoldersMutation());
}

export function useDeleteAsset() {
  return useMutation(deleteAssetsV1ByPathMutation());
}

export function useGetUploadUrl() {
  return useMutation(postAssetsV1UploadUrlMutation());
}

export function useConfirmUpload() {
  return useMutation(postAssetsV1ByPathConfirmMutation());
}

export function useGetReplaceUrl() {
  return useMutation(postAssetsV1ByPathReplaceUrlMutation());
}
