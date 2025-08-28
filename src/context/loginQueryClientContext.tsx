import { createContext, useContext, useMemo, type ReactNode } from 'react';
import createFetchClient from 'openapi-fetch';
import createClient, { type OpenapiQueryClient } from 'openapi-react-query';
import type { paths } from '@/api/login';

// Create the context with a null default value
const LoginQueryClientContext = createContext<OpenapiQueryClient<paths> | null>(
  null,
);

export const LoginQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { loginQueryClient } = useMemo(() => {
    const loginAPIFetchClient = createFetchClient<paths>({
      baseUrl: import.meta.env.VITE_LOGIN_API_URL,
    });
    const loginQueryClient = createClient(loginAPIFetchClient);
    return { loginQueryClient };
  }, []);

  return (
    <LoginQueryClientContext.Provider value={loginQueryClient}>
      {children}
    </LoginQueryClientContext.Provider>
  );
};

export const useLoginQueryClient = () => {
  const context = useContext(LoginQueryClientContext);
  if (!context) {
    throw new Error(
      'useLoginQueryClient must be used within a LoginQueryClientProvider',
    );
  }
  return context;
};
