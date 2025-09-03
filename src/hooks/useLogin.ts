import { useLoginQueryClient } from '@/context/loginQueryClientContext';
import { AuthStatus, useUserInfo } from '@/context/userInfoContext';

export function useLogin() {
  const client = useLoginQueryClient();

  const { setCachedUserInfo, setAuthStatus } = useUserInfo();

  return client.useMutation('post', '/login/google', {
    onSuccess: (data) => {
      setCachedUserInfo(data);
      setAuthStatus(AuthStatus.AUTHENTICATED);
    },
    onError: () => {
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
      setCachedUserInfo(undefined);
    },
  });
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

  return client.useMutation('delete', '/login/google', {
    onSuccess: () => {
      setCachedUserInfo(undefined);
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
    },
  });
}
