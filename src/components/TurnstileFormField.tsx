import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import Turnstile from 'react-turnstile';

export function TurnstileFormField<T extends FieldValues>({
  form,
  fieldName,
}: {
  form: UseFormReturn<T>;
  fieldName: Path<T>;
}) {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="justify-items-center">
          <FormLabel />
          <FormControl>
            <Turnstile
              theme="light"
              sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
              onVerify={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
