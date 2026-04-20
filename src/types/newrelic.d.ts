// TypeScript declarations for New Relic Browser Agent

declare global {
  interface Window {
    newrelic?: {
      // User identification
      setUserId(value: string | null, resetSession?: boolean): void;
      setUserEmail(email: string): void;

      // Custom attributes
      setCustomAttribute(name: string, value: string | number | boolean): void;

      // Error tracking
      noticeError(
        error: Error,
        customAttributes?: Record<string, string | number | boolean>,
      ): void;

      // Custom events
      addPageAction(
        name: string,
        attributes?: Record<string, string | number | boolean>,
      ): void;

      // Distributed tracing
      addToTrace(traceData: {
        traceId: string;
        spanId?: string;
        timestamp: number;
        name: string;
      }): void;

      // Interaction tracking (SPA)
      interaction(): {
        save(): void;
        ignore(): void;
        getContext(callback: (ctx: Record<string, unknown>) => void): void;
        setName(name: string): void;
        setAttribute(name: string, value: string | number | boolean): void;
      };

      // Consent mode API
      consent(accept?: boolean): void;

      // Generic method call for other features
      callMethod?(method: string, ...args: unknown[]): void;
    };
  }
}

// Custom events we track
type CustomEventName =
  | 'user_login'
  | 'user_logout'
  | 'user_registration_complete'
  | 'event_registration'
  | 'donation_completed';

// Custom attributes we set
type CustomAttributeName = 'userEmail' | 'environment' | 'componentStack';

export type { CustomEventName, CustomAttributeName };
