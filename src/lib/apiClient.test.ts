import { afterEach, describe, expect, test } from 'bun:test';
import { client as assetsClient } from '@/api/assets/client.gen';
import { getAssetsV1 } from '@/api/assets';
import {
  configureApiClient,
  createAuthFetch,
  toApiError,
} from '@/lib/apiClient';

const LOGIN_URL = 'http://login.test';

const originalFetch = globalThis.fetch;

afterEach(() => {
  globalThis.fetch = originalFetch;
});

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

describe('createAuthFetch', () => {
  test('refreshes the token and replays the request body after a 401', async () => {
    const requests: Array<{
      url: string;
      method: string;
      credentials: RequestCredentials;
      body?: string;
    }> = [];
    let apiCalls = 0;
    let refreshCalls = 0;

    globalThis.fetch = (async (input, init) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      const isRefresh = request.url === `${LOGIN_URL}/login/refresh`;
      requests.push({
        url: request.url,
        method: request.method,
        credentials: request.credentials,
        body: isRefresh ? undefined : await request.text(),
      });

      if (isRefresh) {
        refreshCalls += 1;
        return new Response(null, { status: 204 });
      }

      apiCalls += 1;
      return apiCalls === 1
        ? jsonResponse({ code: 'AuthError', message: 'expired' }, 401)
        : jsonResponse({ ok: true });
    }) as typeof fetch;

    const response = await createAuthFetch(LOGIN_URL)(
      new Request('http://api.test/things', {
        method: 'POST',
        body: JSON.stringify({ name: 'target' }),
      }),
    );

    expect(response.status).toBe(200);
    expect(refreshCalls).toBe(1);
    expect(
      requests.filter((request) => request.url.endsWith('/login/refresh')),
    ).toMatchObject([{ method: 'POST', credentials: 'include' }]);
    expect(
      requests
        .filter((request) => request.url === 'http://api.test/things')
        .map((request) => request.body),
    ).toEqual(['{"name":"target"}', '{"name":"target"}']);
  });

  test('passes unparsable URLs straight to fetch', async () => {
    const requested: string[] = [];

    globalThis.fetch = (async (input) => {
      requested.push(String(input));
      return jsonResponse({ ok: true });
    }) as typeof fetch;

    const response = await createAuthFetch(LOGIN_URL)('/relative/path');

    expect(response.status).toBe(200);
    expect(requested).toEqual(['/relative/path']);
  });

  test('shares one refresh across concurrent 401 responses', async () => {
    const apiCallCounts = new Map<string, number>();
    let refreshCalls = 0;

    globalThis.fetch = (async (input, init) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      if (request.url === `${LOGIN_URL}/login/refresh`) {
        refreshCalls += 1;
        await new Promise((resolve) => setTimeout(resolve, 5));
        return new Response(null, { status: 204 });
      }

      const calls = (apiCallCounts.get(request.url) ?? 0) + 1;
      apiCallCounts.set(request.url, calls);
      return calls === 1
        ? jsonResponse({ code: 'AuthError', message: 'expired' }, 401)
        : jsonResponse({ ok: true });
    }) as typeof fetch;

    const fetchWithAuth = createAuthFetch(LOGIN_URL);
    const responses = await Promise.all([
      fetchWithAuth(new Request('http://api.test/one')),
      fetchWithAuth(new Request('http://api.test/two')),
    ]);

    expect(responses.map((response) => response.status)).toEqual([200, 200]);
    expect(refreshCalls).toBe(1);
  });

  test('does not refresh when the refresh endpoint itself returns 401', async () => {
    let fetchCalls = 0;

    globalThis.fetch = (async () => {
      fetchCalls += 1;
      return jsonResponse({ code: 'AuthError', message: 'no session' }, 401);
    }) as typeof fetch;

    const response = await createAuthFetch(LOGIN_URL)(
      new Request(`${LOGIN_URL}/login/refresh`, { method: 'POST' }),
    );

    expect(response.status).toBe(401);
    expect(fetchCalls).toBe(1);
  });

  test('returns the original 401 when the refresh fails', async () => {
    let apiCalls = 0;
    let refreshCalls = 0;

    globalThis.fetch = (async (input, init) => {
      const request =
        input instanceof Request ? input : new Request(input, init);
      if (request.url === `${LOGIN_URL}/login/refresh`) {
        refreshCalls += 1;
        return jsonResponse({ code: 'AuthError', message: 'no session' }, 401);
      }
      apiCalls += 1;
      return jsonResponse({ code: 'AuthError', message: 'expired' }, 401);
    }) as typeof fetch;

    const response = await createAuthFetch(LOGIN_URL)(
      new Request('http://api.test/things'),
    );

    expect(response.status).toBe(401);
    expect(apiCalls).toBe(1);
    expect(refreshCalls).toBe(1);
  });
});

describe('configureApiClient', () => {
  test('applies the base URL and credentials, and throws normalized errors', async () => {
    let requestedUrl = '';
    let requestedCredentials: RequestCredentials | undefined;

    globalThis.fetch = (async (input) => {
      const request = input as Request;
      requestedUrl = request.url;
      requestedCredentials = request.credentials;
      return jsonResponse(
        { code: 'ParentFolderNotFound', message: 'Folder is missing' },
        404,
      );
    }) as typeof fetch;

    configureApiClient(assetsClient, {
      baseUrl: 'http://api.test',
      loginBaseUrl: LOGIN_URL,
    });

    const request = getAssetsV1({
      query: { path: '/' },
      client: assetsClient,
    });
    const error = await request.then(
      () => undefined,
      (reason: unknown) => reason,
    );

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('Folder is missing');
    expect((error as { code?: string }).code).toBe('ParentFolderNotFound');
    expect(requestedUrl).toBe('http://api.test/assets/v1?path=%2F');
    expect(requestedCredentials).toBe('include');
  });
});

describe('toApiError', () => {
  test('keeps the server code and message on an Error instance', () => {
    const error = toApiError(
      { code: 'ParentFolderNotFound', message: 'Folder is missing' },
      404,
    );

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('Folder is missing');
    expect((error as { code?: string }).code).toBe('ParentFolderNotFound');
  });

  test('falls back to the status when the body has no message', () => {
    const error = toApiError('not json', 500);

    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe('Request failed with status 500');
  });

  test('passes through errors that are already Error instances', () => {
    const original = new Error('network down');

    expect(toApiError(original)).toBe(original);
  });
});
