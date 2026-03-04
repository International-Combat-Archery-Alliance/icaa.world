import { createContext, useContext, useMemo, type ReactNode } from 'react';
import createFetchClient from 'openapi-fetch';
import createClient, { type OpenapiQueryClient } from 'openapi-react-query';
import type { paths } from '@/api/donations-v1';

// Create the context with a null default value
const DonationQueryClientContext =
  createContext<OpenapiQueryClient<paths> | null>(null);

export const DonationQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { donationQueryClient } = useMemo(() => {
    const donationAPIFetchClient = createFetchClient<paths>({
      baseUrl: import.meta.env.VITE_DONATION_API_URL,
    });
    const donationQueryClient = createClient(donationAPIFetchClient);
    return { donationQueryClient };
  }, []);

  return (
    <DonationQueryClientContext.Provider value={donationQueryClient}>
      {children}
    </DonationQueryClientContext.Provider>
  );
};

export const useDonationQueryClient = () => {
  const context = useContext(DonationQueryClientContext);
  if (!context) {
    throw new Error(
      'useDonationQueryClient must be used within a DonationQueryClientProvider',
    );
  }
  return context;
};
