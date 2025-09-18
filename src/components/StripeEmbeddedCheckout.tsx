import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface StripeEmbeddedCheckoutProps {
  clientSecret: string | undefined;
  onComplete?: () => void;
}

export default function StripeEmbeddedCheckout({
  clientSecret,
  onComplete,
}: StripeEmbeddedCheckoutProps) {
  const options = { clientSecret, onComplete };

  return (
    <div className="w-full mx-auto">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
