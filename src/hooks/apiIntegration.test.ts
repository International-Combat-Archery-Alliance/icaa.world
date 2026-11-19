import { afterEach, beforeEach, describe, expect, test } from 'bun:test';
import { QueryClient, type UseMutationOptions } from '@tanstack/react-query';
import {
  deleteArticlesV1SlugMutation,
  getArticlesV1InfiniteOptions,
  getArticlesV1SlugOptions,
  patchArticlesV1SlugMutation,
  postArticlesV1Mutation,
  postArticlesV1SlugPublishMutation,
} from '@/api/articles/@tanstack/react-query.gen';
import { client as articlesClient } from '@/api/articles/client.gen';
import {
  deleteAssetsV1ByPathMutation,
  getAssetsV1InfiniteOptions,
  postAssetsV1ByPathConfirmMutation,
  postAssetsV1FoldersMutation,
  postAssetsV1UploadUrlMutation,
} from '@/api/assets/@tanstack/react-query.gen';
import { client as assetsClient } from '@/api/assets/client.gen';
import {
  getDonationsV1InfiniteOptions,
  getDonationsV1PerStateOptions,
  postDonationsV1Mutation,
} from '@/api/donations/@tanstack/react-query.gen';
import { client as donationsClient } from '@/api/donations/client.gen';
import type { Event, Registration } from '@/api/events';
import {
  getEventsV1IdOptions,
  getEventsV1InfiniteOptions,
  patchEventsV1IdMutation,
  postEventsV1EventIdRegistrationsMutation,
  postEventsV1Mutation,
} from '@/api/events/@tanstack/react-query.gen';
import { client as eventsClient } from '@/api/events/client.gen';
import {
  deleteLoginSessionMutation,
  deleteLoginV1M2mClientsClientIdMutation,
  getLoginV1M2mClientsOptions,
  postLoginGoogleMutation,
  postLoginV1M2mClientsClientIdRotateMutation,
} from '@/api/login/@tanstack/react-query.gen';
import { client as loginClient } from '@/api/login/client.gen';
import { signupForMailingListMutation } from '@/api/mailing-list/@tanstack/react-query.gen';
import { client as mailingListClient } from '@/api/mailing-list/client.gen';
import {
  getVotingV1PollsIdOptions,
  getVotingV1PollsInfiniteOptions,
  postVotingV1PollsIdVotesMutation,
} from '@/api/voting/@tanstack/react-query.gen';
import { client as votingClient } from '@/api/voting/client.gen';
import { configureApiClient } from '@/lib/apiClient';

const LOGIN_URL = 'http://login.test';

configureApiClient(eventsClient, {
  baseUrl: 'http://events.test',
  loginBaseUrl: LOGIN_URL,
});
configureApiClient(assetsClient, {
  baseUrl: 'http://assets.test',
  loginBaseUrl: LOGIN_URL,
});
configureApiClient(articlesClient, {
  baseUrl: 'http://articles.test',
  loginBaseUrl: LOGIN_URL,
});
configureApiClient(loginClient, {
  baseUrl: LOGIN_URL,
  loginBaseUrl: LOGIN_URL,
});
configureApiClient(donationsClient, {
  baseUrl: 'http://donations.test',
  loginBaseUrl: LOGIN_URL,
});
configureApiClient(mailingListClient, {
  baseUrl: 'http://mailing-list.test',
  loginBaseUrl: LOGIN_URL,
  authenticated: false,
});
configureApiClient(votingClient, {
  baseUrl: 'http://voting.test',
  loginBaseUrl: LOGIN_URL,
});

interface RecordedRequest {
  method: string;
  pathname: string;
  search: string;
  searchParams: URLSearchParams;
  headers: Headers;
  body: unknown;
  credentials: RequestCredentials;
}

const originalFetch = globalThis.fetch;
let requests: RecordedRequest[] = [];
let respond: (request: RecordedRequest) => Response = () => json({});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function queryParams(request: RecordedRequest): Record<string, string> {
  return Object.fromEntries(request.searchParams);
}

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function runMutation<TData, TError, TVariables, TOnMutateResult>(
  queryClient: QueryClient,
  options: UseMutationOptions<TData, TError, TVariables, TOnMutateResult>,
  variables: TVariables,
): Promise<TData> {
  const mutation = queryClient
    .getMutationCache()
    .build<TData, TError, TVariables, TOnMutateResult>(queryClient, options);
  return mutation.execute(variables);
}

