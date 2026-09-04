import type { Middleware } from 'openapi-fetch';
import createFetchClient from 'openapi-fetch';
import type { paths as loginPaths } from '@/api/login';

// Token refresh state
let isRefreshing = false;
let refreshSubscribers: Array<(success: boolean) => void> = [];

function notifySubscribers(success: boolean) {
  refreshSubscribers.forEach((callback) => callback(success));
  refreshSubscribers = [];
}

function waitForRefresh(): Promise<boolean> {
  return new Promise((resolve) => {
    refreshSubscribers.push((success) => resolve(success));
  });
}

async function refreshAccessToken(): Promise<boolean> {
  if (isRefreshing) {
    return waitForRefresh();
  }

  isRefreshing = true;

  try {
    const client = createFetchClient<loginPaths>({
      baseUrl: import.meta.env.VITE_LOGIN_API_URL,
    });

    const { response } = await client.POST('/login/refresh', {
      credentials: 'include',
    });

    const success = response.ok;
    notifySubscribers(success);
    return success;
  } catch {
    notifySubscribers(false);
    return false;
  } finally {
    isRefreshing = false;
  }
}

// Create auth middleware that handles 401s by refreshing the token
export function createAuthMiddleware(): Middleware {
  // Store a pre-fetch clone of each request so retries don't reuse a
  // body that has already been consumed. Keyed by openapi-fetch's
  // per-request id to stay safe under concurrency.
  const requestBackup = new Map<string, Request>();

  return {
    async onRequest({ request, id }) {
      try {
        requestBackup.set(id, request.clone());
      } catch {
        // Cloning can fail for uncloneable bodies; fall back to retrying
        // with the original request (may fail for POSTs with bodies).
      }
      return undefined;
    },
    async onResponse({ response, request, id }) {
      const backup = requestBackup.get(id);
      requestBackup.delete(id);

      // If we get a 401 and it's not the refresh endpoint itself
      if (response.status === 401 && !request.url.includes('/login/refresh')) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          if (!backup) {
            return response;
          }
          // Retry with the pre-fetch clone. fetch() on the original throws
          // "Cannot construct a Request with a Request object that has
          // already been used" for POSTs because the body stream was
          // consumed by the first attempt.
          return fetch(backup);
        }
      }

      return response;
    },
    async onError({ id }) {
      requestBackup.delete(id);
    },
  };
}

// Hook to manually trigger logout on refresh failure
export function useAuthRefresh() {
  return {
    refreshAccessToken,
  };
}
