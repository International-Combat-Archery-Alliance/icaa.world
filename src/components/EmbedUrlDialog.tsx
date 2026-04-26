import * as React from 'react';
import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { buildEmbedData, type EmbedBlockData } from '@/lib/embedUtils';

interface EmbedUrlDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (data: EmbedBlockData) => void;
}

function EmbedUrlDialog({ open, onOpenChange, onInsert }: EmbedUrlDialogProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a URL');
      return;
    }

    const embedData = buildEmbedData(trimmed);
    if (!embedData) {
      setError('Invalid URL. Enter a valid HTTPS URL.');
      return;
    }

    onInsert(embedData);
    setUrl('');
    setError(null);
    onOpenChange(false);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setUrl('');
      setError(null);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Embed Content</DialogTitle>
          <DialogDescription>
            Paste a URL to embed. Supports YouTube, Twitter, Instagram, Vimeo,
            and other services. PDFs will be embedded via Google Drive viewer.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <Label htmlFor="embed-url">URL</Label>
            <Input
              id="embed-url"
              placeholder="https://example.com/document.pdf"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Insert</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export { EmbedUrlDialog };
