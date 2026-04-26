import * as React from 'react';
import { cn } from '@/lib/utils';

interface EditorJsBlock {
  type: string;
  data: Record<string, unknown>;
  tunes?: Record<string, { alignment?: string; size?: string }>;
}

function getAlignment(block: EditorJsBlock): string {
  return block.tunes?.alignmentTune?.alignment || 'left';
}

function alignClass(alignment: string): string {
  if (alignment === 'center') return 'text-center';
  if (alignment === 'right') return 'text-right';
  return '';
}

interface EditorJsData {
  blocks: EditorJsBlock[];
}

interface ListItem {
  content: string;
  items: ListItem[];
}

function isListItem(item: unknown): item is ListItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'content' in item &&
    typeof (item as ListItem).content === 'string'
  );
}

function renderListItems(
  items: unknown[],
  ListTag: 'ul' | 'ol',
  listClass: string,
): React.ReactNode {
  if (items.length === 0) return null;

  return (
    <ListTag className={`list-inside space-y-1 ${listClass}`}>
      {items.map((item, i) => {
        if (isListItem(item)) {
          return (
            <li key={i}>
              <span dangerouslySetInnerHTML={{ __html: item.content }} />
              {item.items &&
                item.items.length > 0 &&
                renderListItems(item.items, ListTag, listClass)}
            </li>
          );
        }
        if (typeof item === 'string') {
          return (
            <li key={i}>
              <span dangerouslySetInnerHTML={{ __html: item }} />
            </li>
          );
        }
        return null;
      })}
    </ListTag>
  );
}

function BlockRenderer({ block }: { block: EditorJsBlock }) {
  switch (block.type) {
    case 'paragraph':
      return (
        <p
          className={alignClass(getAlignment(block))}
          dangerouslySetInnerHTML={{
            __html: (block.data.text as string) || '',
          }}
        />
      );

    case 'header': {
      const level = Math.min(Math.max((block.data.level as number) || 2, 1), 6);
      const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
      return (
        <Tag
          className={`${
            level === 1
              ? 'text-3xl font-bold'
              : level === 2
                ? 'text-2xl font-bold'
                : 'text-xl font-semibold'
          } ${alignClass(getAlignment(block))}`.trim()}
          dangerouslySetInnerHTML={{
            __html: (block.data.text as string) || '',
          }}
        />
      );
    }

    case 'list': {
      const style = (block.data.style as string) || 'unordered';
      const ListTag = style === 'ordered' ? 'ol' : 'ul';
      const listClass =
        `${style === 'ordered' ? 'list-decimal' : 'list-disc'} ${alignClass(getAlignment(block))}`.trim();
      return renderListItems(
        (block.data.items as unknown[]) || [],
        ListTag,
        listClass,
      );
    }

    case 'image': {
      const file = block.data.file as { url?: string } | undefined;
      const caption = block.data.caption as string | undefined;
      const url = file?.url;
      const size = block.data.size as string | undefined;
      const alignment = getAlignment(block);

      const sizeClass = {
        small: 'w-1/4',
        medium: 'w-1/2',
        large: 'w-3/4',
        full: 'w-full',
      }[size || 'full'];

      if (!url) return null;

      const imgAlignClass =
        alignment === 'center'
          ? 'mx-auto'
          : alignment === 'right'
            ? 'ml-auto'
            : '';

      return (
        <figure className="my-4">
          <img
            src={url}
            alt={caption || ''}
            className={`${sizeClass} max-w-full h-auto rounded-md ${imgAlignClass}`}
          />
          {caption && (
            <figcaption
              className={`text-sm text-muted-foreground mt-2 ${alignClass(alignment)}`}
            >
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'quote': {
      const text = block.data.text as string;
      const caption = block.data.caption as string | undefined;
      const alignment = getAlignment(block);

      return (
        <blockquote
          className={`border-l-4 border-primary pl-4 py-2 my-4 ${alignClass(alignment)}`}
        >
          <p
            className="italic"
            dangerouslySetInnerHTML={{ __html: text || '' }}
          />
          {caption && (
            <cite className="block text-sm text-muted-foreground mt-2 not-italic">
              — {caption}
            </cite>
          )}
        </blockquote>
      );
    }

    case 'delimiter':
      return <hr className="my-6 border-t border-border" />;

    case 'embed': {
      const embedUrl = block.data.embed as string | undefined;
      const caption = block.data.caption as string | undefined;
      const width = (block.data.width as number) ?? 600;
      const height = (block.data.height as number) ?? 400;
      const alignment = getAlignment(block);
      const size = block.tunes?.embedSizeTune?.size as string | undefined;
      const sizeWidth: Record<string, string> = {
        small: '400px',
        medium: '600px',
        large: '900px',
        fill: '100%',
      };
      const appliedWidth = size ? (sizeWidth[size] ?? width) : width;

      if (!embedUrl) return null;

      return (
        <figure className={cn('my-4', alignClass(alignment))}>
          <div className="overflow-hidden rounded-md">
            <iframe
              src={embedUrl}
              width={appliedWidth}
              height={height}
              className={cn(
                'max-w-full',
                alignment === 'center' && 'mx-auto block',
                alignment === 'right' && 'ml-auto block',
              )}
              allowFullScreen
              frameBorder="0"
            />
          </div>
          {caption && (
            <figcaption className="text-sm text-muted-foreground mt-2 text-center">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'table': {
      const withHeadings = block.data.withHeadings as boolean;
      const content = block.data.content as string[][] | undefined;

      if (!content || content.length === 0) return null;

      return (
        <div className="overflow-x-auto my-4">
          <table className="w-full border-collapse border border-border">
            <tbody>
              {content.map((row, rowIndex) => {
                const CellTag = withHeadings && rowIndex === 0 ? 'th' : 'td';
                return (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <CellTag
                        key={cellIndex}
                        className="border border-border px-3 py-2"
                        dangerouslySetInnerHTML={{ __html: cell }}
                      />
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    }

    case 'linkTool': {
      const link = block.data.link as string | undefined;
      const meta = block.data.meta as
        | { title?: string; description?: string; image?: { url?: string } }
        | undefined;

      if (!link) return null;

      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="block border rounded-md p-4 my-4 hover:bg-secondary/50 transition-colors no-underline"
        >
          <div className="flex gap-4">
            {meta?.image?.url && (
              <img
                src={meta.image.url}
                alt=""
                className="w-24 h-24 object-cover rounded-md flex-shrink-0"
              />
            )}
            <div className="min-w-0">
              <p className="font-medium truncate">{meta?.title || link}</p>
              {meta?.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {meta.description}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {link}
              </p>
            </div>
          </div>
        </a>
      );
    }

    case 'warning':
      return (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 my-4">
          <p className="font-medium text-yellow-800">Warning</p>
          <p
            className="text-yellow-700 mt-1"
            dangerouslySetInnerHTML={{
              __html: (block.data.message as string) || '',
            }}
          />
        </div>
      );

    default:
      return null;
  }
}

interface EditorJsRendererProps {
  data: EditorJsData;
}

function EditorJsRenderer({ data }: EditorJsRendererProps) {
  if (!data?.blocks?.length) {
    return <p className="text-muted-foreground">No content available.</p>;
  }

  return (
    <div className="flex flex-col gap-4 [&_a]:text-primary [&_a]:font-bold">
      {data.blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}

export { EditorJsRenderer };
