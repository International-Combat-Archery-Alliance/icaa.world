import { useArticlesQueryClient } from '../context/articlesQueryClientContext';
import type { paths, components } from '@/api/articles-v1';

export type Article = components['schemas']['Article'];

export function useGetArticles(limit: number = 10) {
  const client = useArticlesQueryClient();

  return client.useInfiniteQuery(
    'get',
    '/articles/v1',
    {
      params: {
        query: {
          limit,
          cursor: undefined,
        },
      },
    },
    {
      getNextPageParam: (
        lastPage: paths['/articles/v1']['get']['responses']['200']['content']['application/json'],
      ) => lastPage.cursor,
      initialPageParam: null,
    },
  );
}

export function useGetArticle(slug: string | undefined) {
  const client = useArticlesQueryClient();

  return client.useQuery(
    'get',
    '/articles/v1/{slug}',
    {
      params: {
        path: { slug: slug! },
      },
    },
    { enabled: !!slug },
  );
}

export function useGetAdminArticles(limit: number = 20) {
  const client = useArticlesQueryClient();

  return client.useInfiniteQuery(
    'get',
    '/articles/v1/admin',
    {
      params: {
        query: {
          limit,
          cursor: undefined,
        },
      },
    },
    {
      getNextPageParam: (
        lastPage: paths['/articles/v1/admin']['get']['responses']['200']['content']['application/json'],
      ) => lastPage.cursor,
      initialPageParam: null,
    },
  );
}

export function useCreateArticle() {
  const client = useArticlesQueryClient();

  return client.useMutation('post', '/articles/v1');
}

export function useUpdateArticle() {
  const client = useArticlesQueryClient();

  return client.useMutation('patch', '/articles/v1/{slug}');
}

export function useDeleteArticle() {
  const client = useArticlesQueryClient();

  return client.useMutation('delete', '/articles/v1/{slug}');
}

export function usePublishArticle() {
  const client = useArticlesQueryClient();

  return client.useMutation('post', '/articles/v1/{slug}/publish');
}

export function useUnpublishArticle() {
  const client = useArticlesQueryClient();

  return client.useMutation('post', '/articles/v1/{slug}/unpublish');
}
