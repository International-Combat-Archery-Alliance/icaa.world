import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';

export enum ConsentStatus {
  GRANTED = 'granted',
  DENIED = 'denied',
  PENDING = 'pending',
}

interface ConsentContextValue {
  consentStatus: ConsentStatus;
  hasConsent: boolean;
  showBanner: boolean;
  grantConsent: () => void;
  denyConsent: () => void;
  resetConsent: () => void;
}

const CONSENT_STORAGE_KEY = 'icaa_analytics_consent';

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(
    ConsentStatus.PENDING,
  );
  const [showBanner, setShowBanner] = useState(false);

  // Load consent preference from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (stored) {
      setConsentStatus(stored as ConsentStatus);
    } else {
      // Show banner if no preference stored
      setShowBanner(true);
    }
  }, []);

  const grantConsent = () => {
    setConsentStatus(ConsentStatus.GRANTED);
    localStorage.setItem(CONSENT_STORAGE_KEY, ConsentStatus.GRANTED);
    setShowBanner(false);
  };

  const denyConsent = () => {
    setConsentStatus(ConsentStatus.DENIED);
    localStorage.setItem(CONSENT_STORAGE_KEY, ConsentStatus.DENIED);
    setShowBanner(false);
  };

  const resetConsent = () => {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    setConsentStatus(ConsentStatus.PENDING);
    setShowBanner(true);
  };

  const hasConsent = consentStatus === ConsentStatus.GRANTED;

  return (
    <ConsentContext.Provider
      value={{
        consentStatus,
        hasConsent,
        showBanner,
        grantConsent,
        denyConsent,
        resetConsent,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (!context) {
    throw new Error('useConsent must be used within ConsentProvider');
  }
  return context;
}
