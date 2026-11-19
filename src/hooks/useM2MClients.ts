import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteLoginV1M2mClientsClientIdMutation,
  getLoginV1M2mClientsOptions,
  getLoginV1M2mClientsQueryKey,
  patchLoginV1M2mClientsClientIdMutation,
  postLoginV1M2mClientsClientIdRotateMutation,
  postLoginV1M2mClientsMutation,
} from '@/api/login/@tanstack/react-query.gen';
import '@/context/loginQueryClientContext';

export type {
  M2mClient as M2MClient,
  M2mClientCredentials as M2MClientCredentials,
} from '@/api/login';

export function useGetM2MClients() {
  return useQuery({
    ...getLoginV1M2mClientsOptions(),
    retry(failureCount, error) {
      if (error && typeof error === 'object' && 'code' in error) {
        return error.code === 'InternalError' && failureCount < 3;
      }
      return failureCount < 3;
    },
  });
}

export function useCreateM2MClient() {
  return useMutation(postLoginV1M2mClientsMutation());
}

export function useRotateM2MClient() {
  return useMutation(postLoginV1M2mClientsClientIdRotateMutation());
}

export function useRevokeM2MClient() {
  return useMutation(deleteLoginV1M2mClientsClientIdMutation());
}

export function useUpdateM2MClient() {
  return useMutation(patchLoginV1M2mClientsClientIdMutation());
}

export function useInvalidateM2MClients() {
  const tanstackClient = useQueryClient();

  return () => {
    void tanstackClient.invalidateQueries({
      queryKey: getLoginV1M2mClientsQueryKey(),
    });
  };
}
