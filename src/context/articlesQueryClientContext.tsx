import { createContext, useContext, useMemo, type ReactNode } from 'react';
import createFetchClient from 'openapi-fetch';
import createClient, { type OpenapiQueryClient } from 'openapi-react-query';
import type { paths } from '@/api/articles-v1';
import { createAuthMiddleware } from '@/lib/authMiddleware';

const ArticlesQueryClientContext =
  createContext<OpenapiQueryClient<paths> | null>(null);

export const ArticlesQueryClientProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { articlesQueryClient } = useMemo(() => {
    const articlesAPIFetchClient = createFetchClient<paths>({
      baseUrl: import.meta.env.VITE_ARTICLES_API_URL,
      credentials: 'include',
    });
    articlesAPIFetchClient.use(createAuthMiddleware());
    const articlesQueryClient = createClient(articlesAPIFetchClient);
    return { articlesQueryClient };
  }, []);

  return (
    <ArticlesQueryClientContext.Provider value={articlesQueryClient}>
      {children}
    </ArticlesQueryClientContext.Provider>
  );
};

export const useArticlesQueryClient = () => {
  const context = useContext(ArticlesQueryClientContext);
  if (!context) {
    throw new Error(
      'useArticlesQueryClient must be used within an ArticlesQueryClientProvider',
    );
  }
  return context;
};
