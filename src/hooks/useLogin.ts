import { useMutation, useQuery } from '@tanstack/react-query';
import {
  deleteLoginSessionMutation,
  getLoginSessionOptions,
  postLoginGoogleMutation,
  postLoginRefreshMutation,
} from '@/api/login/@tanstack/react-query.gen';
import { AuthStatus, useUserInfo } from '@/context/userInfoContext';
import { trackEvent } from '@/lib/newrelic';

export function useLogin() {
  const { setCachedUserInfo, deleteCachedUserInfo, setAuthStatus } =
    useUserInfo();

  return useMutation({
    ...postLoginGoogleMutation(),
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
  return useQuery({
    ...getLoginSessionOptions(),
    retry(_, error) {
      if (error.code === 'AuthError') {
        return false;
      }
      return true;
    },
    enabled: options?.enabled,
  });
}

export function useRefreshToken() {
  const { setCachedUserInfo, deleteCachedUserInfo, setAuthStatus } =
    useUserInfo();

  return useMutation({
    ...postLoginRefreshMutation(),
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
  const { deleteCachedUserInfo, setAuthStatus } = useUserInfo();

  return useMutation({
    ...deleteLoginSessionMutation(),
    onSuccess: () => {
      deleteCachedUserInfo();
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
    },
  });
}
