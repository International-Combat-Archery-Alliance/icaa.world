import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { useLocalStorage } from 'react-use';
import { setConsent as setNewRelicConsent } from '@/lib/newrelic';

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
  const [storedConsent, setStoredConsent, removeStoredConsent] =
    useLocalStorage<ConsentStatus | null>(CONSENT_STORAGE_KEY, null);
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>(
    ConsentStatus.PENDING,
  );
  const [showBanner, setShowBanner] = useState(false);

  // Load consent preference from localStorage on mount and sync with New Relic
  useEffect(() => {
    if (storedConsent) {
      // We have a stored consent value
      setConsentStatus(storedConsent);
      setNewRelicConsent(storedConsent === ConsentStatus.GRANTED);
      setShowBanner(false);
    } else if (storedConsent === null) {
      // Explicitly null means localStorage was checked and is empty
      setShowBanner(true);
    }
    // If undefined, react-use hasn't finished reading localStorage yet, wait
  }, [storedConsent]);

  const grantConsent = () => {
    setConsentStatus(ConsentStatus.GRANTED);
    setStoredConsent(ConsentStatus.GRANTED);
    setNewRelicConsent(true);
    setShowBanner(false);
  };

  const denyConsent = () => {
    setConsentStatus(ConsentStatus.DENIED);
    setStoredConsent(ConsentStatus.DENIED);
    setNewRelicConsent(false);
    setShowBanner(false);
  };

  const resetConsent = () => {
    removeStoredConsent();
    setConsentStatus(ConsentStatus.PENDING);
    setNewRelicConsent(false);
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
