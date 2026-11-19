import { useState } from 'react';
import { useFieldArray, useForm, useWatch } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import z from 'zod';
import { useCreateEvent, useUpdateEvent, type Event } from '@/hooks/useEvent';
import type { components } from '@/api/events-v1';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MutateOptions } from '@tanstack/react-query';
import { Currencies, Money } from 'ts-money';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from './ui/select';
import { DateTime, IANAZone } from 'luxon';
import { ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
import { AssetPickerModal } from './AssetPickerModal';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { buildEventMediaEmbedData } from '@/lib/embedUtils';
import {
  EVENT_MEDIA_DISPLAY_MODE_OPTIONS,
  EVENT_MEDIA_ICON_OPTIONS,
  EVENT_MEDIA_TYPE_OPTIONS,
  MAX_EVENT_MEDIA_ITEMS,
  createEventMediaItemSchema,
  findDuplicateMediaItemIds,
  isEventMediaUrl,
  supportsDisplayMode,
  toEventMediaFormItem,
  toEventMediaPayload,
  type EventMediaTypeValue,
} from '@/lib/eventMediaUtils';

export enum AdminEventMode {
  CREATE,
  EDIT,
}

const noop = () => {};

const eventMediaItemSchema = createEventMediaItemSchema({
  allowLoopbackHttp: import.meta.env.DEV,
});

export function AdminEventForm({
  onSuccess = noop,
  mode,
  editData,
}: {
  onSuccess?: (values: Event) => void;
  mode: AdminEventMode;
  editData?: Event;
}) {
  const { mutate: createMutate, isPending: createIsPending } = useCreateEvent();
  const { mutate: editMutate, isPending: editIsPending } = useUpdateEvent();

  const timeZones = Intl.supportedValuesOf('timeZone').map((t) => ({
    name: t,
    offset: IANAZone.create(t).formatOffset(
      DateTime.now().toSeconds(),
      'short',
    ),
  }));

  const isPending = createIsPending || editIsPending;

  const [logoPickerOpen, setLogoPickerOpen] = useState(false);
  const [rulesPickerOpen, setRulesPickerOpen] = useState(false);
  const [mediaPicker, setMediaPicker] = useState<{
    index: number;
    mode: 'folder' | 'allFiles';
  } | null>(null);

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
          .min(0, { message: 'Price cannot be negative.' })
          .optional(),
        teamPrice: z
          .number()
          .min(0, { message: 'Price cannot be negative.' })
          .optional(),
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
    eventTimeZone: z.string().min(1, 'Event time zone is required.'),

    eventRules: z.string().optional(),
    eventLogo: z.string().optional(),
    media: z
      .array(eventMediaItemSchema)
      .max(
        MAX_EVENT_MEDIA_ITEMS,
        `At most ${MAX_EVENT_MEDIA_ITEMS} media items.`,
      ),
    ...(mode === AdminEventMode.EDIT
      ? {
          id: z.uuid(),
        }
      : {}),
  });

  const form = useForm<
    z.infer<typeof formSchema>,
    undefined,
    z.infer<typeof formSchema>
  >({
    resolver: zodResolver(formSchema),
    defaultValues: {
      media: [],
    },
    values: editData && {
      id: editData?.id,
      eventDate: DateTime.fromISO(editData.startTime, {
        zone: editData.timeZone,
      }).toISODate()!,
      eventStartTime: DateTime.fromISO(editData.startTime, {
        zone: editData.timeZone,
      }).toFormat('HH:mm')!,
      eventEndTime: DateTime.fromISO(editData.endTime, {
        zone: editData.timeZone,
      }).toFormat('HH:mm')!,
      eventTimeZone: editData.timeZone,
      regCloseDate: DateTime.fromISO(editData.registrationCloseTime, {
        zone: editData.timeZone,
      }).toISODate()!,
      regCloseTime: DateTime.fromISO(editData.registrationCloseTime).toFormat(
        'HH:mm',
        { zone: editData.timeZone },
      )!,
      eventName: editData.name,
      locationInfo: editData.location,
      priceInfo: {
        currency: editData.registrationOptions[0].price.currency,
        freeAgentPrice: getMoneyAmount(
          editData.registrationOptions.find(
            (v) => v.registrationType === 'ByIndividual',
          )?.price,
        ),
        teamPrice: getMoneyAmount(
          editData.registrationOptions.find(
            (v) => v.registrationType === 'ByTeam',
          )?.price,
        ),
      },
      teamSizes: editData.allowedTeamSizeRange,
      eventLogo: editData.imageName,
      eventRules: editData.rulesDocLink,
      media: (editData.media ?? []).map(toEventMediaFormItem),
    },
  });

  const mediaFieldArray = useFieldArray({
    control: form.control,
    name: 'media',
    keyName: 'fieldKey',
  });

  const mediaValues = useWatch({ control: form.control, name: 'media' });
  const duplicateMediaIds = findDuplicateMediaItemIds(mediaValues);

  const handleMediaTypeChange = (index: number, type: EventMediaTypeValue) => {
    const current = form.getValues(`media.${index}`);

    form.setValue(`media.${index}.type`, type, { shouldDirty: true });

    if (!supportsDisplayMode(type, current.displayMode)) {
      form.setValue(`media.${index}.displayMode`, 'auto', {
        shouldDirty: true,
      });
    }

    const sourceKind = (mediaType: EventMediaTypeValue): string => {
      if (mediaType === 'asset_folder') return 'folder';
      // asset_file uses the read-only asset picker, so it must never inherit
      // arbitrary free-text URLs from video or external_link.
      if (mediaType === 'asset_file') return 'picker';
      return 'freeText';
    };

    if (sourceKind(type) !== sourceKind(current.type)) {
      form.setValue(`media.${index}.source`, '', { shouldDirty: true });
    }
  };

  const handleAddMediaItem = () => {
    mediaFieldArray.append({
      id: crypto.randomUUID(),
      type: 'asset_folder',
      source: '',
      title: '',
      description: '',
      displayMode: 'auto',
      icon: 'auto',
    });
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const {
      eventDate,
      eventStartTime,
      eventEndTime,
      regCloseDate,
      regCloseTime,
      eventTimeZone,
    } = values;
    const startTime = datetimeInputToISO(
      eventDate,
      eventStartTime,
      eventTimeZone,
    );
    const endTime = datetimeInputToISO(eventDate, eventEndTime, eventTimeZone);
    const closeTime = datetimeInputToISO(
      regCloseDate,
      regCloseTime,
      eventTimeZone,
    );

    const registrationOptions: components['schemas']['EventRegistrationOption'][] =
      [];

    if (values.priceInfo.freeAgentPrice !== undefined) {
      registrationOptions.push({
        registrationType: 'ByIndividual',
        price: {
          currency: values.priceInfo.currency,
          amount: getMinorUnitsFromMoney(
            values.priceInfo.freeAgentPrice,
            values.priceInfo.currency,
          ),
        },
      });
    }

    if (values.priceInfo.teamPrice !== undefined) {
      registrationOptions.push({
        registrationType: 'ByTeam',
        price: {
          currency: values.priceInfo.currency,
          amount: getMinorUnitsFromMoney(
            values.priceInfo.teamPrice,
            values.priceInfo.currency,
          ),
        },
      });
    }

    const body = {
      allowedTeamSizeRange: values.teamSizes,
      endTime: endTime,
      imageName: values.eventLogo,
      location: values.locationInfo,
      media: toEventMediaPayload(values.media),
      name: values.eventName,
      registrationCloseTime: closeTime,
      registrationOptions: registrationOptions,
      rulesDocLink: values.eventRules,
      startTime: startTime,
      timeZone: eventTimeZone,
    } as components['schemas']['Event'];

    const mutateOptions: MutateOptions<z.infer<typeof formSchema>> = {
      onSuccess: () => {
        form.reset();
        onSuccess({ ...body, id: values.id });
      },
      onError: (error) => {
        console.error('Event creation failed:', error);
        alert(`Error: ${error.message}`);
      },
    };

    if (mode === AdminEventMode.CREATE) {
      createMutate(
        {
          credentials: 'include',
          body,
        },
        mutateOptions,
      );
    } else {
      editMutate(
        {
          credentials: 'include',
          body,
          params: {
            path: {
              id: values.id,
            },
          },
        },
        mutateOptions,
      );
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Registration Closes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="regCloseDate"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Schedule</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <FormField
              control={form.control}
              name="eventStartTime"
              render={({ field }) => (
                <FormItem>
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
                <FormItem>
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
            <FormField
              control={form.control}
              name="eventTimeZone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Timezone</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {timeZones.map((t) => (
                          <SelectItem key={t.name} value={t.name}>
                            {t.name} ({t.offset})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
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
            <div className="grid gap-4 sm:grid-cols-2">
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
            <div className="grid gap-4 sm:grid-cols-3">
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
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
                          e.target.value === '' ? undefined : +e.target.value,
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
                          e.target.value === '' ? undefined : +e.target.value,
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="w-32 bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(Currencies).map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Team Sizes</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
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
                          e.target.value === '' ? undefined : +e.target.value,
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
                          e.target.value === '' ? undefined : +e.target.value,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Media & Documents</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="eventRules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Rules (link)</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className="bg-white"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setRulesPickerOpen(true)}
                    >
                      Browse Assets
                    </Button>
                  </div>
                  {field.value ? (
                    <a
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 underline"
                    >
                      Open rules document
                    </a>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="eventLogo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Event Logo</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        className="bg-white"
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setLogoPickerOpen(true)}
                    >
                      Browse Assets
                    </Button>
                  </div>
                  {field.value ? (
                    <img
                      key={field.value}
                      src={field.value}
                      alt="Event logo preview"
                      className="h-16 w-16 rounded border object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Event Media &amp; Post-Event Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm">
              The event page groups items into sections in a fixed order (Videos
              &amp; Livestreams, then Photo &amp; Asset Folders, then Resources
              &amp; Files). Reordering items here sets their order within each
              section. Removing an item never deletes the underlying asset.
            </p>

            {mediaFieldArray.fields.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No media items yet.
              </p>
            )}

            {mediaFieldArray.fields.map((mediaField, index) => {
              const mediaItem = mediaValues[index];
              if (!mediaItem) return null;

              const isAssetType =
                mediaItem.type === 'asset_folder' ||
                mediaItem.type === 'asset_file';
              const trimmedSource = mediaItem.source.trim();
              const showsLinkFallbackHint =
                mediaItem.type === 'video' &&
                trimmedSource !== '' &&
                (mediaItem.displayMode === 'auto' ||
                  mediaItem.displayMode === 'embed') &&
                isEventMediaUrl(trimmedSource, {
                  allowLoopbackHttp: import.meta.env.DEV,
                }) &&
                buildEventMediaEmbedData(trimmedSource) === null;

              return (
                <div
                  key={mediaField.fieldKey}
                  className="space-y-3 rounded-lg border p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">
                      Media Item {index + 1}
                    </p>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Move media item ${index + 1} up`}
                        disabled={index === 0}
                        onClick={() => mediaFieldArray.swap(index, index - 1)}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Move media item ${index + 1} down`}
                        disabled={index === mediaFieldArray.fields.length - 1}
                        onClick={() => mediaFieldArray.swap(index, index + 1)}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        aria-label={`Remove media item ${index + 1}`}
                        onClick={() => mediaFieldArray.remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name={`media.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={(value) =>
                                handleMediaTypeChange(
                                  index,
                                  value as EventMediaTypeValue,
                                )
                              }
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {EVENT_MEDIA_TYPE_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`media.${index}.displayMode`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Display</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {EVENT_MEDIA_DISPLAY_MODE_OPTIONS[
                                  mediaItem.type
                                ].map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`media.${index}.icon`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Icon</FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="w-full bg-white">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {EVENT_MEDIA_ICON_OPTIONS.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name={`media.${index}.source`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Source</FormLabel>
                        <div className="flex gap-2">
                          <FormControl>
                            {isAssetType ? (
                              <Input
                                readOnly
                                value={field.value}
                                placeholder={
                                  mediaItem.type === 'asset_folder'
                                    ? 'Select a folder'
                                    : 'Select a file'
                                }
                                className="bg-white font-mono text-sm"
                              />
                            ) : (
                              <Input
                                {...field}
                                placeholder="https://..."
                                className="bg-white"
                              />
                            )}
                          </FormControl>
                          {mediaItem.type === 'asset_folder' && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                setMediaPicker({ index, mode: 'folder' })
                              }
                            >
                              Select Folder
                            </Button>
                          )}
                          {mediaItem.type === 'asset_file' && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                setMediaPicker({ index, mode: 'allFiles' })
                              }
                            >
                              Browse Assets
                            </Button>
                          )}
                          {isAssetType && field.value !== '' && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                form.setValue(`media.${index}.source`, '', {
                                  shouldDirty: true,
                                })
                              }
                            >
                              Clear
                            </Button>
                          )}
                        </div>
                        {showsLinkFallbackHint && (
                          <p className="text-muted-foreground text-xs">
                            URL will render as a link button because it is not
                            an embeddable YouTube/Twitch URL.
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-3 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name={`media.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`media.${index}.description`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {duplicateMediaIds.has(mediaItem.id) && (
                    <p className="text-sm text-amber-600">
                      Another media item uses the same type and source. This is
                      allowed, but the page may show it twice.
                    </p>
                  )}
                </div>
              );
            })}

            <Button
              type="button"
              variant="outline"
              onClick={handleAddMediaItem}
              disabled={mediaFieldArray.fields.length >= MAX_EVENT_MEDIA_ITEMS}
            >
              Add Media Item
            </Button>
          </CardContent>
        </Card>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit'}
        </Button>
        <AssetPickerModal
          open={logoPickerOpen}
          onOpenChange={setLogoPickerOpen}
          onSelect={(url) =>
            form.setValue('eventLogo', url, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          folderPath="/Event-Logos"
          title="Select Event Logo"
        />
        <AssetPickerModal
          open={rulesPickerOpen}
          onOpenChange={setRulesPickerOpen}
          onSelect={(url) =>
            form.setValue('eventRules', url, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          folderPath="/Rules-Docs"
          accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          title="Select Rules Document"
          mode="allFiles"
          uploadPrompt="Click to upload a document"
        />
        <AssetPickerModal
          open={mediaPicker !== null}
          onOpenChange={(open) => {
            if (!open) setMediaPicker(null);
          }}
          onSelect={(selection) => {
            if (mediaPicker === null) return;
            form.setValue(`media.${mediaPicker.index}.source`, selection, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          mode={mediaPicker?.mode ?? 'allFiles'}
          title={
            mediaPicker?.mode === 'folder'
              ? 'Select Media Folder'
              : 'Select Media File'
          }
        />
      </form>
    </Form>
  );
}

// TODO: move this to utils package
function datetimeInputToISO(
  date: string,
  time: string,
  timezone: string,
): string {
  return DateTime.fromFormat(`${date} ${time}`, 'yyyy-MM-dd HH:mm', {
    zone: timezone,
  }).toISO()!;
}

function getMoneyAmount(
  money: components['schemas']['Money'] | undefined,
): number | undefined {
  if (money === undefined) {
    return undefined;
  }

  return new Money(money.amount, money.currency).toDecimal();
}

function getMinorUnitsFromMoney(money: number, currency: string): number {
  return Money.fromDecimal(money, currency).amount;
}
