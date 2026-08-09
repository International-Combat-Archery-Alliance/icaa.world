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
  return {
    async onResponse({ response, request }) {
      // If we get a 401 and it's not the refresh endpoint itself
      if (response.status === 401 && !request.url.includes('/login/refresh')) {
        const refreshed = await refreshAccessToken();

        if (refreshed) {
          // Retry the original request
          return fetch(request);
        }
      }

      return response;
    },
  };
}

// Hook to manually trigger logout on refresh failure
export function useAuthRefresh() {
  return {
    refreshAccessToken,
  };
}
