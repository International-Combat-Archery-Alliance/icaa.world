import * as React from 'react';
import { useEffect, useRef } from 'react';
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
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetRegistrations } from '@/hooks/useEvent';
import { Download } from 'lucide-react';

export interface Registration {
  id: string;
  eventName: string;
  registrationType: 'Free Agent' | 'Team';
  name: string;
  homeCity: string;
  email: string;
  paid: boolean;
  experience?: string;
  roster?: string[];
}

const EventRegistrationTable = ({
  eventId,
}: {
  eventId: string | undefined;
}) => {
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [editedRegistration, setEditedRegistration] =
    React.useState<Registration | null>(null);

  /* const handleEditClick = (registration: Registration) => {
    setEditingRowId(registration.id);
    setEditedRegistration({ ...registration });
  }; */

  const handleCancelClick = () => {
    setEditingRowId(null);
    setEditedRegistration(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editedRegistration) return;
    const { name, value } = e.target;
    setEditedRegistration({ ...editedRegistration, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    if (!editedRegistration) return;
    setEditedRegistration({ ...editedRegistration, [name]: value });
  };

  const handlePaidChange = (value: string) => {
    if (!editedRegistration) return;
    setEditedRegistration({ ...editedRegistration, paid: value === 'true' });
  };

  const handleSubmit = () => {
    if (!editedRegistration) return;
    // In a real app, you'd call a prop to update the data source, e.g.:
    // onUpdateRegistration(editedRegistration);
    console.log('Submitting changes:', editedRegistration);
    setEditingRowId(null);
    setEditedRegistration(null);
  };

  const handleExportCSV = () => {
    if (!registrations || registrations.length === 0) return;

    const headers = [
      'Registration Type',
      'Name/Team Name',
      'Home City',
      'Email',
      'Paid',
      'Experience/Roster',
    ];

    const escape = (str: string | undefined | null) =>
      `"${(str || '').replace(/"/g, '""')}"`;

    const csvContent = [
      headers.join(','),
      ...registrations.map((reg) => {
        const type =
          reg.registrationType === 'ByIndividual' ? 'Free Agent' : 'Team';
        const name =
          reg.registrationType === 'ByIndividual'
            ? `${reg.playerInfo.firstName} ${reg.playerInfo.lastName}`
            : reg.teamName;
        const email =
          reg.registrationType === 'ByIndividual'
            ? reg.email
            : reg.captainEmail;
        const paid = reg.paid ? 'Yes' : 'No';

        let extra = '';
        if (reg.registrationType === 'ByIndividual') {
          extra = reg.experience || '';
        } else if (reg.registrationType === 'ByTeam' && reg.players) {
          extra = reg.players
            .map((p) => `${p.firstName} ${p.lastName}`)
            .join('; ');
        }

        return [escape(type), escape(name), escape(reg.homeCity), escape(email), escape(paid), escape(extra)].join(',');
      }),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `registrations-${eventId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetRegistrations(eventId);
  const registrations = data?.pages.flatMap((page) => page.data) ?? [];

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (!eventId) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Please select an event to view registrations
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button variant="outline" onClick={handleExportCSV}>
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Registration Type</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Home City</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Experience / Roster</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {registrations?.map((registration) => {
            const isEditing = editingRowId === registration.id;
            return (
              <TableRow key={registration.id}>
                {isEditing && editedRegistration ? (
                  <>
                    {/* Editable Row */}
                    <TableCell>
                      <Select
                        value={editedRegistration.registrationType}
                        onValueChange={(value) =>
                          handleSelectChange('registrationType', value)
                        }
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Free Agent">Free Agent</SelectItem>
                          <SelectItem value="Team">Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        name="name"
                        value={editedRegistration.name}
                        onChange={handleInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        name="homeCity"
                        value={editedRegistration.homeCity}
                        onChange={handleInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="email"
                        name="email"
                        value={editedRegistration.email}
                        onChange={handleInputChange}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={String(editedRegistration.paid)}
                        onValueChange={handlePaidChange}
                      >
                        <SelectTrigger className="w-[100px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Paid</SelectItem>
                          <SelectItem value="false">Unpaid</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {editedRegistration.registrationType === 'Free Agent' ? (
                        <Input
                          name="experience"
                          value={editedRegistration.experience ?? ''}
                          onChange={handleInputChange}
                          placeholder="Experience"
                        />
                      ) : (
                        <span>Roster not editable</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm">Submit</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you would like to submit these
                              changes?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmit}>
                              Submit
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </Button>
                    </TableCell>
                  </>
                ) : (
                  <>
                    {/* View Row */}
                    <TableCell>
                      {registration.registrationType === 'ByIndividual'
                        ? 'Free Agent'
                        : 'Team'}
                    </TableCell>
                    <TableCell>
                      {registration.registrationType === 'ByIndividual'
                        ? `${registration.playerInfo.firstName} ${registration.playerInfo.lastName}`
                        : registration.teamName}
                    </TableCell>
                    <TableCell>{registration.homeCity}</TableCell>
                    <TableCell>
                      {registration.registrationType === 'ByIndividual'
                        ? registration.email
                        : registration.captainEmail}
                    </TableCell>
                    <TableCell>
                      {registration.paid ? 'Paid' : 'Unpaid'}
                    </TableCell>
                    <TableCell>
                      {registration.registrationType === 'ByIndividual' ? (
                        <span>{registration.experience ?? 'N/A'}</span>
                      ) : registration.registrationType === 'ByTeam' &&
                        registration.players &&
                        registration.players.length > 0 ? (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline">View Roster</Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-4">
                            <div className="grid gap-2">
                              <p className="text-sm font-bold text-muted-foreground">
                                {registration.teamName} Roster
                              </p>
                              <ul className="grid gap-1 text-sm list-inside">
                                {registration.players.map((player, index) => (
                                  <li
                                    key={`${registration.id}-player-${index}`}
                                  >
                                    {player.firstName} {player.lastName}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </PopoverContent>
                        </Popover>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                    <TableCell>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you would like to delete this
                              registration? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className={buttonVariants({
                                variant: 'destructive',
                              })}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Loading trigger for intersection observer */}
      <div ref={loadMoreRef} className="h-4" />

      {/* Loading indicator */}
      {isFetchingNextPage && (
        <div className="text-center p-4">
          <span>Loading more registrations...</span>
        </div>
      )}

      {/* End of results indicator */}
      {!hasNextPage && registrations.length > 0 && (
        <div className="text-center p-4 text-muted-foreground">
          No more registrations to load
        </div>
      )}

      {/* Empty state */}
      {registrations.length === 0 && !isFetchingNextPage && (
        <div className="text-center p-4 text-muted-foreground">
          No registrations found for this event
        </div>
      )}
    </>
  );
};

export default EventRegistrationTable;
