import { createContext, useContext, useMemo, type ReactNode } from 'react';
import createFetchClient from 'openapi-fetch';
import createClient, { type OpenapiQueryClient } from 'openapi-react-query';
import type { paths } from '@/api/mailing-list-v1';

const MailingListQueryClientContext =
  createContext<OpenapiQueryClient<paths> | null>(null);

export const MailingListQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { mailingListQueryClient } = useMemo(() => {
    const mailingListFetchClient = createFetchClient<paths>({
      baseUrl: import.meta.env.VITE_MAILING_LIST_API_URL,
      credentials: 'include',
    });
    const mailingListQueryClient = createClient(mailingListFetchClient);
    return { mailingListQueryClient };
  }, []);

  return (
    <MailingListQueryClientContext.Provider value={mailingListQueryClient}>
      {children}
    </MailingListQueryClientContext.Provider>
  );
};

export const useMailingListQueryClient = () => {
  const context = useContext(MailingListQueryClientContext);
  if (!context) {
    throw new Error(
      'useMailingListQueryClient must be used within a MailingListQueryClientProvider',
    );
  }
  return context;
};
