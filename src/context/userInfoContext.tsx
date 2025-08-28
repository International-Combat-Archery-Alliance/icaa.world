import type { components } from '@/api/login';
import { useLoginUserInfo } from '@/hooks/useLogin';
import { createContext, useContext, type ReactNode } from 'react';

export interface UserInfoContextValues {
  userInfo: components['schemas']['UserInfo'] | undefined;
  isSuccess: boolean;
  isError: boolean;
  isLoading: boolean;
  refetchUserInfo: () => void;
}

const UserInfoContext = createContext<UserInfoContextValues | null>(null);

export const UserInfoContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const {
    data: userInfo,
    isSuccess,
    isError,
    isLoading,
    refetch: refetchUserInfo,
  } = useLoginUserInfo();

  return (
    <UserInfoContext.Provider
      value={{ userInfo, isSuccess, isError, isLoading, refetchUserInfo }}
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
