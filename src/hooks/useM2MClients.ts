import { useQueryClient } from '@tanstack/react-query';
import { useLoginQueryClient } from '@/context/loginQueryClientContext';
import type { components } from '@/api/login';

export type M2MClient = components['schemas']['M2MClient'];
export type M2MClientCredentials =
  components['schemas']['M2MClientCredentials'];

const m2mClientsListKey = ['get', '/login/v1/m2m-clients'] as const;

export function useGetM2MClients() {
  const client = useLoginQueryClient();

  return client.useQuery(
    'get',
    '/login/v1/m2m-clients',
    {
      credentials: 'include',
    },
    {
      retry(failureCount, error) {
        if (error && typeof error === 'object' && 'code' in error) {
          return error.code === 'InternalError' && failureCount < 3;
        }
        return failureCount < 3;
      },
    },
  );
}

export function useCreateM2MClient() {
  const client = useLoginQueryClient();

  return client.useMutation('post', '/login/v1/m2m-clients', {
    credentials: 'include',
  });
}

export function useRotateM2MClient() {
  const client = useLoginQueryClient();

  return client.useMutation('post', '/login/v1/m2m-clients/{clientId}/rotate', {
    credentials: 'include',
  });
}

export function useRevokeM2MClient() {
  const client = useLoginQueryClient();

  return client.useMutation('delete', '/login/v1/m2m-clients/{clientId}', {
    credentials: 'include',
  });
}

export function useInvalidateM2MClients() {
  const tanstackClient = useQueryClient();

  return () => {
    void tanstackClient.invalidateQueries({ queryKey: m2mClientsListKey });
  };
}
