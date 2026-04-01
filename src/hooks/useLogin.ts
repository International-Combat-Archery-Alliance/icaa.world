import { useLoginQueryClient } from '@/context/loginQueryClientContext';
import { AuthStatus, useUserInfo } from '@/context/userInfoContext';

export function useLogin() {
  const client = useLoginQueryClient();

  const { setCachedUserInfo, deleteCachedUserInfo, setAuthStatus } =
    useUserInfo();

  return client.useMutation('post', '/login/google', {
    onSuccess: (data) => {
      setCachedUserInfo(data);
      setAuthStatus(AuthStatus.AUTHENTICATED);
    },
    onError: () => {
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
      deleteCachedUserInfo();
    },
  });
}

// New hook using the non-deprecated /login/session endpoint
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

// Deprecated: Use useLoginSession instead
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

// New hook to refresh the access token using the refresh token
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

// New hook using the non-deprecated /login/session DELETE endpoint
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
