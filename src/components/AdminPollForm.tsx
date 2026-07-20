import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreatePoll,
  useUpdatePoll,
  useUpdatePollDataAfterMutate,
} from '@/hooks/useVoting';
import type { Poll } from '@/hooks/useVoting';

const optionSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Option name is required').max(100),
  subtitle: z.string().max(100).optional().or(z.literal('')),
  imageUrl: z.string().max(500).optional().or(z.literal('')),
});

const groupSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, 'Group name is required').max(100),
  color: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/, 'Must be a hex color like #70b2e0')
    .optional()
    .or(z.literal('')),
  imageUrl: z.string().max(500).optional().or(z.literal('')),
  options: z.array(optionSchema).min(1, 'At least one option is required'),
});

const pollFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(255),
  description: z.string().max(1000).optional().or(z.literal('')),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  resultsVisibility: z.enum(['Live', 'AfterClose', 'AdminOnly']),
  publicResultsLevel: z
    .enum(['Full', 'Percentages', 'Rankings', 'None'])
    .optional(),
  maxSelections: z.coerce.number().int().min(1).default(1),
  maxSelectionsPerGroup: z.coerce
    .number()
    .int()
    .min(1)
    .optional()
    .or(z.literal(0)),
  groups: z.array(groupSchema).optional(),
  options: z.array(optionSchema).optional(),
});

type PollFormValues = z.infer<typeof pollFormSchema>;

