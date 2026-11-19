import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query';
import {
  deleteArticlesV1SlugMutation,
  getArticlesV1AdminInfiniteOptions,
  getArticlesV1InfiniteOptions,
  getArticlesV1SlugOptions,
  patchArticlesV1SlugMutation,
  postArticlesV1Mutation,
  postArticlesV1SlugPublishMutation,
  postArticlesV1SlugUnpublishMutation,
} from '@/api/articles/@tanstack/react-query.gen';
import type {
  GetArticlesV1AdminResponse,
  GetArticlesV1Response,
} from '@/api/articles';

export type { Article } from '@/api/articles';

export function useGetArticles(limit: number = 10) {
  return useInfiniteQuery({
    ...getArticlesV1InfiniteOptions({ query: { limit } }),
    initialPageParam: { query: { cursor: undefined } },
    getNextPageParam: (lastPage: GetArticlesV1Response) => lastPage.cursor,
  });
}

export function useGetArticle(slug: string | undefined) {
  return useQuery({
    ...getArticlesV1SlugOptions({ path: { slug: slug ?? '' } }),
    enabled: !!slug,
  });
}

export function useGetAdminArticles(limit: number = 20) {
  return useInfiniteQuery({
    ...getArticlesV1AdminInfiniteOptions({ query: { limit } }),
    initialPageParam: { query: { cursor: undefined } },
    getNextPageParam: (lastPage: GetArticlesV1AdminResponse) => lastPage.cursor,
  });
}

export function useCreateArticle() {
  return useMutation(postArticlesV1Mutation());
}

export function useUpdateArticle() {
  return useMutation(patchArticlesV1SlugMutation());
}

export function useDeleteArticle() {
  return useMutation(deleteArticlesV1SlugMutation());
}

export function usePublishArticle() {
  return useMutation(postArticlesV1SlugPublishMutation());
}

export function useUnpublishArticle() {
  return useMutation(postArticlesV1SlugUnpublishMutation());
}
