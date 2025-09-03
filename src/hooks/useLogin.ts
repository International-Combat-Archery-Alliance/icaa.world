import { useLoginQueryClient } from '@/context/loginQueryClientContext';
import { useLocalStorage } from 'react-use';
import type { components } from '@/api/login';
import { AuthStatus, useUserInfo } from '@/context/userInfoContext';

export function useLogin() {
  const client = useLoginQueryClient();

  const mutation = client.useMutation('post', '/login/google');

  const { setCachedUserInfo, setAuthStatus } = useUserInfo();

  return {
    ...mutation,
    mutate: (
      variables: Parameters<typeof mutation.mutate>[0],
      options?: Parameters<typeof mutation.mutate>[1],
    ) => {
      mutation.mutate(variables, {
        ...options,
        onSuccess: (data, variables, context) => {
          setCachedUserInfo(data);
          setAuthStatus(AuthStatus.AUTHENTICATED);
          options?.onSuccess?.(data, variables, context);
        },
        onError: (error, variables, context) => {
          setAuthStatus(AuthStatus.UNAUTHENTICATED);
          options?.onError?.(error, variables, context);
        },
      });
    },
  };
}

export function useLoginUserInfo(options?: { enabled?: boolean }) {
  const client = useLoginQueryClient();

  return client.useQuery(
    'get',
    '/login/google/userInfo',
    {
      credentials: 'include',
    },
    {
      retry(_, error) {
        if (error.code === 'AuthError') {
          return false;
        }
        return true;
      },
      enabled: options?.enabled,
    },
  );
}

export function useLogout() {
  const client = useLoginQueryClient();

  const { setCachedUserInfo, setAuthStatus } = useUserInfo();

  const mutation = client.useMutation('delete', '/login/google');

  return {
    ...mutation,
    mutate: (
      variables: Parameters<typeof mutation.mutate>[0],
      options?: Parameters<typeof mutation.mutate>[1],
    ) => {
      mutation.mutate(variables, {
        ...options,
        onSuccess: (data, variables, context) => {
          setCachedUserInfo(null);
          setAuthStatus(AuthStatus.UNAUTHENTICATED);
          options?.onSuccess?.(data, variables, context);
        },
      });
    },
  };
}
