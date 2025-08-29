import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCreateEvent } from '@/hooks/useEvent';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/DatePicker';
import { Button, buttonVariants } from '@/components/ui/button';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import EventRegistrationTable, {
  type Registration,
} from '@/components/EventRegistrationTable';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { components } from '@/api/events-v1';

const mockRegistrations: Registration[] = [
  {
    id: 'reg001',
    eventName: 'Summer Showdown 2024',
    registrationType: 'Free Agent',
    name: 'John Doe',
    homeCity: 'New York',
    email: 'john.doe@example.com',
    paid: true,
    experience: 'Beginner',
  },
  {
    id: 'reg002',
    eventName: 'Summer Showdown 2024',
    registrationType: 'Team',
    name: 'Team Fireball',
    homeCity: 'Los Angeles',
    email: 'jane.smith@example.com',
    paid: true,
    roster: ['Cam', 'Andrew', 'Peter', 'John', 'Bob', 'Joe'],
  },
  {
    id: 'reg003',
    eventName: 'Winter Classic 2025',
    registrationType: 'Free Agent',
    name: 'Peter Jones',
    homeCity: 'Chicago',
    email: 'peter.jones@example.com',
    paid: false,
    experience: 'Intermediate',
  },
];

export function AdminPage() {
  return (
    <section id="admin" className="admin-section">
      <Tabs
        defaultValue="create-event"
        className="w-full max-w-screen-lg mx-auto p-15"
      >
        <TabsList>
          <TabsTrigger value="create-event" className="text-xl text-primary">
            Create Event
          </TabsTrigger>
          <TabsTrigger value="edit-event" className="text-xl text-primary">
            Edit Event
          </TabsTrigger>
          <TabsTrigger
            value="view-registration"
            className="text-xl text-primary"
          >
            View Registration
          </TabsTrigger>
        </TabsList>
        <TabsContent value="create-event">
          <CreateEventForm />
        </TabsContent>
        <TabsContent value="edit-event">
          <Card>
            <CardHeader>
              <CardTitle>Edit Event</CardTitle>
              <CardDescription> Select the event to edit</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="flex gap-3">
                <SelectEvent />
                <Button id="load-event_info" className="max-w-24" type="submit">
                  Load Event
                </Button>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="event-date">Event Date</Label>
                <DatePicker></DatePicker>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="event-start">Event Start/Stop Time</Label>
                <div className="flex gap-3">
                  <Input
                    id="event-start"
                    placeholder={'Start Time'}
                    type="text"
                    className="bg-white max-w-50"
                  />
                  <Input
                    id="event-stop"
                    placeholder={'Stop Time'}
                    type="text"
                    className="bg-white max-w-50"
                  />
                </div>
              </div>

              <div className="grid gap-3">
                <Label htmlFor="event-address">Event Address</Label>
                <div className="flex gap-3">
                  <Input
                    id="event-address"
                    placeholder={'Street Address'}
                    type="text"
                    className="bg-white max-w-sm"
                  />
                  <Input
                    id="event-city"
                    placeholder={'City'}
                    type="text"
                    className="bg-white max-w-45"
                  />
                </div>
                <div className="flex gap-3">
                  <Input
                    id="event-state"
                    placeholder={'State/Province'}
                    type="text"
                    className="bg-white max-w-47"
                  />
                  <Input
                    id="event-country"
                    placeholder={'Country'}
                    type="text"
                    className="bg-white max-w-46"
                  />
                  <Input
                    id="event-zip"
                    placeholder={'Zip Code'}
                    type="text"
                    className="bg-white max-w-45"
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="free-agent-price">Event Prices</Label>
                <div className="flex gap-3">
                  <Input
                    id="free-agent-price"
                    placeholder={'Free Agent Price'}
                    type="text"
                    className="bg-white max-w-40"
                  />
                  <Input
                    id="team-price"
                    placeholder={'Team Price'}
                    type="text"
                    className="bg-white max-w-40"
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="team-min">Team Sizes</Label>
                <div className="flex gap-3">
                  <Input
                    id="team-min"
                    placeholder={'Min Team Size'}
                    type="text"
                    className="bg-white max-w-30"
                  />
                  <Input
                    id="team-max"
                    placeholder={'Max Team Size'}
                    type="text"
                    className="bg-white max-w-30"
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="event-rules">Event Rules</Label>
                <Input
                  id="event-rules"
                  placeholder={'Document Link'}
                  type="text"
                  className="bg-white max-w-xl"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="event-image">Event Logo</Label>
                <Input
                  id="event-image"
                  type="file"
                  className="bg-white max-w-xl"
                />
              </div>
              <div className="flex gap-6">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button id="edit-event" type="button">
                      Edit Event
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you would like to edit this event?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Edit Event</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      id="delete-event"
                      variant={'destructive'}
                      type="button"
                    >
                      Delete Event
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you would like to delete this event? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className={buttonVariants({ variant: 'destructive' })}
                      >
                        Delete Event
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="view-registration">
          <Card>
            <CardHeader>
              <CardTitle>View Registration Info</CardTitle>
              <CardDescription>
                {' '}
                Select an event to view the registration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="flex gap-3">
                  <SelectEvent />
                  <Button
                    id="load-event_info"
                    className="max-w-24"
                    type="submit"
                  >
                    Load Event
                  </Button>
                </div>
                <EventRegistrationTable registrations={mockRegistrations} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function CreateEventForm() {
  const { mutate, isPending } = useCreateEvent();
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const formSchema = z.object({
    teamSizes: z.object({
      max: z.number().int().min(1, 'Max team size must be at least 1.'),
      min: z.number().int().min(1, 'Min team size must be at least 1.'),
    }),
    locationInfo: z.object({
      address: z.object({
        city: z.string().min(1, 'Event city is required.'),
        country: z.string().min(1, 'Event country is required.'),
        postalCode: z.string().min(1, 'Event zip is required.'),
        state: z.string().min(1, 'Event state is required.'),
        street: z.string().min(1, 'Event Street is required.'),
      }),
      name: z.string().min(1, 'Event name is required.'),
    }),
    eventName: z.string().min(1, 'Event name is required.'),
    regCloseDate: z.string().min(1, 'Registration close date is required.'),
    regCloseTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Please use HH:MM format',
    }),
    priceInfo: z
      .object({
        freeAgentPrice: z
          .number()
          .min(0, 'Price cannot be negative.')
          .optional(),
        teamPrice: z.number().min(0, 'Price cannot be negative.').optional(),
        currency: z.string().min(1, 'Currency is required.'),
      })
      .refine(
        (data) =>
          data.freeAgentPrice !== undefined || data.teamPrice !== undefined,
        {
          message: 'At least one price (Free Agent or Team) is required.',
          path: ['freeAgentPrice'], // Display error on the first price field
        },
      ),

    eventDate: z.string().min(1, 'Event date is required.'),
    eventStartTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Please use HH:MM format',
    }),
    eventEndTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Please use HH:MM format',
    }),

    eventRules: z.string().optional(),
    eventLogo: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const eventName = form.watch('eventName');

  const onFormError = (errors: any) => {
    console.error('Form validation failed:', errors);
    alert('Please check the form for errors. More details in the console.');
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const {
      eventDate,
      eventStartTime,
      eventEndTime,
      regCloseDate,
      regCloseTime,
    } = values;
    const startTime = new Date(`${eventDate}T${eventStartTime}`).toISOString();
    const endTime = new Date(`${eventDate}T${eventEndTime}`).toISOString();
    const closeTime = new Date(`${regCloseDate}T${regCloseTime}`).toISOString();

    const registrationOptions: components['schemas']['EventRegistrationOption'][] =
      [];

    if (values.priceInfo.freeAgentPrice !== undefined) {
      registrationOptions.push({
        registrationType: 'ByIndividual',
        price: {
          currency: values.priceInfo.currency,
          amount: values.priceInfo.freeAgentPrice * 100,
        },
      });
    }

    if (values.priceInfo.teamPrice !== undefined) {
      registrationOptions.push({
        registrationType: 'ByTeam',
        price: {
          currency: values.priceInfo.currency,
          amount: values.priceInfo.teamPrice * 100,
        },
      });
    }

    mutate(
      {
        credentials: 'include',
        body: {
          allowedTeamSizeRange: values.teamSizes,
          endTime: endTime,
          imageName: values.eventLogo,
          location: values.locationInfo,
          name: values.eventName,
          registrationCloseTime: closeTime,
          registrationOptions: registrationOptions,
          rulesDocLink: values.eventRules,
          startTime: startTime,
        } as components['schemas']['Event'],
      },
      {
        onSuccess: () => {
          setShowSuccessDialog(true);
          form.reset();
        },
        onError: (error) => {
          console.error('Event creation failed:', error);
          alert(`Error: ${error.message}`);
        },
      },
    );
  };
  return (
    <>
      <Card className="w-full max-w-screen-lg mx-auto p-15">
        <CardHeader>
          <CardTitle className="text-center font-bold text-2xl">
            Create Event
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onFormError)}
              className="flex flex-col gap-8 w-full"
            >
              <FormField
                control={form.control}
                name="eventName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Date</FormLabel>
                    <FormControl>
                      <Input {...field} type="date" className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:flex md:gap-4">
                <FormField
                  control={form.control}
                  name="regCloseDate"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Registration Close Date</FormLabel>
                      <FormControl>
                        <Input {...field} type="date" className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="regCloseTime"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Registration Close Time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="HH:MM"
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="md:flex md:gap-4">
                <FormField
                  control={form.control}
                  name="eventStartTime"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Event Start Time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="HH:MM"
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="eventEndTime"
                  render={({ field }) => (
                    <FormItem className="flex-grow">
                      <FormLabel>Event End Time</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="HH:MM"
                          className="bg-white"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-3">
                <FormField
                  control={form.control}
                  name="locationInfo.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location Name (Venue)</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="locationInfo.address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="locationInfo.address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex gap-3">
                  <FormField
                    control={form.control}
                    name="locationInfo.address.state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State/Prov</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="locationInfo.address.country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} type="text" className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="locationInfo.address.postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Zip Code</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="priceInfo.freeAgentPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Free Agent Price</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="bg-white"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ''
                                ? undefined
                                : +e.target.value,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceInfo.teamPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team Price</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="bg-white"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ''
                                ? undefined
                                : +e.target.value,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="priceInfo.currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-3">
                <FormField
                  control={form.control}
                  name="teamSizes.min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Min Team Size</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="bg-white"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ''
                                ? undefined
                                : +e.target.value,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="teamSizes.max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Max Team Size</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          className="bg-white"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ''
                                ? undefined
                                : +e.target.value,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="eventRules"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Rules (link)</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Logo Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              {eventName} has been created
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function SelectEvent() {
  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an Event" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="event-1">Event 1</SelectItem>
          <SelectItem value="event-2">Event 2</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default AdminPage;
