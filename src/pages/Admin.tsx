import React from 'react';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const eventNames = React.useMemo(
    () => [...new Set(mockRegistrations.map((reg) => reg.eventName))],
    [],
  );

  {
    /* TODO:
    -Load Event Info when event selected/load button submitted in Edit Event and View Registration
    -Update Select Event info with list of events in DB 
    -Add a way to edit Registration Info*/
  }
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
          <Card>
            <CardHeader>
              <CardTitle>Create Event</CardTitle>
              <CardDescription>
                {' '}
                Enter the Events information to create an event
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="event-name">Event Name</Label>
                <Input
                  id="event-name"
                  type="text"
                  className="bg-white max-w-md"
                />
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button id="submit-event" type="button">
                    Create Event
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you would like to create this event?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Create Event</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
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
