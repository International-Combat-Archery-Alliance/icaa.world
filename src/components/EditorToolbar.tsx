import type EditorJS from '@editorjs/editorjs';
import {
  Heading,
  List,
  Image,
  Quote,
  Minus,
  Table,
  Video,
  Link,
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  editor: EditorJS | null;
  onInsertImage?: () => void;
  className?: string;
}

function EditorToolbar({
  editor,
  onInsertImage,
  className,
}: EditorToolbarProps) {
  const insertBlock = (type: string, data?: Record<string, unknown>) => {
    const count = editor?.blocks.getBlocksCount() ?? 0;
    editor?.blocks.insert(type, data, {}, count, true);
  };

  const isReady = editor !== null;

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 bg-muted/50 p-1',
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!isReady}
        onClick={() => insertBlock('header', { text: '', level: 2 })}
        title="Add Heading"
      >
        <Heading className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!isReady}
        onClick={() => insertBlock('list', { style: 'unordered', items: [''] })}
        title="Add List"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!isReady}
        onClick={() => insertBlock('quote', { text: '', caption: '' })}
        title="Add Quote"
      >
        <Quote className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!isReady}
        onClick={() => insertBlock('delimiter', {})}
        title="Add Delimiter"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!isReady}
        onClick={() =>
          insertBlock('table', {
            content: [
              ['', ''],
              ['', ''],
            ],
          })
        }
        title="Add Table"
      >
        <Table className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!isReady}
        onClick={() => insertBlock('embed', { service: 'youtube', url: '' })}
        title="Add Embed"
      >
        <Video className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!isReady}
        onClick={() => insertBlock('linkTool', { link: '' })}
        title="Add Link"
      >
        <Link className="h-4 w-4" />
      </Button>
      {onInsertImage && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={!isReady}
          onClick={onInsertImage}
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}

export { EditorToolbar };
