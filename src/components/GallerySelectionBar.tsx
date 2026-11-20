import { CheckCheck, Download, LoaderCircle, Share2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BulkSaveMode } from '@/lib/bulkPhotoSave';

interface GallerySelectionBarProps {
  selectedCount: number;
  totalCount: number;
  isPreparing: boolean;
  isSaving: boolean;
  saveMode: BulkSaveMode;
  onSelectAll: () => void;
  onClear: () => void;
  onSave: () => void;
  onDone: () => void;
}

function GallerySelectionBar({
  selectedCount,
  totalCount,
  isPreparing,
  isSaving,
  saveMode,
  onSelectAll,
  onClear,
  onSave,
  onDone,
}: GallerySelectionBarProps) {
  const ActionIcon = saveMode === 'share' ? Share2 : Download;
  const photoNoun = selectedCount === 1 ? 'photo' : 'photos';
  const countLabel =
    selectedCount === 0 ? '' : ` ${selectedCount} ${photoNoun}`;

  const actionLabel = isSaving
    ? 'Saving…'
    : isPreparing
      ? 'Preparing…'
      : `${saveMode === 'share' ? 'Save' : 'Download'}${countLabel}`;

  return (
    <div className="bg-background/95 sticky top-2 z-10 space-y-2 rounded-lg border p-3 shadow-sm backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-medium tabular-nums" aria-live="polite">
          {selectedCount} of {totalCount} selected
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={selectedCount === totalCount}
            onClick={onSelectAll}
          >
            <CheckCheck aria-hidden="true" className="size-4" />
            Select all
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={selectedCount === 0}
            onClick={onClear}
          >
            <X aria-hidden="true" className="size-4" />
            Clear
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={selectedCount === 0 || isPreparing || isSaving}
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
          <Button type="button" variant="ghost" size="sm" onClick={onDone}>
            Done
          </Button>
        </div>
      </div>
      {selectedCount > 0 && saveMode === 'share' && (
        <p className="text-muted-foreground text-xs">
          Opens your device&apos;s share menu so you can save them to your
          photos.
        </p>
      )}
      {selectedCount > 1 && saveMode === 'download' && (
        <p className="text-muted-foreground text-xs">
          Your browser may ask to allow multiple downloads.
        </p>
      )}
    </div>
  );
}

export { GallerySelectionBar };
