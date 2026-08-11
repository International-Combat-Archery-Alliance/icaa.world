import { useConsent } from '@/context/consentContext';
import { Button } from '@/components/ui/button';

export default function ConsentBanner() {
  const { showBanner, grantConsent, denyConsent } = useConsent();

  if (!showBanner) return null;

  return (
    <div className="bg-background/95 fixed right-0 bottom-0 left-0 z-50 border-t p-3 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-3 text-sm sm:flex-row sm:items-center">
        <div className="flex-1">
          <span className="font-medium">Analytics & Performance</span>
          <span className="text-muted-foreground ml-2">
            We use cookies to monitor site performance and fix errors.
          </span>
        </div>
        <div className="flex shrink-0 gap-2 self-center sm:self-auto">
          <Button variant="ghost" size="sm" onClick={denyConsent}>
            Decline
          </Button>
          <Button size="sm" onClick={grantConsent}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
