import { useState } from 'react';
import { useTitle } from 'react-use';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateDonation } from '@/hooks/useDonation';
import StripeEmbeddedCheckout from '@/components/StripeEmbeddedCheckout';

export default function Donation() {
  useTitle('Donate - ICAA');

  const [clientSecret, setClientSecret] = useState<string | undefined>(
    undefined,
  );
  const { mutate, isPending } = useCreateDonation();

  const formSchema = z.object({
    donorEmail: z.email({ error: 'Email is required.' }),
    amount: z.coerce
      .number({ error: 'Amount must be a number.' })
      .min(1, { error: 'Amount must be at least $1.' })
      .max(10000, { error: 'Amount cannot exceed $10,000.' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(
      {
        body: {
          amount: Math.round(values.amount * 100), // Convert to cents
          currency: 'USD',
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
              <p className="text-center text-gray-600">
                Your donation helps us grow combat archery worldwide and support
                our community programs.
              </p>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-8 w-full"
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
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Donation Amount (USD)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                              $
                            </span>
                            <Input
                              {...field}
                              type="number"
                              min="1"
                              step="0.01"
                              placeholder="50.00"
                              className="bg-white pl-7"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
