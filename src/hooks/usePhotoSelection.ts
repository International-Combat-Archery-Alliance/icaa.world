import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { EventFileAsset } from '@/lib/eventMediaGrouping';
import {
  MAX_BULK_PHOTO_COUNT,
  preparePhotoFile,
  resolveBulkSaveMode,
  savePhotoFiles,
  type BulkSaveMode,
} from '@/lib/bulkPhotoSave';

const MAX_CONCURRENT_PREPARATIONS = 4;

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
  const queueRef = useRef<EventFileAsset[]>([]);
  const queuedUrlsRef = useRef(new Set<string>());
  const activePreparationsRef = useRef(0);
  const mountedRef = useRef(true);
  const startPreparationRef = useRef<(photo: EventFileAsset) => void>(() => {});
  const saveMode = useMemo(resolveBulkSaveMode, []);

  const setPreparedState = useCallback((url: string, state: PreparedPhoto) => {
    setPrepared((previous) => {
      const next = new Map(previous);
      next.set(url, state);
      return next;
    });
  }, []);

  const pumpQueue = useCallback(() => {
    while (
      activePreparationsRef.current < MAX_CONCURRENT_PREPARATIONS &&
      queueRef.current.length > 0
    ) {
      const photo = queueRef.current.shift();
      if (!photo) return;
      queuedUrlsRef.current.delete(photo.url);
      startPreparationRef.current(photo);
    }
  }, []);

  const startPreparation = useCallback(
    (photo: EventFileAsset) => {
      const controller = new AbortController();
      requestsRef.current.set(photo.url, controller);
      activePreparationsRef.current += 1;
      setPreparedState(photo.url, { status: 'pending' });

      preparePhotoFile(photo.url, photo.name, controller.signal)
        .then(
          (file) => {
            if (controller.signal.aborted) return;
            requestsRef.current.delete(photo.url);
            setPreparedState(photo.url, { status: 'ready', file });
          },
          (error: unknown) => {
            if (controller.signal.aborted) return;
            console.error(
              'Failed to prepare photo for saving',
              photo.url,
              error,
            );
            requestsRef.current.delete(photo.url);
            setPreparedState(photo.url, { status: 'failed' });
          },
        )
        .finally(() => {
          activePreparationsRef.current -= 1;
          if (mountedRef.current) pumpQueue();
        });
    },
    [pumpQueue, setPreparedState],
  );

  useEffect(() => {
    startPreparationRef.current = startPreparation;
  }, [startPreparation]);

  useEffect(() => {
    mountedRef.current = true;
    const queue = queueRef.current;
    const queuedUrls = queuedUrlsRef.current;
    const requests = requestsRef.current;

    return () => {
      mountedRef.current = false;
      queue.length = 0;
      queuedUrls.clear();
      for (const controller of requests.values()) controller.abort();
      requests.clear();
    };
  }, []);

  const forgetPhoto = useCallback(
    (url: string) => {
      queueRef.current = queueRef.current.filter((photo) => photo.url !== url);
      queuedUrlsRef.current.delete(url);
      requestsRef.current.get(url)?.abort();
      requestsRef.current.delete(url);
      setPrepared((previous) => {
        const next = new Map(previous);
        next.delete(url);
        return next;
      });
      pumpQueue();
    },
    [pumpQueue],
  );

  const preparePhoto = useCallback(
    (photo: EventFileAsset) => {
      if (
        requestsRef.current.has(photo.url) ||
        queuedUrlsRef.current.has(photo.url)
      ) {
        return;
      }

      queuedUrlsRef.current.add(photo.url);
      queueRef.current.push(photo);
      setPreparedState(photo.url, { status: 'pending' });
      pumpQueue();
    },
    [pumpQueue, setPreparedState],
  );

  const clearSelection = useCallback(() => {
    queueRef.current = [];
    queuedUrlsRef.current.clear();
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
      toast.info(
        `Selecting the first ${MAX_BULK_PHOTO_COUNT} photos from this folder.`,
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
    const readyEntries = selectedPhotos.flatMap((photo) => {
      const state = prepared.get(photo.url);
      return state?.status === 'ready' ? [{ photo, file: state.file }] : [];
    });

    if (readyEntries.length === 0) {
      toast.error(
        'Could not load the selected photos. Check your connection and try again.',
      );
      return;
    }

    const remainingPhotos = selectedPhotos.filter(
      (photo) => prepared.get(photo.url)?.status !== 'ready',
    );

    setIsSaving(true);
    try {
      const outcome = await savePhotoFiles(
        readyEntries.map((entry) => entry.file),
        saveMode,
        title,
      );
      if (outcome === 'cancelled') return;

      const count = readyEntries.length;
      toast.success(
        outcome === 'shared'
          ? `${count} ${count === 1 ? 'photo' : 'photos'} ready to save.`
          : `Downloading ${count} ${count === 1 ? 'photo' : 'photos'}.`,
      );

      if (remainingPhotos.length > 0) {
        const readyUrls = new Set(readyEntries.map((entry) => entry.photo.url));
        setSelected(new Set(remainingPhotos.map((photo) => photo.url)));
        setPrepared((previous) => {
          const next = new Map(previous);
          readyUrls.forEach((url) => next.delete(url));
          return next;
        });
        toast.info(
          `${remainingPhotos.length} ${remainingPhotos.length === 1 ? 'photo' : 'photos'} still need retrying.`,
        );
        return;
      }

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
