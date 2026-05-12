import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { TurnstileFormField } from '@/components/TurnstileFormField';
import { useSignupForMailingList } from '@/hooks/useMailingListSignup';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  name: z.string().optional(),
  turnstileToken: z
    .string()
    .min(1, { message: "You must verify you're human" }),
});

const MailingListForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate, isPending, error } = useSignupForMailingList();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      turnstileToken: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(
      {
        params: {
          header: { 'cf-turnstile-response': values.turnstileToken },
        },
        body: {
          email: values.email,
          name: values.name || undefined,
        },
      },
      {
        onSuccess: () => {
          setIsSubmitted(true);
        },
      },
    );
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 p-6 border rounded-lg shadow-sm bg-card text-card-foreground">
        <h3 className="text-xl font-semibold">Thank you for signing up!</h3>
        <Button onClick={() => setIsSubmitted(false)} variant="outline">
          Back
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 p-6 border rounded-lg shadow-sm bg-card text-card-foreground"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name (optional)</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <TurnstileFormField form={form} fieldName="turnstileToken" />
        {error && (
          <p className="text-sm text-destructive">
            {error.message || 'An error occurred. Please try again.'}
          </p>
        )}
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? 'Signing up...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  );
};

export default MailingListForm;
