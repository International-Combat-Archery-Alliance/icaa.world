import { useLoginQueryClient } from '@/context/loginQueryClientContext';
import { AuthStatus, useUserInfo } from '@/context/userInfoContext';
import { trackEvent } from '@/lib/newrelic';

export function useLogin() {
  const client = useLoginQueryClient();

  const { setCachedUserInfo, deleteCachedUserInfo, setAuthStatus } =
    useUserInfo();

  return client.useMutation('post', '/login/google', {
    onSuccess: (data) => {
      setCachedUserInfo(data);
      setAuthStatus(AuthStatus.AUTHENTICATED);
      trackEvent('user_login', { method: 'google' });
    },
    onError: () => {
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
      deleteCachedUserInfo();
    },
  });
}

export function useLoginSession(options?: { enabled?: boolean }) {
  const client = useLoginQueryClient();

  return client.useQuery(
    'get',
    '/login/session',
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

export function useRefreshToken() {
  const client = useLoginQueryClient();
  const { setCachedUserInfo, deleteCachedUserInfo, setAuthStatus } =
    useUserInfo();

  return client.useMutation('post', '/login/refresh', {
    onSuccess: (data) => {
      setCachedUserInfo(data);
      setAuthStatus(AuthStatus.AUTHENTICATED);
    },
    onError: () => {
      // Refresh failed - clear auth state
      deleteCachedUserInfo();
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
    },
  });
}

export function useLogout() {
  const client = useLoginQueryClient();

  const { deleteCachedUserInfo, setAuthStatus } = useUserInfo();

  return client.useMutation('delete', '/login/session', {
    onSuccess: () => {
      deleteCachedUserInfo();
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
    },
  });
}
