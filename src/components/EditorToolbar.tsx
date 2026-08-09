import { useEffect, useState } from 'react';
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
  MousePointerClick,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface EditorToolbarProps {
  editor: EditorJS | null;
  onInsertImage?: () => void;
  onInsertEmbed?: () => void;
  className?: string;
}

const INLINE_FORMATS = {
  bold: { tag: 'B', class: 'cdx-bold' },
  italic: { tag: 'I', class: 'cdx-italic' },
  underline: { tag: 'U', class: 'cdx-underline' },
  strikethrough: { tag: 'S', class: 'cdx-strikethrough' },
  inlineCode: { tag: 'CODE', class: 'cdx-inline-code' },
} as const;

type InlineFormatKey = keyof typeof INLINE_FORMATS;

function findParentTag(
  element: Node | null,
  tag: string,
  className: string,
): HTMLElement | null {
  let current: Node | null = element;
  while (current && current !== document.body) {
    if (
      current instanceof HTMLElement &&
      current.tagName === tag &&
      current.classList.contains(className)
    ) {
      return current;
    }
    current = current.parentElement;
  }
  return null;
}

function EditorToolbar({
  editor,
  onInsertImage,
  onInsertEmbed,
  className,
}: EditorToolbarProps) {
  const [activeFormats, setActiveFormats] = useState<
    Record<InlineFormatKey, boolean>
  >({
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
    inlineCode: false,
  });

  useEffect(() => {
    const updateActiveFormats = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) return;
      const range = sel.getRangeAt(0);
      const ancestor = range.commonAncestorContainer;
      const node =
        ancestor.nodeType === Node.TEXT_NODE
          ? ancestor.parentElement
          : (ancestor as HTMLElement);

      setActiveFormats({
        bold: !!findParentTag(
          node,
          INLINE_FORMATS.bold.tag,
          INLINE_FORMATS.bold.class,
        ),
        italic: !!findParentTag(
          node,
          INLINE_FORMATS.italic.tag,
          INLINE_FORMATS.italic.class,
        ),
        underline: !!findParentTag(
          node,
          INLINE_FORMATS.underline.tag,
          INLINE_FORMATS.underline.class,
        ),
        strikethrough: !!findParentTag(
          node,
          INLINE_FORMATS.strikethrough.tag,
          INLINE_FORMATS.strikethrough.class,
        ),
        inlineCode: !!findParentTag(
          node,
          INLINE_FORMATS.inlineCode.tag,
          INLINE_FORMATS.inlineCode.class,
        ),
      });
    };

    document.addEventListener('selectionchange', updateActiveFormats);
    return () =>
      document.removeEventListener('selectionchange', updateActiveFormats);
  }, []);

  const insertBlock = (type: string, data?: Record<string, unknown>) => {
    const currentIndex = editor?.blocks.getCurrentBlockIndex() ?? 0;
    editor?.blocks.insert(type, data, {}, currentIndex + 1, true);
  };

  const toggleInlineFormat = (key: InlineFormatKey) => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const { tag, class: cssClass } = INLINE_FORMATS[key];

    const ancestor = range.commonAncestorContainer;
    const node =
      ancestor.nodeType === Node.TEXT_NODE
        ? ancestor.parentElement
        : (ancestor as HTMLElement);

    const existingWrapper = findParentTag(node, tag, cssClass);
    if (existingWrapper) {
      sel.removeAllRanges();
      sel.addRange(range);
      const unwrappedContent = range.extractContents();
      existingWrapper.parentNode?.removeChild(existingWrapper);
      range.insertNode(unwrappedContent);
      sel.removeAllRanges();
      sel.addRange(range);
    } else {
      const el = document.createElement(tag);
      el.classList.add(cssClass);
      el.appendChild(range.extractContents());
      range.insertNode(el);
    }
  };

  const isReady = editor !== null;

  const inlineButton = (
    key: InlineFormatKey,
    Icon: typeof Bold,
    title: string,
  ) => (
    <Button
      key={key}
      type="button"
      variant={activeFormats[key] ? 'default' : 'ghost'}
      size="icon"
      disabled={!isReady}
      onClick={() => toggleInlineFormat(key)}
      title={title}
    >
      <Icon className="h-4 w-4" />
    </Button>
  );

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 bg-muted/50 p-1',
        className,
      )}
    >
      {inlineButton('bold', Bold, 'Bold')}
      {inlineButton('italic', Italic, 'Italic')}
      {inlineButton('underline', Underline, 'Underline')}
      {inlineButton('strikethrough', Strikethrough, 'Strikethrough')}
      {inlineButton('inlineCode', Code, 'Inline Code')}
      <div className="mx-0.5 h-6 w-px bg-border" />
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
        onClick={() =>
          insertBlock('list', {
            style: 'unordered',
            items: [{ content: '', items: [] }],
          })
        }
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
        onClick={onInsertEmbed}
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
      <Button
        type="button"
        variant="ghost"
        size="icon"
        disabled={!isReady}
        onClick={() =>
          insertBlock('buttonLink', {
            url: '',
            text: '',
            variant: 'default',
          })
        }
        title="Add Button Link"
      >
        <MousePointerClick className="h-4 w-4" />
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
