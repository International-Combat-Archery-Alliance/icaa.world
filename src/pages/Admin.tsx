import { useState } from 'react';
import { useTitle } from 'react-use';
import { useLocation, useNavigate } from 'react-router-dom';
import type { DateRange } from 'react-day-picker';
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
import { Button } from '@/components/ui/button';
import { AdminEventForm, AdminEventMode } from '@/components/AdminEventForm';
import { AssetBrowser } from '@/components/AssetBrowser';
import { DonationList } from '@/components/DonationList';
import { DonationByState } from '@/components/DonationByState';
import { ArticleEditor } from '@/components/ArticleEditor';
import { ArticleList } from '@/components/ArticleList';
import type { Article } from '@/hooks/useArticles';
import { DateRangePicker } from '@/components/DateRangePicker';
import { cn } from '@/lib/utils';
import {
  CalendarPlus,
  CalendarCog,
  Users,
  FolderOpen,
  Heart,
  FileText,
} from 'lucide-react';

const adminTabs = [
  { id: 'create-event', label: 'Create Event', icon: CalendarPlus },
  { id: 'edit-event', label: 'Edit Event', icon: CalendarCog },
  { id: 'view-registration', label: 'View Registration', icon: Users },
  { id: 'assets', label: 'Assets', icon: FolderOpen },
  { id: 'articles', label: 'Articles', icon: FileText },
  { id: 'donations', label: 'Donations', icon: Heart },
] as const;

type AdminTabId = (typeof adminTabs)[number]['id'];

export function AdminPage() {
  useTitle('Admin Panel - ICAA');
  const location = useLocation();
  const navigate = useNavigate();
  const [eventId, setEventId] = useState<string | undefined>(undefined);
  const [donationDateRange, setDonationDateRange] = useState<
    DateRange | undefined
  >(undefined);
  const [editingArticle, setEditingArticle] = useState<
    Article | undefined | null
  >(undefined);

  const hash = location.hash.replace('#', '') as AdminTabId;
  const activeTab = adminTabs.find((tab) => tab.id === hash)
    ? hash
    : 'create-event';

  const handleTabChange = (value: string) => {
    navigate(`/admin#${value}`, { replace: true });
  };

  return (
    <section id="admin" className="admin-section">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full max-w-screen-lg mx-auto p-4 md:p-6 lg:p-15"
      >
        <TabsList className="w-full h-auto flex flex-wrap justify-start gap-1 p-1 bg-muted/50 rounded-lg mb-6">
          {adminTabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={cn(
                'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all',
                'data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm',
                'data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=inactive]:hover:bg-muted',
                'md:px-4 md:py-2.5 md:text-base',
              )}
            >
              <tab.icon className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden text-xs">
                {tab.label.split(' ')[0]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
        <TabsContent value="create-event" className="mt-0">
          <CreateEventForm />
        </TabsContent>
        <TabsContent value="edit-event" className="mt-0">
          <UpdateEventForm />
        </TabsContent>
        <TabsContent value="view-registration" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>View Registration Info</CardTitle>
              <CardDescription>
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
        <TabsContent value="assets" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Asset Management</CardTitle>
              <CardDescription>
                Upload and manage files and folders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AssetBrowser />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="articles" className="mt-0">
          {editingArticle === undefined && (
            <ArticleList
              onEdit={(article: Article) => setEditingArticle(article)}
              onNew={() => setEditingArticle(null)}
            />
          )}
          {editingArticle !== undefined && (
            <Card key={editingArticle?.slug ?? 'new'}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>
                  {editingArticle
                    ? `Edit: ${editingArticle.title}`
                    : 'New Article'}
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingArticle(undefined)}
                >
                  Back to List
                </Button>
              </CardHeader>
              <CardContent>
                <ArticleEditor
                  article={editingArticle ?? undefined}
                  isNew={editingArticle === null}
                  onSaved={() => setEditingArticle(undefined)}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="donations" className="mt-0">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filter Donations</CardTitle>
                <CardDescription>
                  Select a date range to filter donations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DateRangePicker
                  dateRange={donationDateRange}
                  onDateRangeChange={setDonationDateRange}
                  placeholder="Filter by date range"
                />
              </CardContent>
            </Card>
            <DonationList dateRange={donationDateRange} />
            <DonationByState dateRange={donationDateRange} />
          </div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

function CreateEventForm() {
  const [successDialogEventName, setSuccessDialogEventName] = useState('');

  return (
    <>
      <Card className="w-full max-w-screen-lg mx-auto">
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
