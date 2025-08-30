import { useForm } from 'react-hook-form';
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
import { Button } from './ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import type { MutateOptions } from '@tanstack/react-query';
import { format, formatISO, parse, parseISO } from 'date-fns';
import { tz } from '@date-fns/tz';
import { Money } from 'ts-money';

export enum AdminEventMode {
  CREATE,
  EDIT,
}

export function AdminEventForm({
  onSuccess = () => {},
  mode,
  editData,
}: {
  onSuccess?: (values: Event) => void;
  mode: AdminEventMode;
  editData?: Event;
}) {
  const { mutate: createMutate, isPending: createIsPending } = useCreateEvent();
  const { mutate: editMutate, isPending: editIsPending } = useUpdateEvent();

  const isPending = createIsPending || editIsPending;

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

    eventRules: z.string().optional(),
    eventLogo: z.string().optional(),
    ...(mode === AdminEventMode.EDIT
      ? {
          id: z.uuid(),
        }
      : {}),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: editData && {
      id: editData?.id,
      eventDate: format(
        parseISO(editData.startTime, { in: tz('UTC') }),
        'yyyy-MM-dd',
      ),
      eventStartTime: format(
        parseISO(editData.startTime, { in: tz('UTC') }),
        'HH:mm',
      ),
      eventEndTime: format(
        parseISO(editData.endTime, { in: tz('UTC') }),
        'HH:mm',
      ),
      regCloseDate: format(
        parseISO(editData.registrationCloseTime, { in: tz('UTC') }),
        'yyyy-MM-dd',
      ),
      regCloseTime: format(
        parseISO(editData.registrationCloseTime, { in: tz('UTC') }),
        'HH:mm',
      ),
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
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const {
      eventDate,
      eventStartTime,
      eventEndTime,
      regCloseDate,
      regCloseTime,
    } = values;
    const startTime = datetimeInputToISO(eventDate, eventStartTime);
    const endTime = datetimeInputToISO(eventDate, eventEndTime);
    const closeTime = datetimeInputToISO(regCloseDate, regCloseTime);

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
      name: values.eventName,
      registrationCloseTime: closeTime,
      registrationOptions: registrationOptions,
      rulesDocLink: values.eventRules,
      startTime: startTime,
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
  );
}

// TODO: move this to utils package
function datetimeInputToISO(date: string, time: string): string {
  const parsed = parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date(), {
    in: tz('UTC'),
  });
  return formatISO(parsed);
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