beforeEach(() => {
  requests = [];
  respond = () => json({});

  globalThis.fetch = (async (input, init) => {
    const request =
      input instanceof Request && init === undefined
        ? input
        : new Request(input, init);
    const url = new URL(request.url);
    const text = await request.clone().text();

    let body: unknown = null;
    if (text.length > 0) {
      try {
        body = JSON.parse(text);
      } catch {
        body = text;
      }
    }

    const recorded: RecordedRequest = {
      method: request.method,
      pathname: url.pathname,
      search: url.search,
      searchParams: url.searchParams,
      headers: request.headers,
      body,
      credentials: request.credentials,
    };
    requests.push(recorded);

    return respond(recorded);
  }) as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

const event = {
  id: 'evt-1',
  version: 1,
  name: 'Spring Shoot',
  startTime: '2026-05-01T09:00:00.000Z',
  endTime: '2026-05-02T17:00:00.000Z',
  registrationCloseTime: '2026-04-20T00:00:00.000Z',
  allowedTeamSizeRange: { min: 3, max: 5 },
  location: {
    name: 'Main Range',
    address: {
      street: '1 Range Rd',
      city: 'Austin',
      state: 'TX',
      postalCode: '78701',
      country: 'US',
    },
  },
  registrationOptions: [
    {
      registrationType: 'ByIndividual',
      price: { amount: 2500, currency: 'USD' },
    },
  ],
  signUpStats: { numRosteredPlayers: 0, numTeams: 0, numTotalPlayers: 0 },
} as unknown as Event;

const registration = {
  registrationType: 'ByIndividual',
  id: 'reg-1',
  eventId: 'evt-1',
  email: 'archer@example.com',
  experience: 'Novice',
  homeCity: 'Austin',
  playerInfo: { name: 'Archer One' },
  paid: false,
  registeredAt: '2026-04-01T00:00:00.000Z',
  version: 1,
} as unknown as Registration;

describe('events', () => {
  test('infinite query omits the cursor on page 1 and merges it into page 2', async () => {
    const queryClient = createQueryClient();
    respond = ({ searchParams }) =>
      searchParams.has('cursor')
        ? json({ data: [], hasNextPage: false })
        : json({ data: [event], hasNextPage: true, cursor: 'cursor-2' });

    await queryClient.fetchInfiniteQuery({
      ...getEventsV1InfiniteOptions({ query: { limit: 10 } }),
      initialPageParam: { query: { cursor: undefined } },
      getNextPageParam: (lastPage) => lastPage.cursor,
      pages: 2,
    });

    expect(
      requests.map((request) => `${request.method} ${request.pathname}`),
    ).toEqual(['GET /events/v1', 'GET /events/v1']);
    expect(queryParams(requests[0])).toEqual({ limit: '10' });
    expect(requests[0].search).not.toContain('cursor');
    expect(queryParams(requests[1])).toEqual({
      cursor: 'cursor-2',
      limit: '10',
    });
  });

  test('detail query requests the event by id and includes credentials', async () => {
    const queryClient = createQueryClient();
    respond = () => json({ event });

    await queryClient.fetchQuery(
      getEventsV1IdOptions({ path: { id: 'evt-1' } }),
    );

    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({
      method: 'GET',
      pathname: '/events/v1/evt-1',
      credentials: 'include',
    });
  });

  test('create and update mutations send JSON bodies and include credentials', async () => {
    const queryClient = createQueryClient();
    respond = () => json({ event });

    await runMutation(queryClient, postEventsV1Mutation(), { body: event });
    await runMutation(queryClient, patchEventsV1IdMutation(), {
      path: { id: 'evt-1' },
      body: event,
    });

    expect(
      requests.map((request) => `${request.method} ${request.pathname}`),
    ).toEqual(['POST /events/v1', 'PATCH /events/v1/evt-1']);
    for (const request of requests) {
      expect(request.credentials).toBe('include');
      expect(request.headers.get('content-type')).toContain('application/json');
      expect(request.body).toEqual(event);
    }
  });

  test('registration mutation sends the turnstile header and JSON body', async () => {
    const queryClient = createQueryClient();
    respond = () => json({ clientSecret: 'secret' });

    await runMutation(queryClient, postEventsV1EventIdRegistrationsMutation(), {
      path: { eventId: 'evt-1' },
      headers: { 'cf-turnstile-response': 'turnstile-token' },
      body: registration,
    });

    expect(requests[0]).toMatchObject({
      method: 'POST',
      pathname: '/events/v1/evt-1/registrations',
      credentials: 'include',
    });
    expect(requests[0].headers.get('cf-turnstile-response')).toBe(
      'turnstile-token',
    );
    expect(requests[0].body).toEqual(registration);
  });
});

describe('assets', () => {
  test('infinite query keeps path and limit while paginating', async () => {
    const queryClient = createQueryClient();
    respond = ({ searchParams }) =>
      searchParams.has('cursor')
        ? json({ contentCount: 0, data: [], hasNextPage: false })
        : json({
            contentCount: 1,
            data: [],
            hasNextPage: true,
            cursor: 'asset-cursor-2',
          });

    await queryClient.fetchInfiniteQuery({
      ...getAssetsV1InfiniteOptions({ query: { path: '/photos', limit: 50 } }),
      initialPageParam: {
        query: { path: '/photos', limit: 50, cursor: undefined },
      },
      getNextPageParam: (lastPage) =>
        lastPage.hasNextPage ? lastPage.cursor : undefined,
      pages: 2,
    });

    expect(queryParams(requests[0])).toEqual({ limit: '50', path: '/photos' });
    expect(requests[0].search).toContain('path=%2Fphotos');
    expect(queryParams(requests[1])).toEqual({
      cursor: 'asset-cursor-2',
      limit: '50',
      path: '/photos',
    });
  });

  test('folder, upload, confirm and delete mutations serialize query and body', async () => {
    const queryClient = createQueryClient();
    respond = () => json({ file: { path: '/photos/archer.png' } });

    await runMutation(queryClient, postAssetsV1FoldersMutation(), {
      body: { name: 'photos', path: '/' },
    });
    await runMutation(queryClient, postAssetsV1UploadUrlMutation(), {
      body: {
        path: '/photos',
        fileName: 'archer.png',
        contentType: 'image/png',
      },
    });
    await runMutation(queryClient, postAssetsV1ByPathConfirmMutation(), {
      query: { path: '/photos/archer.png' },
    });
    await runMutation(queryClient, deleteAssetsV1ByPathMutation(), {
      query: { path: '/photos/archer.png' },
    });

    expect(
      requests.map(
        (request) => `${request.method} ${request.pathname}${request.search}`,
      ),
    ).toEqual([
      'POST /assets/v1/folders',
      'POST /assets/v1/upload-url',
      'POST /assets/v1/by-path/confirm?path=%2Fphotos%2Farcher.png',
      'DELETE /assets/v1/by-path?path=%2Fphotos%2Farcher.png',
    ]);
    expect(requests[0].body).toEqual({ name: 'photos', path: '/' });
    expect(requests[1].body).toEqual({
      path: '/photos',
      fileName: 'archer.png',
      contentType: 'image/png',
    });
  });

  test('normalizes a 404 response into an Error with the server code', async () => {
    const queryClient = createQueryClient();
    respond = () =>
      json({ code: 'ParentFolderNotFound', message: 'Not found' }, 404);

    const error = await runMutation(
      queryClient,
      postAssetsV1FoldersMutation(),
      {
        body: { name: 'missing', path: '/nope' },
      },
    ).catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('Not found');
    expect((error as { code?: string }).code).toBe('ParentFolderNotFound');
  });
});

describe('articles', () => {
  test('infinite query paginates and detail query fetches by slug', async () => {
    const queryClient = createQueryClient();
    respond = ({ pathname, searchParams }) => {
      if (pathname === '/articles/v1/test-post') {
        return json({ article: { slug: 'test-post' } });
      }
      return searchParams.has('cursor')
        ? json({ data: [], hasNextPage: false })
        : json({ data: [], hasNextPage: true, cursor: 'article-cursor-2' });
    };

    await queryClient.fetchInfiniteQuery({
      ...getArticlesV1InfiniteOptions({ query: { limit: 10 } }),
      initialPageParam: { query: { cursor: undefined } },
      getNextPageParam: (lastPage) => lastPage.cursor,
      pages: 2,
    });
    await queryClient.fetchQuery(
      getArticlesV1SlugOptions({ path: { slug: 'test-post' } }),
    );

    expect(requests.slice(0, 2).map(queryParams)).toEqual([
      { limit: '10' },
      { cursor: 'article-cursor-2', limit: '10' },
    ]);
    expect(requests[2]).toMatchObject({
      method: 'GET',
      pathname: '/articles/v1/test-post',
    });
  });

  test('create, update, publish and delete mutations hit their endpoints', async () => {
    const queryClient = createQueryClient();
    respond = () => json({});

    await runMutation(queryClient, postArticlesV1Mutation(), {
      body: {
        content: {},
        excerpt: 'Excerpt',
        slug: 'test-post',
        title: 'Test Post',
      },
    });
    await runMutation(queryClient, patchArticlesV1SlugMutation(), {
      path: { slug: 'test-post' },
      body: { title: 'Updated' },
    });
    await runMutation(queryClient, postArticlesV1SlugPublishMutation(), {
      path: { slug: 'test-post' },
    });
    await runMutation(queryClient, deleteArticlesV1SlugMutation(), {
      path: { slug: 'test-post' },
    });

    expect(
      requests.map((request) => `${request.method} ${request.pathname}`),
    ).toEqual([
      'POST /articles/v1',
      'PATCH /articles/v1/test-post',
      'POST /articles/v1/test-post/publish',
      'DELETE /articles/v1/test-post',
    ]);
  });
});

describe('login and m2m clients', () => {
  test('login and logout mutations are serialized', async () => {
    const queryClient = createQueryClient();
    respond = () => json({ userEmail: 'admin@example.com' });

    await runMutation(queryClient, postLoginGoogleMutation(), {
      body: { googleJWT: 'jwt-token' },
    });
    await runMutation(queryClient, deleteLoginSessionMutation(), {});

    expect(
      requests.map((request) => `${request.method} ${request.pathname}`),
    ).toEqual(['POST /login/google', 'DELETE /login/session']);
    expect(requests[0].body).toEqual({ googleJWT: 'jwt-token' });
    expect(requests[0].credentials).toBe('include');
  });

  test('m2m list, rotate and delete use their admin endpoints', async () => {
    const queryClient = createQueryClient();
    respond = () => json({ clients: [] });

    await queryClient.fetchQuery(getLoginV1M2mClientsOptions());
    await runMutation(
      queryClient,
      postLoginV1M2mClientsClientIdRotateMutation(),
      { path: { clientId: 'client-1' } },
    );
    await runMutation(queryClient, deleteLoginV1M2mClientsClientIdMutation(), {
      path: { clientId: 'client-1' },
    });

    expect(
      requests.map((request) => `${request.method} ${request.pathname}`),
    ).toEqual([
      'GET /login/v1/m2m-clients',
      'POST /login/v1/m2m-clients/client-1/rotate',
      'DELETE /login/v1/m2m-clients/client-1',
    ]);
  });
});

describe('donations', () => {
  test('infinite query paginates and per-state query filters by date', async () => {
    const queryClient = createQueryClient();
    respond = ({ pathname, searchParams }) => {
      if (pathname === '/donations/v1/per-state') {
        return json({ aggregations: [] });
      }
      return searchParams.has('cursor')
        ? json({ items: [], nextCursor: null })
        : json({ items: [], nextCursor: 'donation-cursor-2' });
    };

    await queryClient.fetchInfiniteQuery({
      ...getDonationsV1InfiniteOptions({ query: { limit: 20 } }),
      initialPageParam: { query: { cursor: undefined } },
      getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      pages: 2,
    });
    await queryClient.fetchQuery(
      getDonationsV1PerStateOptions({
        query: { created_after: '2026-01-01T00:00:00.000Z' },
      }),
    );

    expect(queryParams(requests[0])).toEqual({ limit: '20' });
    expect(queryParams(requests[1])).toEqual({
      cursor: 'donation-cursor-2',
      limit: '20',
    });
    expect(requests[2].pathname).toBe('/donations/v1/per-state');
    expect(queryParams(requests[2])).toEqual({
      created_after: '2026-01-01T00:00:00.000Z',
    });
  });

  test('create mutation posts a JSON body', async () => {
    const queryClient = createQueryClient();
    respond = () => json({ clientSecret: 'secret' });

    await runMutation(queryClient, postDonationsV1Mutation(), {
      body: {
        amount: 1000,
        currency: 'USD',
        donorEmail: 'donor@example.com',
      },
    });

    expect(requests[0]).toMatchObject({
      method: 'POST',
      pathname: '/donations/v1',
      credentials: 'include',
    });
    expect(requests[0].body).toEqual({
      amount: 1000,
      currency: 'USD',
      donorEmail: 'donor@example.com',
    });
  });
});

describe('mailing list', () => {
  test('signup mutation sends the turnstile header and JSON body', async () => {
    const queryClient = createQueryClient();
    respond = () => json({ message: 'Subscribed' });

    await runMutation(queryClient, signupForMailingListMutation(), {
      body: { email: 'fan@example.com', name: 'Fan' },
      headers: { 'cf-turnstile-response': 'turnstile-token' },
    });

    expect(requests[0]).toMatchObject({
      method: 'POST',
      pathname: '/mailing-list/signup',
    });
    expect(requests[0].headers.get('cf-turnstile-response')).toBe(
      'turnstile-token',
    );
    expect(requests[0].body).toEqual({
      email: 'fan@example.com',
      name: 'Fan',
    });
  });
});

describe('voting', () => {
  test('polls infinite query paginates and detail query fetches by id', async () => {
    const queryClient = createQueryClient();
    respond = ({ pathname, searchParams }) => {
      if (pathname === '/voting/v1/polls/poll-1') {
        return json({ poll: { id: 'poll-1' } });
      }
      return searchParams.has('cursor')
        ? json({ data: [], hasNextPage: false })
        : json({ data: [], hasNextPage: true, cursor: 'poll-cursor-2' });
    };

    await queryClient.fetchInfiniteQuery({
      ...getVotingV1PollsInfiniteOptions({ query: { limit: 10 } }),
      initialPageParam: { query: { cursor: undefined } },
      getNextPageParam: (lastPage) => lastPage.cursor,
      pages: 2,
    });
    await queryClient.fetchQuery(
      getVotingV1PollsIdOptions({ path: { id: 'poll-1' } }),
    );

    expect(queryParams(requests[0])).toEqual({ limit: '10' });
    expect(queryParams(requests[1])).toEqual({
      cursor: 'poll-cursor-2',
      limit: '10',
    });
    expect(requests[2]).toMatchObject({
      method: 'GET',
      pathname: '/voting/v1/polls/poll-1',
    });
  });

  test('vote mutation sends turnstile and idempotency headers', async () => {
    const queryClient = createQueryClient();
    respond = () => json({});

    await runMutation(queryClient, postVotingV1PollsIdVotesMutation(), {
      path: { id: 'poll-1' },
      headers: {
        'cf-turnstile-response': 'turnstile-token',
        'Idempotency-Key': 'idem-123',
      },
      body: { optionIds: ['opt-1'] },
    });

    expect(requests[0]).toMatchObject({
      method: 'POST',
      pathname: '/voting/v1/polls/poll-1/votes',
    });
    expect(requests[0].headers.get('cf-turnstile-response')).toBe(
      'turnstile-token',
    );
    expect(requests[0].headers.get('Idempotency-Key')).toBe('idem-123');
    expect(requests[0].body).toEqual({ optionIds: ['opt-1'] });
  });
});
