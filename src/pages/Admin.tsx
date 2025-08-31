import { useState } from 'react';
import { useTitle } from 'react-use';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useGetEvent,
  useGetEvents,
  useUpdateEventDataAfterMutate,
} from '@/hooks/useEvent';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import EventRegistrationTable from '@/components/EventRegistrationTable';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminEventForm, AdminEventMode } from '@/components/AdminEventForm';

export function AdminPage() {
  useTitle('Admin Panel - ICAA');

  const [eventId, setEventId] = useState<string | undefined>(undefined);

  return (
    <section id="admin" className="admin-section">
      <Tabs
        defaultValue="create-event"
        className="w-full max-w-screen-lg mx-auto p-6 lg:p-15"
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
          <UpdateEventForm />
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
                <SelectEvent setEventId={setEventId} />

                <SignUpInfoCards eventId={eventId} />
                <EventRegistrationTable eventId={eventId} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function CreateEventForm() {
  const [successDialogEventName, setSuccessDialogEventName] = useState('');

  return (
    <>
      <Card className="w-full max-w-screen-lg mx-auto p-15">
        <CardHeader>
          <CardTitle className="text-center font-bold text-2xl">
            Create Event
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-6">
          <AdminEventForm
            onSuccess={(v) => setSuccessDialogEventName(v.name)}
            mode={AdminEventMode.CREATE}
          />
        </CardContent>
      </Card>
      <AlertDialog
        open={successDialogEventName !== ''}
        onOpenChange={(open) => {
          if (!open) setSuccessDialogEventName('');
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Event Creation Successful!</AlertDialogTitle>
            <AlertDialogDescription>
              {successDialogEventName} has been created
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

function UpdateEventForm() {
  const [eventId, setEventId] = useState<string | undefined>(undefined);
  const [successDialogEventName, setSuccessDialogEventName] = useState('');

  const { data } = useGetEvent(eventId);

  const updateEventCache = useUpdateEventDataAfterMutate();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Event</CardTitle>
        <CardDescription> Select the event to edit</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <SelectEvent setEventId={setEventId} />
        <AdminEventForm
          mode={AdminEventMode.EDIT}
          onSuccess={(v) => {
            updateEventCache(v);
            setSuccessDialogEventName(v.name);
          }}
          editData={data?.event}
        />
        <AlertDialog
          open={successDialogEventName !== ''}
          onOpenChange={(open) => {
            if (!open) setSuccessDialogEventName('');
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Event Update Successful!</AlertDialogTitle>
              <AlertDialogDescription>
                {successDialogEventName} has been updated
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}

function SelectEvent({ setEventId }: { setEventId: (v: string) => void }) {
  // TODO: need to handle pagination
  const { data: events } = useGetEvents();

  return (
    <Select onValueChange={(v) => setEventId(v)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an Event" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {events?.pages[0].data.map((v) => (
            <SelectItem key={v.id} value={v.id}>
              {v.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function SignUpInfoCards({ eventId }: { eventId: string | undefined }) {
  const { data, isLoading } = useGetEvent(eventId);
  const event = data?.event;

  if (isLoading) {
    return (
      <div className="grid gap-2 grid-flow-col">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>
                <Skeleton className="w-full h-4" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="w-1/4 h-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (event === undefined) {
    return null;
  }

  return (
    <div className="grid gap-2 grid-flow-row md:grid-flow-col">
      <Card>
        <CardHeader>
          <CardTitle>Total players</CardTitle>
        </CardHeader>
        <CardContent>{event.signUpStats.numTotalPlayers}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Teams signed up</CardTitle>
        </CardHeader>
        <CardContent>{event.signUpStats.numTeams}</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Free agents</CardTitle>
        </CardHeader>
        <CardContent>
          {event.signUpStats.numTotalPlayers -
            event.signUpStats.numRosteredPlayers}
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminPage;
