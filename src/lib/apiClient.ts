import type { Client } from '@/api/assets/client';

let refreshPromise: Promise<boolean> | null = null;

async function requestNewAccessToken(loginBaseUrl: string): Promise<boolean> {
  try {
    const response = await globalThis.fetch(
      `${loginBaseUrl.replace(/\/$/, '')}/login/refresh`,
      {
        method: 'POST',
        credentials: 'include',
      },
    );
    return response.ok;
  } catch {
    return false;
  }
}

function refreshAccessToken(loginBaseUrl: string): Promise<boolean> {
  refreshPromise ??= requestNewAccessToken(loginBaseUrl).finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

/**
 * A fetch implementation that refreshes the access token once on a 401 and
 * replays the original request. The request is cloned before it is sent
 * because the initial send consumes its body stream.
 */
export function createAuthFetch(loginBaseUrl: string): typeof fetch {
  return async (input, init) => {
    const request =
      input instanceof Request && init === undefined
        ? input
        : new Request(input, init);

    let retryRequest: Request | null = null;
    try {
      retryRequest = request.clone();
    } catch {
      // Some streaming bodies cannot be cloned; such requests cannot be replayed.
    }

    const response = await globalThis.fetch(request);

    if (
      response.status !== 401 ||
      retryRequest === null ||
      request.url.includes('/login/refresh')
    ) {
      return response;
    }

    if (!(await refreshAccessToken(loginBaseUrl))) {
      return response;
    }

    return globalThis.fetch(retryRequest);
  };
}

/**
 * Converts the parsed error body that the client throws into an `Error` while
 * keeping the server's fields (`code`, etc.) accessible on the instance.
 */
export function toApiError(error: unknown, status?: number): unknown {
  if (error instanceof Error) {
    return error;
  }

  const hasServerMessage =
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string' &&
    error.message.length > 0;

  const apiError = new Error(
    hasServerMessage
      ? (error as { message: string }).message
      : `Request failed with status ${status ?? 'unknown'}`,
  );

  if (typeof error === 'object' && error !== null) {
    Object.assign(apiError, error);
  }

  return apiError;
}

interface ApiClientConfig {
  baseUrl: string;
  loginBaseUrl: string;
  authenticated?: boolean;
}

export function configureApiClient(
  client: Client,
  { baseUrl, loginBaseUrl, authenticated = true }: ApiClientConfig,
): void {
  client.setConfig({
    baseUrl,
    credentials: 'include',
    throwOnError: true,
    ...(authenticated ? { fetch: createAuthFetch(loginBaseUrl) } : {}),
  });

  client.interceptors.error.use((error, response) =>
    toApiError(error, response?.status),
  );
}
