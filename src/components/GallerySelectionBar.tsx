import { CheckCheck, Download, LoaderCircle, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BulkSaveMode } from '@/lib/bulkPhotoSave';

interface GallerySelectionBarProps {
  selectedCount: number;
  maxSelectable: number;
  failedCount: number;
  totalCount: number;
  isPreparing: boolean;
  isSaving: boolean;
  downloadProgress: { completed: number; total: number } | null;
  saveMode: BulkSaveMode;
  onSelectAll: () => void;
  onClear: () => void;
  onRetry: () => void;
  onSave: () => void;
  onDone: () => void;
}

function GallerySelectionBar({
  selectedCount,
  maxSelectable,
  failedCount,
  totalCount,
  isPreparing,
  isSaving,
  downloadProgress,
  saveMode,
  onSelectAll,
  onClear,
  onRetry,
  onSave,
  onDone,
}: GallerySelectionBarProps) {
  const ActionIcon = saveMode === 'share' ? Share2 : Download;
  const photoNoun = selectedCount === 1 ? 'photo' : 'photos';
  const countLabel =
    selectedCount === 0 ? '' : ` ${selectedCount} ${photoNoun}`;

  const actionLabel = isSaving
    ? saveMode === 'download'
      ? downloadProgress
        ? `Downloading ${downloadProgress.completed}/${downloadProgress.total}…`
        : 'Downloading…'
      : 'Saving…'
    : isPreparing
      ? 'Preparing…'
      : `${saveMode === 'share' ? 'Save' : 'Download'}${countLabel}`;

  return (
    <div className="bg-background/95 sticky top-16 z-10 space-y-2 rounded-lg border p-3 shadow-sm backdrop-blur-sm md:top-2">
      {isSaving && downloadProgress && (
        <output className="sr-only">
          Downloading {downloadProgress.completed} of {downloadProgress.total}{' '}
          photos
        </output>
      )}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium tabular-nums">
          {selectedCount} of {totalCount} selected
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={
              isSaving ||
              selectedCount === totalCount ||
              selectedCount >= maxSelectable
            }
            onClick={onSelectAll}
          >
            <CheckCheck aria-hidden="true" className="size-4" />
            Select all
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSaving || selectedCount === 0}
            onClick={onClear}
          >
            <X aria-hidden="true" className="size-4" />
            Clear
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={
              selectedCount === 0 ||
              isPreparing ||
              isSaving ||
              failedCount === selectedCount
            }
            onClick={onSave}
          >
            {isPreparing || isSaving ? (
              <LoaderCircle
                aria-hidden="true"
                className="size-4 animate-spin"
              />
            ) : (
              <ActionIcon aria-hidden="true" className="size-4" />
            )}
            {actionLabel}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isSaving}
            onClick={onDone}
          >
            Done
          </Button>
        </div>
      </div>
      {failedCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <output className="text-destructive text-xs" aria-live="polite">
            {failedCount} {failedCount === 1 ? 'photo' : 'photos'} could not be{' '}
            {saveMode === 'share' ? 'loaded for saving' : 'downloaded'}.
          </output>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isSaving}
            onClick={onRetry}
          >
            Retry
          </Button>
        </div>
      )}
      {failedCount === 0 && selectedCount > 0 && saveMode === 'share' && (
        <p className="text-muted-foreground text-xs">
          Opens your device&apos;s share menu so you can save them to your
          photos.
        </p>
      )}
      {failedCount === 0 && selectedCount > 1 && saveMode === 'download' && (
        <p className="text-muted-foreground text-xs">
          Your browser may ask to allow multiple downloads.
        </p>
      )}
    </div>
  );
}

export { GallerySelectionBar };
