import { useTitle } from 'react-use';
import {
  useGetEvent,
  useRegisterForEventWithPayment,
  type Event,
} from '@/hooks/useEvent';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams } from 'react-router-dom';
import type { components } from '@/api/events-v1';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventDetailsCard } from '@/components/EventRegDetailsCard';
import { TurnstileFormField } from '@/components/TurnstileFormField';
import StripeEmbeddedCheckout from '@/components/StripeEmbeddedCheckout';
import { useState } from 'react';

export default function EventRegistrationFreeAgent() {
  useTitle('Free Agent Registration - ICAA');

  const { eventId } = useParams();
  const { data } = useGetEvent(eventId!);

  return (
    <div className="px-4 py-4">
      {data ? <FreeAgentForm event={data.event} /> : null}
    </div>
  );
}

function FreeAgentForm({ event }: { event: Event }) {
  const { mutate, isPending } = useRegisterForEventWithPayment();

  const [clientSecret, setClientSecret] = useState<string | undefined>();

  const experienceOptions = ['Novice', 'Intermediate', 'Advanced'] as const;

  const formSchema = z.object({
    email: z.email({ error: 'Email is required.' }),
    homeCity: z.string({ error: 'Home city is required.' }).min(3, {
      error: 'Home city must be at least 3 characters.',
    }),
    playerInfo: z.object({
      firstName: z
        .string({ error: 'Name is required.' })
        .min(1, {
          error: 'First name must be 1-50 characters',
        })
        .max(50, { error: 'First name must be 1-50 characters' }),
      lastName: z
        .string({ error: 'Name is required.' })
        .min(1, {
          error: 'Last name must be 1-50 characters',
        })
        .max(50, { error: 'Last name must be 1-50 characters' }),
    }),
    experience: z.enum(experienceOptions, {
      error: 'Experience is required.',
    }),
    turnstileToken: z
      .string()
      .min(1, { message: "You must verify you're human" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      turnstileToken: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(
      {
        params: {
          path: {
            eventId: event.id,
          },
          header: {
            'cf-turnstile-response': values.turnstileToken,
          },
        },
        // TODO: this has a type error since I'm not passing the readonly properties, I want to not have to cast this to fix that eventually
        body: {
          registrationType: 'ByIndividual',
          email: values.email,
          experience: values.experience,
          homeCity: values.homeCity,
          playerInfo: values.playerInfo,
        } as components['schemas']['IndividualRegistration'],
      },
      {
        onSuccess: (resp) => {
          setClientSecret(resp.info.clientSecret);
          // window.open(
          //   'https://buy.stripe.com/dRm8wOgPA0CXgNB4Kbco003',
          //   '_blank',
          // );
          form.reset();
        },
        onError: (error) => {
          console.error('Registration failed:', error);
          alert(`Registration failed: ${error.message}`);
        },
      },
    );
  };
  return (
    <>
      <EventDetailsCard event={event} />
      <Card className="w-full max-w-screen-lg mx-auto lg:p-15">
        <CardHeader>
          <CardTitle className="text-center font-bold text-2xl">
            Free Agent Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-8 w-full"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col gap-4 lg:flex-row">
                <FormField
                  control={form.control}
                  name="playerInfo.firstName"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="playerInfo.lastName"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-4 lg:flex-row">
                <FormField
                  control={form.control}
                  name="homeCity"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Home city</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Experience level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full bg-white">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {experienceOptions.map((v) => (
                            <SelectItem key={v} value={v}>
                              {v}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <TurnstileFormField form={form} fieldName="turnstileToken" />
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <StripeEmbeddedCheckout clientSecret={clientSecret} />
    </>
  );
}
