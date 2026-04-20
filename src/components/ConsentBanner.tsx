import { useConsent } from '@/context/consentContext';
import { Button } from '@/components/ui/button';

export default function ConsentBanner() {
  const { showBanner, grantConsent, denyConsent } = useConsent();

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-background/95 backdrop-blur-sm border-t">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 text-sm">
        <div className="flex-1">
          <span className="font-medium">Analytics & Performance</span>
          <span className="text-muted-foreground ml-2">
            We use cookies to monitor site performance and fix errors.
          </span>
        </div>
        <div className="flex gap-2 shrink-0 self-center sm:self-auto">
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
