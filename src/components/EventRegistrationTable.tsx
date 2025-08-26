import * as React from 'react';
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

interface EventRegistrationTableProps {
  registrations: Registration[];
}

const EventRegistrationTable: React.FC<EventRegistrationTableProps> = ({
  registrations,
}) => {
  const [editingRowId, setEditingRowId] = React.useState<string | null>(null);
  const [editedRegistration, setEditedRegistration] =
    React.useState<Registration | null>(null);

  const handleEditClick = (registration: Registration) => {
    setEditingRowId(registration.id);
    setEditedRegistration({ ...registration });
  };

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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Registration Type</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Home City</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Paid</TableHead>
          <TableHead>Experience / Roster</TableHead>
          <TableHead>
            <span className="sr-only">Edit</span>
          </TableHead>
          <TableHead>
            <span className="sr-only">Delete</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {registrations.map((registration) => {
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
                            Are you sure you would like to submit these changes?
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
                  <TableCell>{registration.registrationType}</TableCell>
                  <TableCell>{registration.name}</TableCell>
                  <TableCell>{registration.homeCity}</TableCell>
                  <TableCell>{registration.email}</TableCell>
                  <TableCell>{registration.paid ? 'Paid' : 'Unpaid'}</TableCell>
                  <TableCell>
                    {registration.registrationType === 'Free Agent' ? (
                      <span>{registration.experience ?? 'N/A'}</span>
                    ) : registration.registrationType === 'Team' &&
                      registration.roster &&
                      registration.roster.length > 0 ? (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">View Roster</Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-4">
                          <div className="grid gap-2">
                            <p className="text-sm font-bold text-muted-foreground">
                              {registration.name} Roster
                            </p>
                            <ul className="grid gap-1 text-sm list-inside">
                              {registration.roster.map((player, index) => (
                                <li key={`${registration.id}-player-${index}`}>
                                  {player}
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
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(registration)}
                    >
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
  );
};

export default EventRegistrationTable;
