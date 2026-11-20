import { useCallback } from 'react';
import { toast } from 'sonner';

export function useCopyPhotoLink(): (url: string) => Promise<void> {
  return useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Photo link copied to clipboard');
    } catch {
      toast.error('Could not copy the photo link');
    }
  }, []);
}
