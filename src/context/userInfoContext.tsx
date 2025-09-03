import type { components } from '@/api/login';
import { useLoginUserInfo } from '@/hooks/useLogin';
import { createContext, useContext, type ReactNode, useEffect } from 'react';
import { useLocalStorage } from 'react-use';

export enum AuthStatus {
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}

export interface UserInfoContextValues {
  userInfo: components['schemas']['UserInfo'] | undefined;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  setCachedUserInfo: (info: components['schemas']['UserInfo'] | null) => void;
  setAuthStatus: (status: AuthStatus | null) => void;
}

const UserInfoContext = createContext<UserInfoContextValues | null>(null);

export const UserInfoContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [cachedUserInfo, setCachedUserInfo] = useLocalStorage<
    components['schemas']['UserInfo'] | null
  >('userInfo', null);
  const [authStatus, setAuthStatus] = useLocalStorage<AuthStatus | null>(
    'authStatus',
    null,
  );

  const shouldFetchFromAPI =
    authStatus === null ||
    (authStatus === AuthStatus.AUTHENTICATED && !cachedUserInfo);

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
