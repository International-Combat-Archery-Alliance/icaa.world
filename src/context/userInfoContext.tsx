import type { components } from '@/api/login';
import { useLoginUserInfo } from '@/hooks/useLogin';
import { createContext, useContext, type ReactNode, useEffect } from 'react';
import { useLocalStorage } from 'react-use';

export enum AuthStatus {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}

function isUserInfoExpired(
  userInfo: components['schemas']['UserInfo'] | undefined,
): boolean {
  if (userInfo === undefined) return true;

  const expirationDate = new Date(userInfo.expiresAt);
  const now = new Date();

  return now >= expirationDate;
}

export interface UserInfoContextValues {
  userInfo: components['schemas']['UserInfo'] | undefined;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  setCachedUserInfo: (info: components['schemas']['UserInfo']) => void;
  deleteCachedUserInfo: () => void;
  setAuthStatus: (status: AuthStatus) => void;
}

const UserInfoContext = createContext<UserInfoContextValues | null>(null);

export const UserInfoContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cachedUserInfo, setCachedUserInfo, deleteCachedUserInfo] =
    useLocalStorage<components['schemas']['UserInfo']>('userInfo');
  const [authStatus, setAuthStatus] = useLocalStorage<AuthStatus>('authStatus');

  // Check if cached user info is expired and clear it if so
  useEffect(() => {
    if (cachedUserInfo && isUserInfoExpired(cachedUserInfo)) {
      deleteCachedUserInfo();
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
    }
  }, [cachedUserInfo, deleteCachedUserInfo, setAuthStatus]);

  const shouldFetchFromAPI =
    authStatus === undefined ||
    authStatus === null ||
    (authStatus === AuthStatus.AUTHENTICATED && !cachedUserInfo) ||
    (authStatus === AuthStatus.AUTHENTICATED &&
      isUserInfoExpired(cachedUserInfo));

  const {
    data: apiUserInfo,
    isSuccess: apiIsSuccess,
    isError: apiIsError,
    isLoading: apiIsLoading,
  } = useLoginUserInfo({
    enabled: shouldFetchFromAPI,
  });

  useEffect(() => {
    if (apiIsSuccess && apiUserInfo) {
      setCachedUserInfo(apiUserInfo);
      setAuthStatus(AuthStatus.AUTHENTICATED);
    }
    if (apiIsError) {
      deleteCachedUserInfo();
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
    }
  }, [
    apiIsSuccess,
    apiIsError,
    apiUserInfo,
    setCachedUserInfo,
    deleteCachedUserInfo,
  ]);

  const userInfo = cachedUserInfo || apiUserInfo;
  const isSuccess = authStatus === AuthStatus.AUTHENTICATED && !!userInfo;
  const isError =
    authStatus === AuthStatus.UNAUTHENTICATED ||
    (shouldFetchFromAPI && apiIsError);
  const isLoading = shouldFetchFromAPI && apiIsLoading;

  return (
    <UserInfoContext.Provider
      value={{
        userInfo,
        isSuccess,
        isError,
        isLoading,
        setCachedUserInfo,
        setAuthStatus,
        deleteCachedUserInfo,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

export const useUserInfo = () => {
  const context = useContext(UserInfoContext);
  if (!context) {
    throw new Error('useUserInfo must be used within an UserInfoContext');
  }
  return context;
};
