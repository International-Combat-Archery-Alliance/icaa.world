import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export interface StripeEmbeddedCheckoutProps {
  clientSecret: string;
}

export default function StripeEmbeddedCheckout({
  clientSecret,
}: StripeEmbeddedCheckoutProps) {
  const options = { clientSecret };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