function toDatetimeLocal(isoString: string): string {
  const d = new Date(isoString);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

function fromDatetimeLocal(local: string): string {
  return new Date(local).toISOString();
}

function pollToFormValues(poll: Poll): PollFormValues {
  return {
    name: poll.name,
    description: poll.description ?? '',
    startTime: toDatetimeLocal(poll.startTime),
    endTime: toDatetimeLocal(poll.endTime),
    resultsVisibility: poll.resultsVisibility,
    publicResultsLevel: poll.publicResultsLevel,
    maxSelections: poll.voteConfig?.maxSelections ?? 1,
    maxSelectionsPerGroup: poll.voteConfig?.maxSelectionsPerGroup ?? 0,
    groups: poll.groups?.map((g) => ({
      id: g.id,
      name: g.name,
      color: g.color ?? '',
      imageUrl: g.imageUrl ?? '',
      options: g.options.map((o) => ({
        id: o.id,
        name: o.name,
        subtitle: o.subtitle ?? '',
        imageUrl: o.imageUrl ?? '',
      })),
    })),
    options: poll.options?.map((o) => ({
      id: o.id,
      name: o.name,
      subtitle: o.subtitle ?? '',
      imageUrl: o.imageUrl ?? '',
    })),
  };
}

interface AdminPollFormProps {
  mode: 'create' | 'edit';
  poll?: Poll;
  onSuccess?: () => void;
}

function AdminPollForm({ mode, poll, onSuccess }: AdminPollFormProps) {
  const createMutation = useCreatePoll();
  const updateMutation = useUpdatePoll();
  const updatePollCache = useUpdatePollDataAfterMutate();

  const isPending = createMutation.isPending || updateMutation.isPending;

  const form = useForm<PollFormValues>({
    resolver: zodResolver(pollFormSchema),
    defaultValues: poll
      ? pollToFormValues(poll)
      : {
          name: '',
          description: '',
          startTime: '',
          endTime: '',
          resultsVisibility: 'AfterClose',
          publicResultsLevel: 'Full',
          maxSelections: 1,
          maxSelectionsPerGroup: 0,
          groups: [],
          options: [],
        },
  });

  const groupsArray = useFieldArray({ control: form.control, name: 'groups' });
  const optionsArray = useFieldArray({
    control: form.control,
    name: 'options',
  });

  function onSubmit(values: PollFormValues) {
    const body = {
      name: values.name,
      description: values.description || undefined,
      startTime: fromDatetimeLocal(values.startTime),
      endTime: fromDatetimeLocal(values.endTime),
      resultsVisibility: values.resultsVisibility,
      publicResultsLevel: values.publicResultsLevel || undefined,
      voteConfig: {
        maxSelections: values.maxSelections,
        maxSelectionsPerGroup: values.maxSelectionsPerGroup || undefined,
      },
      groups: values.groups?.map((g) => ({
        id: g.id || undefined,
        name: g.name,
        color: g.color || undefined,
        imageUrl: g.imageUrl || undefined,
        options: g.options.map((o) => ({
          id: o.id || undefined,
          name: o.name,
          subtitle: o.subtitle || undefined,
          imageUrl: o.imageUrl || undefined,
        })),
      })),
      options: values.options?.map((o) => ({
        id: o.id || undefined,
        name: o.name,
        subtitle: o.subtitle || undefined,
        imageUrl: o.imageUrl || undefined,
      })),
    };

    if (mode === 'create') {
      createMutation.mutate(
        { body: body as Poll },
        {
          onSuccess: (created) => {
            updatePollCache(created);
            onSuccess?.();
          },
        },
      );
    } else if (poll) {
      updateMutation.mutate(
        {
          params: { path: { id: poll.id } },
          body: { ...body, id: poll.id, version: poll.version } as Poll,
        },
        {
          onSuccess: (updated) => {
            updatePollCache(updated.poll);
            onSuccess?.();
          },
        },
      );
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Poll Name</FormLabel>
              <FormControl>
                <Input
                  className="bg-background"
                  placeholder="Eastern Finals MVP"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  className="bg-background"
                  placeholder="Vote for the Most Valuable Player..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="startTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Time</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    type="datetime-local"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    type="datetime-local"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="resultsVisibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Results Visibility</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select visibility" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Live">Live</SelectItem>
                    <SelectItem value="AfterClose">After Close</SelectItem>
                    <SelectItem value="AdminOnly">Admin Only</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publicResultsLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Public Results Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Full">Full</SelectItem>
                    <SelectItem value="Percentages">Percentages</SelectItem>
                    <SelectItem value="Rankings">Rankings</SelectItem>
                    <SelectItem value="None">None</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="maxSelections"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Selections</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    type="number"
                    min={1}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="maxSelectionsPerGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Per Group (0 for no limit)</FormLabel>
                <FormControl>
                  <Input
                    className="bg-background"
                    type="number"
                    min={0}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Groups & Options</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                groupsArray.append({
                  name: '',
                  color: '',
                  imageUrl: '',
                  options: [{ name: '', subtitle: '', imageUrl: '' }],
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Group
            </Button>
          </div>

          {groupsArray.fields.map((group, groupIdx) => (
            <div key={group.id} className="space-y-3 rounded-md border p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Group {groupIdx + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => groupsArray.remove(groupIdx)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <FormField
                control={form.control}
                name={`groups.${groupIdx}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-background"
                        placeholder="Team Boston"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name={`groups.${groupIdx}.color`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background"
                          placeholder="#70b2e0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`groups.${groupIdx}.imageUrl`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo URL</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background"
                          placeholder="https://..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <OptionsSubForm
                form={form}
                groupIdx={groupIdx}
                parentName="groups"
              />
            </div>
          ))}
        </div>

        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Ungrouped Options</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                optionsArray.append({
                  name: '',
                  subtitle: '',
                  imageUrl: '',
                })
              }
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Option
            </Button>
          </div>

          {optionsArray.fields.map((option, optIdx) => (
            <div key={option.id} className="space-y-2 rounded-md border p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Option {optIdx + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => optionsArray.remove(optIdx)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>

              <FormField
                control={form.control}
                name={`options.${optIdx}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-background"
                        placeholder="Cameron Cardwell"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name={`options.${optIdx}.subtitle`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtitle</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background"
                          placeholder="#17"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`options.${optIdx}.imageUrl`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL</FormLabel>
                      <FormControl>
                        <Input
                          className="bg-background"
                          placeholder="https://..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          ))}
        </div>

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending
            ? 'Saving...'
            : mode === 'create'
              ? 'Create Poll'
              : 'Update Poll'}
        </Button>
      </form>
    </Form>
  );
}

function OptionsSubForm({
  form,
  groupIdx,
  parentName,
}: {
  form: ReturnType<typeof useForm<PollFormValues>>;
  groupIdx: number;
  parentName: string;
}) {
  const optionsArray = useFieldArray({
    control: form.control,
    name: `${parentName}.${groupIdx}.options` as 'groups.0.options',
  });

  return (
    <div className="space-y-2 pl-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Options
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            optionsArray.append({ name: '', subtitle: '', imageUrl: '' })
          }
        >
          <Plus className="mr-1 h-3 w-3" />
          Add Option
        </Button>
      </div>
      {optionsArray.fields.map((option, optIdx) => (
        <div key={option.id} className="space-y-2 rounded border p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">#{optIdx + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => optionsArray.remove(optIdx)}
            >
              <Trash2 className="h-3 w-3 text-destructive" />
            </Button>
          </div>
          <FormField
            control={form.control}
            name={
              `${parentName}.${groupIdx}.options.${optIdx}.name` as 'groups.0.options.0.name'
            }
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Player name"
                    className="h-8 text-sm bg-background"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-1">
            <FormField
              control={form.control}
              name={
                `${parentName}.${groupIdx}.options.${optIdx}.subtitle` as 'groups.0.options.0.subtitle'
              }
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="#17"
                      className="h-8 text-sm bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={
                `${parentName}.${groupIdx}.options.${optIdx}.imageUrl` as 'groups.0.options.0.imageUrl'
              }
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Image URL"
                      className="h-8 text-sm bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export { AdminPollForm };
export type { PollFormValues };
