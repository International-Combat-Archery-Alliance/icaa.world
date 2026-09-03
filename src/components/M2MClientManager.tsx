import { useState } from 'react';
import {
  useForm,
  useFieldArray,
  type Control,
  type FieldValues,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Check, Copy, Pencil, Plus, RefreshCw, Trash2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useCreateM2MClient,
  useGetM2MClients,
  useInvalidateM2MClients,
  useRevokeM2MClient,
  useRotateM2MClient,
  useUpdateM2MClient,
  type M2MClient,
  type M2MClientCredentials,
} from '@/hooks/useM2MClients';

const clientIdPattern = /^[a-z0-9-]{1,64}$/;
const audiencePattern = /^[a-z0-9-]{1,64}$/;
const scopePattern = /^m2m:[a-z0-9-]+$/;

const audienceEntrySchema = z.object({
  audience: z
    .string()
    .regex(audiencePattern, 'Lowercase letters, digits, and dashes only'),
  scopes: z.string(),
});

const audiencesSchema = z
  .array(audienceEntrySchema)
  .refine(
    (rows) =>
      new Set(rows.map((row) => row.audience.trim())).size === rows.length,
    'Duplicate audiences are not allowed',
  );

const clientFormSchema = z.object({
  clientId: z
    .string()
    .regex(clientIdPattern, 'Lowercase letters, digits, and dashes only'),
  audiences: audiencesSchema,
});

type ClientFormValues = z.infer<typeof clientFormSchema>;
type AudiencesFormValues = z.infer<typeof audiencesSchema>;
type AudienceEntry = z.infer<typeof audienceEntrySchema>;

