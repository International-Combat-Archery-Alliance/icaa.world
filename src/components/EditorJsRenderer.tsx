import * as React from 'react';

interface EditorJsBlock {
  type: string;
  data: Record<string, unknown>;
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
          className={
            level === 1
              ? 'text-3xl font-bold'
              : level === 2
                ? 'text-2xl font-bold'
                : 'text-xl font-semibold'
          }
          dangerouslySetInnerHTML={{
            __html: (block.data.text as string) || '',
          }}
        />
      );
    }

    case 'list': {
      const style = (block.data.style as string) || 'unordered';
      const ListTag = style === 'ordered' ? 'ol' : 'ul';
      const listClass = style === 'ordered' ? 'list-decimal' : 'list-disc';
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

      if (!url) return null;

      return (
        <figure className="my-4">
          <img
            src={url}
            alt={caption || ''}
            className="max-w-full h-auto rounded-md"
          />
          {caption && (
            <figcaption className="text-sm text-muted-foreground mt-2 text-center">
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }

    case 'quote': {
      const text = block.data.text as string;
      const caption = block.data.caption as string | undefined;
      const alignment = (block.data.alignment as string) || 'left';
      const alignClass =
        alignment === 'center'
          ? 'text-center'
          : alignment === 'right'
            ? 'text-right'
            : 'text-left';

      return (
        <blockquote
          className={`border-l-4 border-primary pl-4 py-2 my-4 ${alignClass}`}
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
      const embedHtml = block.data.embed as string | undefined;
      const caption = block.data.caption as string | undefined;

      if (!embedHtml) return null;

      return (
        <figure className="my-4">
          <div
            className="overflow-hidden rounded-md"
            dangerouslySetInnerHTML={{ __html: embedHtml }}
          />
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
    <div className="flex flex-col gap-4">
      {data.blocks.map((block, index) => (
        <BlockRenderer key={index} block={block} />
      ))}
    </div>
  );
}

export { EditorJsRenderer };
