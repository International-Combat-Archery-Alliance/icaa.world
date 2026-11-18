import { useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

interface MediaLightboxImage {
  url: string;
  alt: string;
}

interface MediaLightboxProps {
  images: MediaLightboxImage[];
  open: boolean;
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onOpenChange: (open: boolean) => void;
  title: string;
}

function MediaLightbox({
  images,
  open,
  activeIndex,
  onIndexChange,
  onOpenChange,
  title,
}: MediaLightboxProps) {
  const activeImage = images[activeIndex];
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!open || !hasMultipleImages) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        onIndexChange((activeIndex - 1 + images.length) % images.length);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        onIndexChange((activeIndex + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, hasMultipleImages, images.length, onIndexChange, open]);

  if (!activeImage) return null;

  const showPrevious = () =>
    onIndexChange((activeIndex - 1 + images.length) % images.length);
  const showNext = () => onIndexChange((activeIndex + 1) % images.length);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-5xl gap-3 border-0 bg-black/95 p-3 text-white sm:max-w-5xl"
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="relative">
          <img
            src={activeImage.url}
            alt={activeImage.alt}
            className="mx-auto max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
          />
          {hasMultipleImages && (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full"
                onClick={showPrevious}
              >
                <ChevronLeft aria-hidden="true" />
                <span className="sr-only">Previous photo</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full"
                onClick={showNext}
              >
                <ChevronRight aria-hidden="true" />
                <span className="sr-only">Next photo</span>
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center justify-center gap-3 text-xs text-white/80">
          {activeImage.alt && (
            <span className="truncate">{activeImage.alt}</span>
          )}
          <span className="rounded-full bg-white/10 px-2 py-0.5 tabular-nums">
            {activeIndex + 1} / {images.length}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export { MediaLightbox };
