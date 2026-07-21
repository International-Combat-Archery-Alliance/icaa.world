import { createContext, useContext, useMemo, type ReactNode } from 'react';
import createFetchClient from 'openapi-fetch';
import createClient, { type OpenapiQueryClient } from 'openapi-react-query';
import type { paths } from '@/api/voting-v1';
import { createAuthMiddleware } from '@/lib/authMiddleware';

// Create the context with a null default value
const VotingQueryClientContext =
  createContext<OpenapiQueryClient<paths> | null>(null);

export const VotingQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { votingQueryClient } = useMemo(() => {
    const votingAPIFetchClient = createFetchClient<paths>({
      baseUrl: import.meta.env.VITE_VOTING_API_URL,
      credentials: 'include',
    });
    votingAPIFetchClient.use(createAuthMiddleware());
    const votingQueryClient = createClient(votingAPIFetchClient);
    return { votingQueryClient };
  }, []);

  return (
    <VotingQueryClientContext.Provider value={votingQueryClient}>
      {children}
    </VotingQueryClientContext.Provider>
  );
};

export const useVotingQueryClient = () => {
  const context = useContext(VotingQueryClientContext);
  if (!context) {
    throw new Error(
      'useVotingQueryClient must be used within a VotingQueryClientProvider',
    );
  }
  return context;
};
