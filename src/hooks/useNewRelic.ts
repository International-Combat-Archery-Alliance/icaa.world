import { useCallback } from 'react';
import {
  setUser,
  clearUser,
  trackEvent,
  trackError,
  setCustomAttribute,
  startInteraction,
  isNewRelicAvailable,
} from '@/lib/newrelic';
import type { CustomEventName } from '@/types/newrelic';

interface UseNewRelicReturn {
  /**
   * Check if New Relic is available and initialized
   */
  isAvailable: boolean;

  /**
   * Set user email (call on login)
   */
  setUser: (email: string) => void;

  /**
   * Clear user email (call on logout)
   */
  clearUser: () => void;

  /**
   * Track a custom event
   */
  trackEvent: (
    name: CustomEventName,
    attributes?: Record<string, string | number | boolean>,
  ) => void;

  /**
   * Track an error with optional context
   */
  trackError: (
    error: Error,
    context?: Record<string, string | number | boolean>,
  ) => void;

  /**
   * Set a custom attribute on all events
   */
  setCustomAttribute: (name: string, value: string | number | boolean) => void;

  /**
   * Start a named interaction for manual timing
   * Returns a function to end the interaction
   */
  startInteraction: (name: string) => () => void;
}

/**
 * React hook for New Relic tracking
 * Provides a convenient interface for tracking events and errors
 *
 * @example
 * const { trackEvent, setUser } = useNewRelic()
 *
 * // On login
 * setUser(user.email)
 *
 * // Track custom event
 * trackEvent('donation_completed')
 *
 * // Track with attributes
 * trackEvent('event_registration', { eventId: '123', eventName: 'World Championship' })
 */
export function useNewRelic(): UseNewRelicReturn {
  const handleSetUser = useCallback((email: string) => {
    setUser(email);
  }, []);

  const handleClearUser = useCallback(() => {
    clearUser();
  }, []);

  const handleTrackEvent = useCallback(
    (
      name: CustomEventName,
      attributes?: Record<string, string | number | boolean>,
    ) => {
      trackEvent(name, attributes);
    },
    [],
  );

  const handleTrackError = useCallback(
    (error: Error, context?: Record<string, string | number | boolean>) => {
      trackError(error, context);
    },
    [],
  );

  const handleSetCustomAttribute = useCallback(
    (name: string, value: string | number | boolean) => {
      setCustomAttribute(name, value);
    },
    [],
  );

  const handleStartInteraction = useCallback((name: string) => {
    return startInteraction(name);
  }, []);

  return {
    isAvailable: isNewRelicAvailable(),
    setUser: handleSetUser,
    clearUser: handleClearUser,
    trackEvent: handleTrackEvent,
    trackError: handleTrackError,
    setCustomAttribute: handleSetCustomAttribute,
    startInteraction: handleStartInteraction,
  };
}