function parseScopes(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

function entriesToRecord(entries: AudienceEntry[]): Record<string, string[]> {
  const record: Record<string, string[]> = {};
  for (const entry of entries) {
    record[entry.audience.trim()] = parseScopes(entry.scopes);
  }
  return record;
}

function recordToEntries(
  record: Record<string, string[]> | undefined,
): AudienceEntry[] {
  if (!record) return [];
  return Object.entries(record).map(([audience, scopes]) => ({
    audience,
    scopes: scopes.join(', '),
  }));
}

function validateScopesText(value: string): boolean {
  return parseScopes(value).every((part) => scopePattern.test(part));
}

function serverMessage(err: unknown, fallback: string): string {
  if (
    err &&
    typeof err === 'object' &&
    'message' in err &&
    typeof (err as { message: unknown }).message === 'string'
  ) {
    return (err as { message: string }).message;
  }
  return err instanceof Error ? err.message : fallback;
}

function AudienceRows<T extends FieldValues>({
  control,
}: {
  control: Control<T>;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'audiences' as never,
  });

  return (
    <div className="grid gap-3">
      {fields.map((field, index) => (
        <div key={field.id} className="flex items-start gap-2">
          <FormField
            control={control}
            name={`audiences.${index}.audience` as never}
            render={({ field: inputField }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    placeholder="profiles-api"
                    autoComplete="off"
                    {...inputField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`audiences.${index}.scopes` as never}
            render={({ field: inputField }) => (
              <FormItem className="flex-[2]">
                <FormControl>
                  <Input
                    placeholder="m2m:player-profiles"
                    autoComplete="off"
                    {...inputField}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => remove(index)}
            title="Remove audience"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ audience: '', scopes: '' } as never)}
        >
          <Plus className="h-4 w-4" />
          <span className="ml-1">Add audience</span>
        </Button>
      </div>
    </div>
  );
}

function M2MClientManager() {
  const { data, isLoading, isError, refetch } = useGetM2MClients();
  const invalidateM2MClients = useInvalidateM2MClients();
  const createMutation = useCreateM2MClient();
  const rotateMutation = useRotateM2MClient();
  const revokeMutation = useRevokeM2MClient();
  const updateMutation = useUpdateM2MClient();

  const [revealed, setRevealed] = useState<M2MClientCredentials | null>(null);
  const [copied, setCopied] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<M2MClient | null>(null);
  const [editingClient, setEditingClient] = useState<M2MClient | null>(null);
  const [actingClientId, setActingClientId] = useState<string | null>(null);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: { clientId: '', audiences: [] },
  });

  const editForm = useForm<AudiencesFormValues>({
    resolver: zodResolver(audiencesSchema),
    values: recordToEntries(editingClient?.audiences),
  });

  const clients = data?.clients ?? [];

  function onCreate(values: ClientFormValues) {
    for (const entry of values.audiences) {
      if (!validateScopesText(entry.scopes)) {
        form.setError('audiences', {
          message:
            'Scopes must look like m2m:player-profiles (comma-separated)',
        });
        return;
      }
    }
    createMutation.mutate(
      {
        body: {
          clientId: values.clientId,
          audiences: entriesToRecord(values.audiences),
        },
      },
      {
        onSuccess: (credentials) => {
          form.reset();
          setCopied(false);
          setRevealed(credentials);
          invalidateM2MClients();
          toast.success(`Client "${credentials.clientId}" created`);
        },
        onError: (err) => {
          toast.error(serverMessage(err, 'Failed to create client'));
        },
      },
    );
  }

  function onRotate(clientId: string) {
    setActingClientId(clientId);
    rotateMutation.mutate(
      { params: { path: { clientId } } },
      {
        onSuccess: (credentials) => {
          setCopied(false);
          setRevealed(credentials);
          invalidateM2MClients();
          toast.success(`New secret issued for "${clientId}"`);
        },
        onError: (err) => {
          toast.error(serverMessage(err, 'Failed to rotate secret'));
        },
        onSettled: () => {
          setActingClientId(null);
        },
      },
    );
  }

  function onConfirmRevoke() {
    if (!revokeTarget) return;
    const clientId = revokeTarget.clientId;
    setActingClientId(clientId);
    revokeMutation.mutate(
      { params: { path: { clientId } } },
      {
        onSuccess: () => {
          invalidateM2MClients();
          toast.success(`Client "${clientId}" revoked`);
        },
        onError: (err) => {
          toast.error(serverMessage(err, 'Failed to revoke client'));
        },
        onSettled: () => {
          setActingClientId(null);
          setRevokeTarget(null);
        },
      },
    );
  }

  function onSaveAudiences(values: AudiencesFormValues) {
    if (!editingClient) return;
    for (const entry of values) {
      if (!validateScopesText(entry.scopes)) {
        toast.error(
          'Scopes must look like m2m:player-profiles (comma-separated)',
        );
        return;
      }
    }
    const clientId = editingClient.clientId;
    updateMutation.mutate(
      {
        params: { path: { clientId } },
        body: { audiences: entriesToRecord(values) },
      },
      {
        onSuccess: () => {
          setEditingClient(null);
          invalidateM2MClients();
          toast.success(`Audiences updated for "${clientId}"`);
        },
        onError: (err) => {
          toast.error(serverMessage(err, 'Failed to update audiences'));
        },
      },
    );
  }

  function handleCopySecret() {
    if (!revealed) return;
    void navigator.clipboard.writeText(revealed.clientSecret).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const busy = createMutation.isPending || actingClientId !== null;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Client</CardTitle>
          <CardDescription>
            Provisions a machine identity (no audiences yet is fine — grant them
            now or later via Edit). The secret is shown exactly once — copy it
            immediately, then deliver it to the caller yourself.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onCreate)} className="grid gap-4">
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="event-registration"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Lowercase letters, digits, and dashes (max 64 chars).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid gap-2">
                <FormLabel>Audiences</FormLabel>
                <FormDescription>
                  One row per downstream service; scopes are comma-separated
                  (blank scopes authorize nowhere).
                </FormDescription>
                <AudienceRows control={form.control} />
                {form.formState.errors.audiences?.message && (
                  <p className="text-destructive text-sm">
                    {String(form.formState.errors.audiences.message)}
                  </p>
                )}
              </div>
              <div>
                <Button type="submit" disabled={busy}>
                  {createMutation.isPending ? 'Creating…' : 'Create client'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clients</CardTitle>
          <CardDescription>
            Edit replaces the whole audiences map. Rotate issues a new secret
            (the previous one keeps working until you deliver the new secret and
            recycle callers). Revoking is immediate for new tokens — remove the
            caller's copy of the secret and recycle callers afterwards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && <Skeleton className="h-32 w-full" />}
          {isError && (
            <div className="flex items-center gap-4">
              <p className="text-muted-foreground text-sm">
                Failed to load clients.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void refetch()}
              >
                Retry
              </Button>
            </div>
          )}
          {!isLoading && !isError && clients.length === 0 && (
            <p className="text-muted-foreground text-center text-sm">
              No machine clients yet. Create one above to get started.
            </p>
          )}
          {!isLoading && !isError && clients.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Audiences</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.clientId}>
                    <TableCell className="font-mono text-sm">
                      {client.clientId}
                    </TableCell>
                    <TableCell>
                      {Object.keys(client.audiences ?? {}).length === 0 ? (
                        <span className="text-muted-foreground text-sm">—</span>
                      ) : (
                        <div className="grid gap-1">
                          {Object.entries(client.audiences ?? {}).map(
                            ([audience, scopes]) => (
                              <div
                                key={audience}
                                className="flex flex-wrap items-center gap-1"
                              >
                                <span className="font-mono text-sm">
                                  {audience}
                                </span>
                                {scopes.map((scope) => (
                                  <Badge key={scope} variant="secondary">
                                    {scope}
                                  </Badge>
                                ))}
                              </div>
                            ),
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={client.active ? 'default' : 'outline'}>
                        {client.active ? 'Active' : 'Revoked'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busy}
                          onClick={() => setEditingClient(client)}
                          title="Edit audiences"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="ml-1 hidden lg:inline">Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={busy || !client.active}
                          onClick={() => onRotate(client.clientId)}
                          title="Issue a new secret (old one keeps working until you deliver the new secret)"
                        >
                          <RefreshCw className="h-4 w-4" />
                          <span className="ml-1 hidden lg:inline">
                            {actingClientId === client.clientId
                              ? 'Rotating…'
                              : 'Rotate'}
                          </span>
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={busy || !client.active}
                          onClick={() => setRevokeTarget(client)}
                          title="Revoke this client"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-1 hidden lg:inline">Revoke</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={editingClient !== null}
        onOpenChange={(open) => {
          if (!open) setEditingClient(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Audiences for {editingClient?.clientId}</DialogTitle>
            <DialogDescription>
              Replaces the whole map — entries you remove lose access. Secrets
              are untouched.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form
              onSubmit={editForm.handleSubmit(onSaveAudiences)}
              className="grid gap-4"
            >
              <AudienceRows control={editForm.control} />
              {typeof editForm.formState.errors.audiences?.message ===
                'string' && (
                <p className="text-destructive text-sm">
                  {editForm.formState.errors.audiences.message}
                </p>
              )}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingClient(null)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? 'Saving…' : 'Save'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={revealed !== null}
        onOpenChange={(open) => {
          if (!open) setRevealed(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Secret for {revealed?.clientId}</DialogTitle>
            <DialogDescription>
              Copy it now — it is shown exactly once and can never be retrieved
              again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input readOnly value={revealed?.clientSecret ?? ''} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopySecret}
              title="Copy secret to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setRevealed(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={revokeTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRevokeTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Revoke {revokeTarget?.clientId}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              New tokens stop immediately, but callers cache the secret at
              startup — remove the caller's copy of the secret, then roll or
              recycle them. Revocation is permanent via this API.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirmRevoke}>
              Revoke
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export { M2MClientManager };
