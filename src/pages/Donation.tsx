import { useState } from 'react';
import { useTitle } from 'react-use';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { trackEvent } from '@/lib/newrelic';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateDonation } from '@/hooks/useDonation';
import { formatCurrencyAmount } from '@/api/money';
import { Money } from 'ts-money';
import StripeEmbeddedCheckout from '@/components/StripeEmbeddedCheckout';

const PRESET_AMOUNTS = [10, 25, 50, 100, 250];

export default function Donation() {
  useTitle('Donate - ICAA');

  const [clientSecret, setClientSecret] = useState<string | undefined>(
    undefined,
  );
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const { mutate, isPending } = useCreateDonation();

  const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'] as const;

  const formSchema = z.object({
    donorEmail: z.email({ error: 'Email is required.' }),
    amount: z.coerce
      .number({ error: 'Amount must be a number.' })
      .min(1, { error: 'Amount must be at least $1.' })
      .max(10000, { error: 'Amount cannot exceed $10,000.' }),
    currency: z.enum(SUPPORTED_CURRENCIES).default('USD'),
    acceptedPolicies: z.boolean().refine((val) => val === true, {
      error:
        'You must accept the Privacy Policy and Terms of Service to continue.',
    }),
    coverProcessingFees: z.boolean().default(false),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Stripe fee structure by currency (percentage + fixed fee)
  const getStripeFee = (currency: string) => {
    const fees: Record<string, { percent: number; fixed: number }> = {
      USD: { percent: 0.029, fixed: 0.3 },
      EUR: { percent: 0.029, fixed: 0.25 },
      GBP: { percent: 0.029, fixed: 0.2 },
      CAD: { percent: 0.029, fixed: 0.3 },
      AUD: { percent: 0.029, fixed: 0.3 },
    };
    return fees[currency] || fees.USD;
  };

  const calculateTotalWithFees = (amount: number, currency: string): number => {
    const fee = getStripeFee(currency);
    const total = (amount + fee.fixed) / (1 - fee.percent);
    return Money.fromDecimal(total, currency, Math.round).toDecimal();
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Calculate amount with fees if selected
    const totalAmount = values.coverProcessingFees
      ? calculateTotalWithFees(values.amount, values.currency)
      : values.amount;
    // Use ts-money to convert major units to minor units (cents)
    const money = Money.fromDecimal(totalAmount, values.currency);
    mutate(
      {
        body: {
          amount: money.getAmount(), // Amount in minor units (cents)
          currency: values.currency,
          donorEmail: values.donorEmail,
        },
      },
      {
        onSuccess: (data) => {
          if (data?.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            console.error('No clientSecret in response:', data);
            alert('Something went wrong. Please try again.');
          }
        },
        onError: (error) => {
          console.error('Donation failed:', error);
          alert(`Donation failed: ${error.message || 'Unknown error'}`);
        },
      },
    );
  };

  const handleCheckoutComplete = () => {
    // Track donation completion
    trackEvent('donation_completed');
    // Navigate to success page on completion
    window.location.href = '/donation/success';
  };

  return (
    <div className="px-4 py-4 max-w-screen-lg mx-auto">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-center font-bold text-2xl">
            Support the ICAA
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {!clientSecret ? (
            <>
              <img
                src="https://assets.icaa.world/bd242bdf-283e-4b80-bbe5-f8d2c28b133e.webp"
                alt="ICAA combat archery"
                className="w-full h-48 md:h-80 rounded-lg object-cover"
              />
              <p className="text-center text-gray-600">
                Your donation helps us grow Combat Archery worldwide and support
                our community programs.
              </p>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-6 w-full"
                >
                  <FormField
                    control={form.control}
                    name="donorEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="your@email.com"
                            className="bg-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => {
                      const currency = form.watch('currency') || 'USD';
                      const formatter = new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency,
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      });
                      const parts = formatter.formatToParts(0);
                      const currencySymbol =
                        parts.find((p) => p.type === 'currency')?.value ||
                        currency;

                      const handlePresetClick = (amount: number) => {
                        setIsCustomAmount(false);
                        field.onChange(amount);
                      };

                      const handleCustomClick = () => {
                        setIsCustomAmount(true);
                        field.onChange('');
                      };

                      return (
                        <FormItem className="w-full">
                          <FormLabel>Donation Amount</FormLabel>
                          <FormControl>
                            <div className="space-y-4">
                              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                                {PRESET_AMOUNTS.map((amount) => (
                                  <Button
                                    key={amount}
                                    type="button"
                                    variant={
                                      field.value === amount && !isCustomAmount
                                        ? 'default'
                                        : 'outline'
                                    }
                                    onClick={() => handlePresetClick(amount)}
                                    className="w-full"
                                  >
                                    {currencySymbol}
                                    {amount}
                                  </Button>
                                ))}
                                <Button
                                  type="button"
                                  variant={
                                    isCustomAmount ? 'default' : 'outline'
                                  }
                                  onClick={handleCustomClick}
                                  className="w-full"
                                >
                                  Custom
                                </Button>
                              </div>
                              {isCustomAmount && (
                                <div className="relative w-full max-w-xs">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    {currencySymbol}
                                  </span>
                                  <Input
                                    {...field}
                                    type="number"
                                    min="1"
                                    step="0.01"
                                    placeholder="Enter amount"
                                    className="bg-white pl-10 w-full"
                                    autoFocus
                                  />
                                </div>
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem className="w-full max-w-xs">
                        <FormLabel>Currency</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value || 'USD'}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {SUPPORTED_CURRENCIES.map((currency) => (
                              <SelectItem key={currency} value={currency}>
                                {currency}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="acceptedPolicies"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            <span>
                              I agree to the{' '}
                              <a
                                href="https://assets.icaa.world/63275a84-7c75-4ea9-8849-4f3499f88335.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Privacy Policy
                              </a>{' '}
                              and{' '}
                              <a
                                href="https://assets.icaa.world/ef2127a5-2b86-4790-8790-f3e2444d2ab4.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline"
                              >
                                Terms of Service
                              </a>
                            </span>
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverProcessingFees"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            I&apos;d like to cover the processing fees so 100%
                            of my donation goes to ICAA
                          </FormLabel>
                          {field.value && Number(form.watch('amount')) > 0 && (
                            <p className="text-xs text-muted-foreground">
                              Your total will be{' '}
                              {formatCurrencyAmount(
                                calculateTotalWithFees(
                                  Number(form.watch('amount')),
                                  form.watch('currency') || 'USD',
                                ),
                                form.watch('currency') || 'USD',
                              )}{' '}
                              to cover Stripe&apos;s processing fee. We
                              appreciate your generosity!
                            </p>
                          )}
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="bg-muted p-4 rounded-lg border border-border space-y-3 text-sm">
                    <h4 className="font-semibold text-base">Donation Notice</h4>
                    <div className="space-y-2 text-muted-foreground">
                      <p>
                        <strong>Processing:</strong> Donations are processed
                        securely by Stripe.
                      </p>
                      <p>
                        <strong>Tax-exempt status pending:</strong> ICAA&apos;s
                        501(c)(3) application is pending. If approved, exempt
                        status is generally recognized back to ICAA&apos;s
                        formation date; donations are generally deductible to
                        the extent allowed by law. Please consult a tax
                        professional.
                      </p>
                      <p>
                        <strong>No goods or services:</strong> No goods or
                        services were provided in exchange for this
                        contribution.
                      </p>
                      <p>
                        <strong>California residents:</strong> We are not
                        allowed to accept donations from California residents at
                        this time. If you are a resident of California, please
                        reach out to us at{' '}
                        <a
                          href="mailto:support@icaa.world"
                          className="text-primary hover:underline"
                        >
                          support@icaa.world
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? 'Processing...' : 'Continue to Payment'}
                  </Button>
                </form>
              </Form>
            </>
          ) : (
            <StripeEmbeddedCheckout
              clientSecret={clientSecret}
              onComplete={handleCheckoutComplete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
