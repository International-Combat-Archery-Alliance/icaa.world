import { useGetEvent, useRegisterForEvent, type Event } from '@/hooks/useEvent';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useNavigate } from 'react-router-dom';
import type { components } from '@/events/v1';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { EventDetailsCard } from '@/components/EventRegDetailsCard';

export default function EventRegistrationFreeAgent() {
  const { eventId } = useParams();
  const { data } = useGetEvent(eventId!);

  return (
    <div className="px-4 py-4">
      {data ? <FreeAgentForm event={data.event} /> : null}
    </div>
  );
}

function FreeAgentForm({ event }: { event: Event }) {
  const { mutate, isPending } = useRegisterForEvent();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();

  const experienceOptions = ['Novice', 'Intermediate', 'Advanced'];

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
    // TODO: I'd ideally like to get this from the type in events/v1.d.ts but I can't figure out how to get that to work
    experience: z
      .enum(experienceOptions, {
        error: 'Experience is required.',
      })
      .refine((val): val is components['schemas']['ExperienceLevel'] => true),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate({
      params: {
        path: {
          eventId: event.id,
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
              <div className="md:flex md:gap-4">
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
              <div className="md:flex md:gap-4">
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
              You have been successfully registered for {event.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate(`/events/${event.id}`)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
