import { useGetEvent, useRegisterForEvent, type Event } from '@/hooks/useEvent';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useParams } from 'react-router-dom';
import type { components } from '@/events/v1';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';

export default function EventRegistrationFreeAgent() {
  const { eventId } = useParams();
  const { data } = useGetEvent(eventId!);

  return (
    <>
      <h2 className="section-title">Event Registration</h2>
      <div className="px-4 pb-4">
        {data ? <FreeAgentForm event={data.event} /> : null}
      </div>
    </>
  );
}

function FreeAgentForm({ event }: { event: Event }) {
  const { mutate } = useRegisterForEvent();

  const formSchema = z.object({
    email: z.email(),
    homeCity: z.string().min(3, {
      message: 'Home city must be at least 3 characters.',
    }),
    playerInfo: z.object({
      firstName: z
        .string()
        .min(1, {
          message: 'First name must be 1-50 characters',
        })
        .max(50, { message: 'First name must be 1-50 characters' }),
      lastName: z
        .string()
        .min(1, {
          message: 'Last name must be 1-50 characters',
        })
        .max(50, { message: 'Last name must be 1-50 characters' }),
    }),
    // TODO: I'd ideally like to get this from the type in events/v1.d.ts but I can't figure out how to get that to work
    experience: z.enum(['Novice', 'Intermediate', 'Advanced']),
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
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input {...field} />
              </FormControl>
              <FormDescription>Email to sign up with.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
