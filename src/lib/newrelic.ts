import type { CustomEventName } from '@/types/newrelic';

// New Relic configuration
const NR_ACCOUNT_ID = import.meta.env.VITE_NEW_RELIC_ACCOUNT_ID;
const NR_BROWSER_KEY = import.meta.env.VITE_NEW_RELIC_BROWSER_KEY;
const NR_APPLICATION_ID = import.meta.env.VITE_NEW_RELIC_APPLICATION_ID;

let isInitialized = false;

/**
 * Check if we're in production environment
 * New Relic is only initialized in production builds
 */
function isProduction(): boolean {
  return import.meta.env.PROD === true;
}

/**
 * Check if all required New Relic configuration is present
 */
function hasRequiredConfig(): boolean {
  return !!(NR_ACCOUNT_ID && NR_BROWSER_KEY && NR_APPLICATION_ID);
}

/**
 * Initialize New Relic Browser Agent
 * Only runs in production builds with valid configuration
 */
export async function initNewRelic(): Promise<void> {
  // Skip in development
  if (!isProduction()) {
    console.log('[New Relic] Skipped initialization (development mode)');
    return;
  }

  // Skip if already initialized
  if (isInitialized) {
    return;
  }

  // Skip if missing config
  if (!hasRequiredConfig()) {
    console.warn(
      '[New Relic] Missing required configuration, skipping initialization',
    );
    return;
  }

  try {
    const { BrowserAgent } = await import('@newrelic/browser-agent');

    const opts = {
      info: {
        beacon: 'bam.nr-data.net',
        errorBeacon: 'bam.nr-data.net',
        licenseKey: NR_BROWSER_KEY,
        applicationID: NR_APPLICATION_ID,
        sa: 1,
      },
      loader_config: {
        accountID: NR_ACCOUNT_ID,
        trustKey: NR_ACCOUNT_ID,
        agentID: NR_APPLICATION_ID,
        licenseKey: NR_BROWSER_KEY,
        applicationID: NR_APPLICATION_ID,
      },
      init: {
        // Page load timing
        page_view_timing: {},

        // SPA monitoring (for React Router)
        spa: {
          enabled: true,
        },

        // AJAX/fetch monitoring
        ajax: {
          enabled: true,
          autoStart: true,
        },

        // JavaScript errors
        jserrors: {
          enabled: true,
        },

        // Distributed tracing
        distributed_tracing: {
          enabled: true,
          allowed_origins: ['https://api.icaa.world'],
        },

        // Session replay (optional, can be enabled later)
        session_replay: {
          enabled: false,
        },

        // Privacy settings
        privacy: {
          cookies_enabled: true,
        },

        // Performance timing API
        page_view_event: {},
      },
    };

    // Initialize the browser agent (it auto-registers to window.newrelic)
    new BrowserAgent(opts);
    isInitialized = true;

    // Set environment attribute
    setCustomAttribute('environment', 'production');

    console.log('[New Relic] Initialized successfully');
  } catch (error) {
    console.error('[New Relic] Failed to initialize:', error);
  }
}

/**
 * Check if New Relic is available and initialized
 */
export function isNewRelicAvailable(): boolean {
  return isInitialized && typeof window !== 'undefined' && !!window.newrelic;
}

/**
 * Get the global newrelic object from window
 */
function getNewRelic(): Window['newrelic'] | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.newrelic;
}

/**
 * Set a custom attribute on all events
 */
export function setCustomAttribute(
  name: string,
  value: string | number | boolean,
): void {
  const nr = getNewRelic();
  if (nr) {
    nr.setCustomAttribute(name, value);
  }
}

/**
 * Set user email as a custom attribute
 * Call this when user logs in
 */
export function setUser(email: string): void {
  const nr = getNewRelic();
  if (nr) {
    nr.setCustomAttribute('userEmail', email);
  }
}

/**
 * Clear user email (call on logout)
 */
export function clearUser(): void {
  const nr = getNewRelic();
  if (nr) {
    nr.setCustomAttribute('userEmail', '');
  }
}

/**
 * Track a custom event
 */
export function trackEvent(
  name: CustomEventName,
  attributes?: Record<string, string | number | boolean>,
): void {
  const nr = getNewRelic();
  if (nr) {
    nr.addPageAction(name, attributes);
  }
}

/**
 * Track an error with optional context
 */
export function trackError(
  error: Error,
  context?: Record<string, string | number | boolean>,
): void {
  const nr = getNewRelic();
  if (nr) {
    nr.noticeError(error, context);
  }
}

/**
 * Start a named interaction (for manual SPA timing)
 * Returns a function to end the interaction
 */
export function startInteraction(name: string): () => void {
  const nr = getNewRelic();
  if (nr) {
    const interaction = nr.interaction();
    interaction.setName(name);
    return () => interaction.save();
  }
  return () => {};
}
