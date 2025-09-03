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
  if (!userInfo?.expiresAt) return true;

  const expirationDate = new Date(userInfo.expiresAt);
  const now = new Date();

  return now >= expirationDate;
}

export interface UserInfoContextValues {
  userInfo: components['schemas']['UserInfo'] | undefined;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  setCachedUserInfo: (
    info: components['schemas']['UserInfo'] | undefined,
  ) => void;
  setAuthStatus: (status: AuthStatus | undefined) => void;
}

const UserInfoContext = createContext<UserInfoContextValues | null>(null);

export const UserInfoContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cachedUserInfo, setCachedUserInfo] = useLocalStorage<
    components['schemas']['UserInfo'] | undefined
  >('userInfo', undefined);
  const [authStatus, setAuthStatus] = useLocalStorage<AuthStatus | undefined>(
    'authStatus',
    undefined,
  );

  // Check if cached user info is expired and clear it if so
  useEffect(() => {
    if (cachedUserInfo && isUserInfoExpired(cachedUserInfo)) {
      setCachedUserInfo(undefined);
      setAuthStatus(undefined);
    }
  }, [cachedUserInfo, setCachedUserInfo, setAuthStatus]);

  const shouldFetchFromAPI =
    authStatus === undefined ||
    (authStatus === AuthStatus.AUTHENTICATED && !cachedUserInfo) ||
    isUserInfoExpired(cachedUserInfo);

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
  }, [apiIsSuccess, apiUserInfo, setCachedUserInfo]);

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
