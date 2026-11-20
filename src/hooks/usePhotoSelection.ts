import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import type { EventFileAsset } from '@/lib/eventMediaGrouping';
import {
  MAX_BULK_PHOTO_COUNT,
  downloadPhotoUrls,
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
  maxSelectable: number;
  failedCount: number;
  isPreparing: boolean;
  isSaving: boolean;
  downloadProgress: { completed: number; total: number } | null;
  saveMode: BulkSaveMode;
  isSelected: (url: string) => boolean;
  startSelecting: () => void;
  stopSelecting: () => void;
  togglePhoto: (photo: EventFileAsset) => void;
  selectAll: () => void;
  clearSelection: () => void;
  retryFailed: () => void;
  saveSelected: () => Promise<void>;
  downloadAll: () => Promise<void>;
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
  const [downloadProgress, setDownloadProgress] = useState<{
    completed: number;
    total: number;
  } | null>(null);
  const [downloadFailedUrls, setDownloadFailedUrls] = useState<
    ReadonlySet<string>
  >(() => new Set());
  const savingRef = useRef(false);
  const downloadControllerRef = useRef<AbortController | null>(null);
  const requestsRef = useRef(new Map<string, AbortController>());
  const queueRef = useRef<EventFileAsset[]>([]);
  const queuedUrlsRef = useRef(new Set<string>());
  const activePreparationsRef = useRef(0);
  const mountedRef = useRef(true);
  const startPreparationRef = useRef<(photo: EventFileAsset) => void>(() => {});
  const saveMode = useMemo(resolveBulkSaveMode, []);
  const maxSelectable =
    saveMode === 'share' ? MAX_BULK_PHOTO_COUNT : photos.length;

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
      downloadControllerRef.current?.abort();
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
      const state = prepared.get(photo.url);
      if (
        state?.status === 'ready' ||
        state?.status === 'pending' ||
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
    [prepared, pumpQueue, setPreparedState],
  );

  const clearSelection = useCallback(() => {
    queueRef.current = [];
    queuedUrlsRef.current.clear();
    for (const controller of requestsRef.current.values()) controller.abort();
    requestsRef.current.clear();
    setSelected(new Set());
    setPrepared(new Map());
    setDownloadFailedUrls(new Set());
  }, []);

  const startSelecting = useCallback(() => setIsSelecting(true), []);

  const stopSelecting = useCallback(() => {
    setIsSelecting(false);
    clearSelection();
  }, [clearSelection]);

  const togglePhoto = useCallback(
    (photo: EventFileAsset) => {
      if (isSaving) return;

      setDownloadFailedUrls(new Set());

      if (selected.has(photo.url)) {
        setSelected((previous) => {
          const next = new Set(previous);
          next.delete(photo.url);
          return next;
        });
        forgetPhoto(photo.url);
        return;
      }

      if (selected.size >= maxSelectable) {
        toast.error(
          saveMode === 'share'
            ? `You can select up to ${MAX_BULK_PHOTO_COUNT} photos for the share sheet at once.`
            : 'All photos in this folder are already selected.',
        );
        return;
      }

      setSelected((previous) => new Set(previous).add(photo.url));
      if (saveMode === 'share') preparePhoto(photo);
    },
    [forgetPhoto, isSaving, maxSelectable, preparePhoto, saveMode, selected],
  );

  const selectAll = useCallback(() => {
    const capped =
      saveMode === 'share' ? photos.slice(0, MAX_BULK_PHOTO_COUNT) : photos;

    if (saveMode === 'share' && photos.length > MAX_BULK_PHOTO_COUNT) {
      toast.info(
        `Selecting the first ${MAX_BULK_PHOTO_COUNT} photos for the share sheet.`,
      );
    }

    setDownloadFailedUrls(new Set());
    setSelected(new Set(capped.map((photo) => photo.url)));
    if (saveMode === 'share') capped.forEach(preparePhoto);
  }, [photos, preparePhoto, saveMode]);

  const selectedPhotos = useMemo(
    () => photos.filter((photo) => selected.has(photo.url)),
    [photos, selected],
  );

  const isPreparing =
    saveMode === 'share' &&
    selectedPhotos.some((photo) => {
      const state = prepared.get(photo.url);
      return state === undefined || state.status === 'pending';
    });
  const failedCount =
    saveMode === 'share'
      ? selectedPhotos.filter(
          (photo) => prepared.get(photo.url)?.status === 'failed',
        ).length
      : selectedPhotos.filter((photo) => downloadFailedUrls.has(photo.url))
          .length;

  const isSelected = useCallback(
    (url: string) => selected.has(url),
    [selected],
  );

  const runDownload = useCallback(
    async (photosToDownload: EventFileAsset[]) => {
      if (savingRef.current || photosToDownload.length === 0) return false;

      savingRef.current = true;
      const controller = new AbortController();
      downloadControllerRef.current = controller;
      setIsSaving(true);
      setDownloadProgress({ completed: 0, total: photosToDownload.length });
      setDownloadFailedUrls(new Set());
      if (photosToDownload.length > 1) {
        toast.info(
          photosToDownload.length > 100
            ? `Downloading ${photosToDownload.length} photos may take several minutes; your browser may ask to allow multiple downloads.`
            : 'Your browser may ask to allow multiple downloads.',
        );
      }

      try {
        const result = await downloadPhotoUrls(
          photosToDownload.map((photo) => ({
            url: photo.url,
            name: photo.name,
          })),
          {
            signal: controller.signal,
            onProgress: (completed, total) => {
              if (!mountedRef.current) return;
              if (completed !== total && completed % 10 !== 0) return;
              setDownloadProgress({ completed, total });
            },
          },
        );

        if (!mountedRef.current) return false;

        if (result.downloaded > 0) {
          toast.success(
            `Started downloading ${result.downloaded} ${result.downloaded === 1 ? 'photo' : 'photos'}.`,
          );
        }

        if (result.failedPhotos.length > 0) {
          const failedUrls = new Set(
            result.failedPhotos.map((photo) => photo.url),
          );
          setDownloadFailedUrls(failedUrls);
          setIsSelecting(true);
          setSelected(failedUrls);
          toast.error(
            `${result.failedPhotos.length} ${result.failedPhotos.length === 1 ? 'photo' : 'photos'} could not be downloaded. Try again.`,
          );
          return false;
        }

        return true;
      } catch {
        if (mountedRef.current) {
          toast.error('Could not download the photos. Try again.');
        }
        return false;
      } finally {
        savingRef.current = false;
        downloadControllerRef.current = null;
        if (mountedRef.current) {
          setIsSaving(false);
          setDownloadProgress(null);
        }
      }
    },
    [],
  );

  const retryFailed = useCallback(() => {
    if (saveMode === 'download') {
      const failed = selectedPhotos.filter((photo) =>
        downloadFailedUrls.has(photo.url),
      );
      if (failed.length === 0) return;

      void runDownload(failed).then((completed) => {
        if (completed) stopSelecting();
      });
      return;
    }

    selectedPhotos.forEach((photo) => {
      if (prepared.get(photo.url)?.status !== 'failed') return;
      requestsRef.current.delete(photo.url);
      preparePhoto(photo);
    });
  }, [
    downloadFailedUrls,
    prepared,
    preparePhoto,
    runDownload,
    saveMode,
    selectedPhotos,
    stopSelecting,
  ]);

  const downloadAll = useCallback(async () => {
    if (saveMode !== 'download' || photos.length === 0) return;
    await runDownload(photos);
  }, [photos, runDownload, saveMode]);

  const saveSelected = useCallback(async () => {
    if (selectedPhotos.length === 0) return;

    if (saveMode === 'download') {
      const completed = await runDownload(selectedPhotos);
      if (completed) stopSelecting();
      return;
    }

    if (savingRef.current) return;

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

    savingRef.current = true;
    setIsSaving(true);
    try {
      const outcome = await savePhotoFiles(
        readyEntries.map((entry) => entry.file),
        saveMode,
        title,
      );
      if (!mountedRef.current || outcome === 'cancelled') return;

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
    } catch {
      if (mountedRef.current) {
        toast.error('Could not save the photos. Try again.');
      }
    } finally {
      savingRef.current = false;
      if (mountedRef.current) setIsSaving(false);
    }
  }, [prepared, runDownload, saveMode, selectedPhotos, stopSelecting, title]);

  return {
    isSelecting,
    selectedCount: selectedPhotos.length,
    maxSelectable,
    failedCount,
    isPreparing,
    isSaving,
    downloadProgress,
    saveMode,
    isSelected,
    startSelecting,
    stopSelecting,
    togglePhoto,
    selectAll,
    clearSelection,
    retryFailed,
    saveSelected,
    downloadAll,
  };
}
