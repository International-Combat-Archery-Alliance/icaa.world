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
 * Get the global newrelic object from window
 */
function getNewRelic(): Window['newrelic'] | undefined {
  if (typeof window === 'undefined') return undefined;
  return window.newrelic;
}

/**
 * Check localStorage for stored consent preference
 */
function checkStoredConsent(): boolean | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('icaa_analytics_consent');
  if (stored === 'granted') return true;
  if (stored === 'denied') return false;
  return null;
}

/**
 * Save consent preference to localStorage
 */
function saveConsentPreference(granted: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(
    'icaa_analytics_consent',
    granted ? 'granted' : 'denied',
  );
}

/**
 * Initialize New Relic Browser Agent with consent mode enabled
 * Uses New Relic's native browser_consent_mode feature
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

        // Enable New Relic's consent mode
        // Data will be buffered locally until consent() is called
        browser_consent_mode: {
          enabled: true,
        },
      },
    };

    // Initialize the browser agent with consent mode enabled
    new BrowserAgent(opts);
    isInitialized = true;

    console.log('[New Relic] Initialized with consent mode enabled');

    // Check for stored consent and apply it
    const storedConsent = checkStoredConsent();
    if (storedConsent === true) {
      // User previously granted consent
      applyConsent(true);
      console.log('[New Relic] Previous consent restored, tracking enabled');
    } else if (storedConsent === false) {
      // User previously denied consent
      applyConsent(false);
      console.log('[New Relic] Previous consent restored, tracking denied');
    } else {
      // No stored consent - agent is buffering data but not sending
      console.log('[New Relic] Awaiting user consent (data buffered locally)');
    }
  } catch (error) {
    console.error('[New Relic] Failed to initialize:', error);
  }
}

/**
 * Apply consent using New Relic's consent() API
 * consent() - accepts consent (defaults to true)
 * consent(false) - rejects consent
 */
function applyConsent(granted: boolean): void {
  const nr = getNewRelic();
  if (!nr) return;

  // Call New Relic's native consent API
  // Per docs: consent() accepts, consent(false) rejects
  if (granted) {
    nr.consent();
  } else {
    nr.consent(false);
  }
}

/**
 * Set user consent for analytics tracking
 * Call this when user accepts or declines the consent banner
 */
export function setConsent(hasConsent: boolean): void {
  saveConsentPreference(hasConsent);
  applyConsent(hasConsent);

  if (hasConsent) {
    // Set environment attribute now that tracking is enabled
    setCustomAttribute('environment', 'production');
    console.log('[New Relic] Consent granted, tracking enabled');
  } else {
    console.log('[New Relic] Consent denied, tracking disabled');
  }
}

/**
 * Check if user has given consent
 */
export function hasUserConsent(): boolean {
  return checkStoredConsent() === true;
}

/**
 * Check if New Relic is available and initialized
 */
export function isNewRelicAvailable(): boolean {
  return isInitialized && typeof window !== 'undefined' && !!window.newrelic;
}

/**
 * Set a custom attribute on all events
 * Only sent if user has given consent
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
 * Call this when user logs in - only tracked if consent given
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
 * Only sent if user has given consent
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
 * Errors are tracked regardless of consent (for debugging)
 * User data is only included if consent is given
 */
export function trackError(
  error: Error,
  context?: Record<string, string | number | boolean>,
): void {
  const nr = getNewRelic();
  if (nr) {
    // For errors, we track but remove PII if no consent
    let safeContext: Record<string, string | number | boolean> | undefined;
    if (hasUserConsent()) {
      safeContext = context;
    } else if (context) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userEmail, ...rest } = context;
      safeContext = rest;
    }
    nr.noticeError(error, safeContext);
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
