import { describe, expect, test } from 'bun:test';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { client as articlesClient } from '@/api/articles/client.gen';
import { getArticlesV1SlugOptions } from '@/api/articles/@tanstack/react-query.gen';
import { client as eventsClient } from '@/api/events/client.gen';
import { getEventsV1IdOptions } from '@/api/events/@tanstack/react-query.gen';
import { client as votingClient } from '@/api/voting/client.gen';
import {
  getVotingV1PollsIdOptions,
  getVotingV1PollsIdResultsOptions,
} from '@/api/voting/@tanstack/react-query.gen';
import { useGetArticle } from '@/hooks/useArticles';
import { useGetEvent } from '@/hooks/useEvent';
import { useGetPoll, useGetPollResults } from '@/hooks/useVoting';

const missingParam = undefined as unknown as string;

function renderHook(useHook: () => unknown): () => void {
  const queryClient = new QueryClient();

  const Probe = () => {
    useHook();
    return null;
  };

  return () =>
    renderToString(
      createElement(
        QueryClientProvider,
        { client: queryClient },
        createElement(Probe),
      ),
    );
}

describe('detail query options and a missing route param', () => {
  test('event detail options tolerate an undefined id', () => {
    expect(() =>
      getEventsV1IdOptions({
        client: eventsClient,
        path: { id: missingParam ?? '' },
      }),
    ).not.toThrow();
  });

  test('article detail options tolerate an undefined slug', () => {
    expect(() =>
      getArticlesV1SlugOptions({
        client: articlesClient,
        path: { slug: missingParam ?? '' },
      }),
    ).not.toThrow();
  });

  test('poll detail options tolerate an undefined id', () => {
    expect(() =>
      getVotingV1PollsIdOptions({
        client: votingClient,
        path: { id: missingParam ?? '' },
      }),
    ).not.toThrow();
    expect(() =>
      getVotingV1PollsIdResultsOptions({
        client: votingClient,
        path: { id: missingParam ?? '' },
      }),
    ).not.toThrow();
  });
});

describe('detail hooks render before their route param is available', () => {
  test('useGetEvent(undefined) does not throw', () => {
    expect(renderHook(() => useGetEvent(undefined))).not.toThrow();
  });

  test('useGetArticle(undefined) does not throw', () => {
    expect(renderHook(() => useGetArticle(undefined))).not.toThrow();
  });

  test('useGetPoll(undefined) does not throw', () => {
    expect(renderHook(() => useGetPoll(undefined))).not.toThrow();
    expect(renderHook(() => useGetPollResults(undefined))).not.toThrow();
  });
});
