import { useTitle } from 'react-use';
import {
  useGetEvent,
  useRegisterForEventWithPayment,
  type Event,
} from '@/hooks/useEvent';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useParams } from 'react-router-dom';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventDetailsCard } from '@/components/EventRegDetailsCard';
import { Trash2 } from 'lucide-react';
import { TurnstileFormField } from '@/components/TurnstileFormField';
import { useEventPaymentInfo } from '@/hooks/useEventPaymentInfo';
import { DateTime } from 'luxon';
import InProgressPayment from '@/components/InProgressPayment';

export default function EventRegistrationTeam() {
  useTitle('Team Registration - ICAA');

  const { eventId } = useParams();
  const { data } = useGetEvent(eventId!);

  return (
    <div className="px-4 py-4">
      {data ? <TeamForm event={data.event} /> : null}
    </div>
  );
}

function TeamForm({ event }: { event: Event }) {
  const { mutate, isPending } = useRegisterForEventWithPayment();

  const [paymentInfo, setPaymentInfo] = useEventPaymentInfo(event.id);

  const navigate = useNavigate();

  const playerSchema = z.object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
  });

  const formSchema = z.object({
    captainEmail: z.email({ message: 'A valid captain email is required.' }),
    homeCity: z.string().min(3, {
      message: 'Home city must be at least 3 characters.',
    }),
    teamName: z
      .string()
      .min(1, {
        message: 'Team name must be 1-50 characters',
      })
      .max(50, { message: 'Team name must be 1-50 characters' }),

    players: z
      .array(playerSchema)
      .min(event.allowedTeamSizeRange.min, {
        message: `At least ${event.allowedTeamSizeRange.min} player(s) are required.`,
      })
      .max(event.allowedTeamSizeRange.max, {
        message: `Maximum of ${event.allowedTeamSizeRange.max} players allowed.`,
      }),
    turnstileToken: z
      .string()
      .min(1, { message: "You must verify you're human" }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'players',
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
        body: {
          registrationType: 'ByTeam',
          captainEmail: values.captainEmail,
          teamName: values.teamName,
          homeCity: values.homeCity,
          players: values.players,
        } as components['schemas']['TeamRegistration'],
      },
      {
        onSuccess: (resp) => {
          setPaymentInfo({
            clientSecret: resp.info.clientSecret,
            expiresAt: DateTime.fromISO(resp.info.expiresAt),
          });
          navigate(`/events/${event.id}/payment`);
          // Reset the form on the original page after opening the payment link
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
            Team Registration
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          {paymentInfo !== undefined ? (
            <InProgressPayment eventId={event.id} />
          ) : (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-8 w-full"
              >
                <FormField
                  control={form.control}
                  name="captainEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Captain Email</FormLabel>
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
                    name="teamName"
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormLabel>Team Name</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                </div>

                <div>
                  <div className="mb-4">
                    <FormLabel>Player Roster ({fields.length})</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      This event requires a team of at least{' '}
                      {event.allowedTeamSizeRange.min} and at most{' '}
                      {event.allowedTeamSizeRange.max} players.
                    </p>
                  </div>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div
                        key={field.id}
                        className="flex items-start gap-4 p-4 border rounded-lg"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-grow">
                          <FormField
                            control={form.control}
                            name={`players.${index}.firstName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {index === 0
                                    ? "Captain's First Name"
                                    : 'First Name'}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} className="bg-white" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`players.${index}.lastName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  {index === 0
                                    ? "Captain's Last Name"
                                    : 'Last Name'}
                                </FormLabel>
                                <FormControl>
                                  <Input {...field} className="bg-white" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          className="mt-8"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={
                            fields.length <= event.allowedTeamSizeRange.min
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="mt-4"
                    onClick={() => append({ firstName: '', lastName: '' })}
                    disabled={fields.length >= event.allowedTeamSizeRange.max}
                  >
                    Add Player
                  </Button>
                  <FormMessage>
                    {form.formState.errors.players?.message ||
                      form.formState.errors.players?.root?.message}
                  </FormMessage>
                </div>
                <TurnstileFormField form={form} fieldName="turnstileToken" />
                <Button type="submit" disabled={isPending}>
                  {isPending ? 'Submitting...' : 'Continue to payment'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </>
  );
}
