import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Check, Copy, RefreshCw, Trash2 } from 'lucide-react';
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
  type M2MClient,
  type M2MClientCredentials,
} from '@/hooks/useM2MClients';

const clientIdPattern = /^[a-z0-9-]{1,64}$/;
const audiencePattern = /^[a-z0-9-]+-api$/;
const scopePattern = /^m2m:[a-z0-9-]+$/;

const clientFormSchema = z.object({
  clientId: z
    .string()
    .regex(clientIdPattern, 'Lowercase letters, digits, and dashes only'),
  audience: z
    .string()
    .regex(audiencePattern, 'Must look like <callee>-api (e.g. profiles-api)'),
  scopes: z
    .string()
    .min(1, 'At least one scope is required')
    .refine(
      (value) =>
        value
          .split(',')
          .map((part) => part.trim())
          .filter((part) => part.length > 0)
          .every((part) => scopePattern.test(part)),
      'Comma-separated scopes like m2m:player-profiles',
    ),
});

type ClientFormValues = z.infer<typeof clientFormSchema>;

function parseScopes(value: string): string[] {
  return value
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
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

function M2MClientManager() {
  const { data, isLoading, isError, refetch } = useGetM2MClients();
  const invalidateM2MClients = useInvalidateM2MClients();
  const createMutation = useCreateM2MClient();
  const rotateMutation = useRotateM2MClient();
  const revokeMutation = useRevokeM2MClient();

  const [revealed, setRevealed] = useState<M2MClientCredentials | null>(null);
  const [copied, setCopied] = useState(false);
  const [revokeTarget, setRevokeTarget] = useState<M2MClient | null>(null);
  const [actingClientId, setActingClientId] = useState<string | null>(null);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: { clientId: '', audience: '', scopes: '' },
  });

  const clients = data?.clients ?? [];

  function onCreate(values: ClientFormValues) {
    createMutation.mutate(
      {
        body: {
          clientId: values.clientId,
          audience: values.audience,
          scopes: parseScopes(values.scopes),
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
            Provisions a machine credential (bcrypt round + metadata). The
            secret is shown exactly once — copy it immediately, then deliver it
            to the caller yourself (e.g. its SSM param).
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
              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Audience</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="profiles-api"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The callee service audience, e.g. profiles-api.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="scopes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scopes</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="m2m:player-profiles"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Comma-separated for multiple scopes.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            Rotate issues a new secret (the previous one keeps working until
            callers recycle). Revoking is immediate for new tokens — roll or
            recycle callers afterwards since they cache the secret at startup.
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
                  <TableHead>Audience</TableHead>
                  <TableHead>Scopes</TableHead>
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
                    <TableCell className="font-mono text-sm">
                      {client.audience}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {client.scopes.map((scope) => (
                          <Badge key={scope} variant="secondary">
                            {scope}
                          </Badge>
                        ))}
                      </div>
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
                          disabled={busy || !client.active}
                          onClick={() => onRotate(client.clientId)}
                          title="Issue a new secret (old one keeps working until callers recycle)"
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
              startup — remove or replace the caller's copy of the secret, then
              roll or recycle them. Revocation is permanent via this API.
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
