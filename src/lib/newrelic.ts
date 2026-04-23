import type { CustomEventName } from '@/types/newrelic';

// New Relic configuration
const NR_ACCOUNT_ID = import.meta.env.VITE_NEW_RELIC_ACCOUNT_ID;
const NR_BROWSER_KEY = import.meta.env.VITE_NEW_RELIC_BROWSER_KEY;
const NR_APPLICATION_ID = import.meta.env.VITE_NEW_RELIC_APPLICATION_ID;

let isInitialized = false;

function isProduction(): boolean {
  return import.meta.env.PROD === true;
}

function hasRequiredConfig(): boolean {
  return !!(NR_ACCOUNT_ID && NR_BROWSER_KEY && NR_APPLICATION_ID);
}

function getNewRelic(): Window['newrelic'] | undefined {
  return window.newrelic;
}

function checkStoredConsent(): boolean | null {
  try {
    const stored = localStorage.getItem('icaa_analytics_consent');
    if (stored === 'granted') return true;
    if (stored === 'denied') return false;
    return null;
  } catch {
    // localStorage not available (e.g., iOS Safari private browsing)
    return null;
  }
}

function saveConsentPreference(granted: boolean): void {
  try {
    localStorage.setItem(
      'icaa_analytics_consent',
      granted ? 'granted' : 'denied',
    );
  } catch {
    // localStorage not available (e.g., iOS Safari private browsing)
  }
}

/**
 * Initialize New Relic Browser Agent with consent mode enabled.
 * Only runs in production. Data is buffered until user grants consent.
 */
export async function initNewRelic(): Promise<void> {
  if (!isProduction()) return;
  if (isInitialized) return;
  if (!hasRequiredConfig()) return;

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
        page_view_timing: {},
        spa: { enabled: true },
        ajax: { enabled: true, autoStart: true },
        jserrors: { enabled: true },
        distributed_tracing: {
          enabled: true,
          allowed_origins: ['https://api.icaa.world'],
          cors_use_tracecontext_headers: true,
        },
        session_replay: { enabled: false },
        privacy: { cookies_enabled: true },
        page_view_event: {},
        browser_consent_mode: { enabled: true },
      },
    };

    new BrowserAgent(opts);
    isInitialized = true;
    setCustomAttribute('environment', 'production');

    const storedConsent = checkStoredConsent();
    applyConsent(storedConsent);
  } catch (error) {
    console.error('[New Relic] Failed to initialize:', error);
  }
}

function applyConsent(granted: boolean | null): void {
  const nr = getNewRelic();
  if (!nr || granted === null) return;

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
  return isInitialized && !!window.newrelic;
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
 * Associate all browser events with a user ID.
 * Per New Relic docs: https://docs.newrelic.com/docs/browser/new-relic-browser/browser-apis/setuserid/
 */
export function setUser(userId: string): void {
  if (!isNewRelicAvailable()) return;
  const nr = getNewRelic();
  if (nr) {
    nr.setUserId(userId);
  }
}

/**
 * Clear the user ID association.
 * Per New Relic docs: Passing null unsets any existing user ID.
 */
export function clearUser(): void {
  const nr = getNewRelic();
  if (nr) {
    nr.setUserId(null);
  }
}

export function trackEvent(
  name: CustomEventName,
  attributes?: Record<string, string | number | boolean>,
): void {
  const nr = getNewRelic();
  if (nr) {
    nr.addPageAction(name, attributes);
  }
}

export function trackError(
  error: Error,
  context?: Record<string, string | number | boolean>,
): void {
  const nr = getNewRelic();
  if (nr) {
    nr.noticeError(error, context);
  }
}

export function startInteraction(name: string): () => void {
  const nr = getNewRelic();
  if (nr) {
    const interaction = nr.interaction();
    interaction.setName(name);
    return () => interaction.save();
  }
  return () => {};
}
