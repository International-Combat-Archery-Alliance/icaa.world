import { useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { EventFileAsset } from '@/lib/eventMediaGrouping';
import {
  MAX_BULK_PHOTO_COUNT,
  preparePhotoFile,
  resolveBulkSaveMode,
  savePhotoFiles,
  type BulkSaveMode,
} from '@/lib/bulkPhotoSave';

type PreparedPhoto =
  | { status: 'pending' }
  | { status: 'ready'; file: File }
  | { status: 'failed' };

interface UsePhotoSelectionResult {
  isSelecting: boolean;
  selectedCount: number;
  failedCount: number;
  isPreparing: boolean;
  isSaving: boolean;
  saveMode: BulkSaveMode;
  isSelected: (url: string) => boolean;
  startSelecting: () => void;
  stopSelecting: () => void;
  togglePhoto: (photo: EventFileAsset) => void;
  selectAll: () => void;
  clearSelection: () => void;
  retryFailed: () => void;
  saveSelected: () => Promise<void>;
}

export function usePhotoSelection(
  photos: EventFileAsset[],
  title: string,
): UsePhotoSelectionResult {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selected, setSelected] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [prepared, setPrepared] = useState<ReadonlyMap<string, PreparedPhoto>>(
    () => new Map(),
  );
  const [isSaving, setIsSaving] = useState(false);
  const requestsRef = useRef(new Map<string, AbortController>());
  const saveMode = useMemo(resolveBulkSaveMode, []);

  const forgetPhoto = useCallback((url: string) => {
    requestsRef.current.get(url)?.abort();
    requestsRef.current.delete(url);
    setPrepared((previous) => {
      const next = new Map(previous);
      next.delete(url);
      return next;
    });
  }, []);

  const preparePhoto = useCallback((photo: EventFileAsset) => {
    if (requestsRef.current.has(photo.url)) return;

    const controller = new AbortController();
    requestsRef.current.set(photo.url, controller);
    setPrepared((previous) => {
      const next = new Map(previous);
      next.set(photo.url, { status: 'pending' });
      return next;
    });

    preparePhotoFile(photo.url, photo.name, controller.signal).then(
      (file) => {
        if (controller.signal.aborted) return;
        setPrepared((previous) => {
          const next = new Map(previous);
          next.set(photo.url, { status: 'ready', file });
          return next;
        });
      },
      (error: unknown) => {
        if (controller.signal.aborted) return;
        console.error('Failed to prepare photo for saving', photo.url, error);
        requestsRef.current.delete(photo.url);
        setPrepared((previous) => {
          const next = new Map(previous);
          next.set(photo.url, { status: 'failed' });
          return next;
        });
      },
    );
  }, []);

  const clearSelection = useCallback(() => {
    for (const controller of requestsRef.current.values()) controller.abort();
    requestsRef.current.clear();
    setSelected(new Set());
    setPrepared(new Map());
  }, []);

  const startSelecting = useCallback(() => setIsSelecting(true), []);

  const stopSelecting = useCallback(() => {
    setIsSelecting(false);
    clearSelection();
  }, [clearSelection]);

  const togglePhoto = useCallback(
    (photo: EventFileAsset) => {
      if (selected.has(photo.url)) {
        setSelected((previous) => {
          const next = new Set(previous);
          next.delete(photo.url);
          return next;
        });
        forgetPhoto(photo.url);
        return;
      }

      if (selected.size >= MAX_BULK_PHOTO_COUNT) {
        toast.error(
          `You can select up to ${MAX_BULK_PHOTO_COUNT} photos at once.`,
        );
        return;
      }

      setSelected((previous) => new Set(previous).add(photo.url));
      preparePhoto(photo);
    },
    [forgetPhoto, preparePhoto, selected],
  );

  const selectAll = useCallback(() => {
    const capped = photos.slice(0, MAX_BULK_PHOTO_COUNT);
    if (photos.length > MAX_BULK_PHOTO_COUNT) {
      toast.error(
        `You can select up to ${MAX_BULK_PHOTO_COUNT} photos at once.`,
      );
    }

    setSelected(new Set(capped.map((photo) => photo.url)));
    capped.forEach(preparePhoto);
  }, [photos, preparePhoto]);

  const selectedPhotos = useMemo(
    () => photos.filter((photo) => selected.has(photo.url)),
    [photos, selected],
  );

  const isPreparing = selectedPhotos.some((photo) => {
    const state = prepared.get(photo.url);
    return state === undefined || state.status === 'pending';
  });
  const failedCount = selectedPhotos.filter(
    (photo) => prepared.get(photo.url)?.status === 'failed',
  ).length;

  const retryFailed = useCallback(() => {
    selectedPhotos.forEach((photo) => {
      if (prepared.get(photo.url)?.status !== 'failed') return;
      requestsRef.current.delete(photo.url);
      preparePhoto(photo);
    });
  }, [prepared, preparePhoto, selectedPhotos]);

  const isSelected = useCallback(
    (url: string) => selected.has(url),
    [selected],
  );

  const saveSelected = useCallback(async () => {
    const readyFiles = selectedPhotos.flatMap((photo) => {
      const state = prepared.get(photo.url);
      return state?.status === 'ready' ? [state.file] : [];
    });

    if (readyFiles.length === 0) {
      toast.error(
        'Could not load the selected photos. Check your connection and try again.',
      );
      return;
    }

    const skippedCount = selectedPhotos.length - readyFiles.length;
    if (skippedCount > 0) {
      toast.info(
        `${skippedCount} ${skippedCount === 1 ? 'photo' : 'photos'} could not be prepared and will be skipped.`,
      );
    }

    setIsSaving(true);
    try {
      const outcome = await savePhotoFiles(readyFiles, saveMode, title);
      if (outcome === 'cancelled') return;

      const count = readyFiles.length;
      toast.success(
        outcome === 'shared'
          ? `${count} ${count === 1 ? 'photo' : 'photos'} ready to save.`
          : `Downloading ${count} ${count === 1 ? 'photo' : 'photos'}.`,
      );
      stopSelecting();
    } finally {
      setIsSaving(false);
    }
  }, [prepared, saveMode, selectedPhotos, stopSelecting, title]);

  return {
    isSelecting,
    selectedCount: selectedPhotos.length,
    failedCount,
    isPreparing,
    isSaving,
    saveMode,
    isSelected,
    startSelecting,
    stopSelecting,
    togglePhoto,
    selectAll,
    clearSelection,
    retryFailed,
    saveSelected,
  };
}
