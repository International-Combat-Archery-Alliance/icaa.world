import { useGetEvent, useRegisterForEvent, type Event } from '@/hooks/useEvent';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import type { components } from '@/api/events-v1';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
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
import { useState } from 'react';
import { EventDetailsCard } from '@/components/EventRegDetailsCard';
import { Trash2 } from 'lucide-react';

export default function EventRegistrationTeam() {
  const { eventId } = useParams();
  const { data } = useGetEvent(eventId!);

  return (
    <div className="px-4 py-4">
      {data ? <TeamForm event={data.event} /> : null}
    </div>
  );
}

function TeamForm({ event }: { event: Event }) {
  const { mutate, isPending } = useRegisterForEvent();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();
  const playerSchema = z.object({
    firstName: z.string().min(1, 'First name is required.'),
    lastName: z.string().min(1, 'Last name is required.'),
  });

  const formSchema = z.object({
    captainEmail: z
      .string()
      .email({ message: 'A valid captain email is required.' }),
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
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'players',
  });

  const teamName = form.watch('teamName');
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(
      {
        params: {
          path: {
            eventId: event.id,
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
        onSuccess: () => {
          setShowSuccessDialog(true);
          form.reset();
        },
      },
    );
  };
  return (
    <>
      <EventDetailsCard event={event} />
      <Card className="w-full max-w-screen-lg mx-auto p-15">
        <CardHeader>
          <CardTitle className="text-center font-bold text-2xl">
            Team Registration
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
              <div className="md:flex md:gap-4">
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
                <FormLabel>Player Roster ({fields.length})</FormLabel>
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
                      disabled={fields.length <= event.allowedTeamSizeRange.min}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => append({ firstName: '', lastName: '' })}
                >
                  Add Player
                </Button>
                <FormMessage>
                  {form.formState.errors.players?.message ||
                    form.formState.errors.players?.root?.message}
                </FormMessage>
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Registration Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              The {teamName} have been successfully registered for {event.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate(`/events`)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
