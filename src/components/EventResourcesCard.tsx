import { useState } from 'react';
import { AssetImage } from '@/components/AssetImage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventMediaIconView } from '@/components/EventMediaIconView';
import { LinkifiedText } from '@/components/LinkifiedText';
import { PdfEmbed } from '@/components/PdfEmbed';
import {
  resolveMediaRender,
  type EventMediaItem,
  type EventMediaRender,
} from '@/lib/eventMediaGrouping';

interface EventResourcesCardProps {
  items: EventMediaItem[];
}

interface ResourceEntry {
  item: EventMediaItem;
  render: Extract<EventMediaRender, { section: 'resources' }>;
}

function resourceLabel(item: EventMediaItem, url: string): string {
  if (item.title) return item.title;

  const parsed = new URL(url);
  const fileName = parsed.pathname.split('/').filter(Boolean).pop();

  if (item.type === 'asset_file' && fileName) return fileName;
  return parsed.hostname;
}

function ResourceLinkRow({ item, url }: { item: EventMediaItem; url: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <EventMediaIconView item={item} className="text-muted-foreground mt-1" />
      <div className="min-w-0 flex-1">
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium underline-offset-4 hover:underline"
        >
          {resourceLabel(item, url)}
        </a>
        {item.description && (
          <LinkifiedText
            text={item.description}
            className="text-muted-foreground mt-1 block text-sm"
          />
        )}
      </div>
    </div>
  );
}

function EventResourcesCard({ items }: EventResourcesCardProps) {
  const [failedImages, setFailedImages] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const entries = items
    .map((item) => ({ item, render: resolveMediaRender(item) }))
    .filter(
      (entry): entry is ResourceEntry => entry.render.section === 'resources',
    );

  if (entries.length === 0) return null;

  const markImageFailed = (itemId: string) => {
    setFailedImages((previous) => new Set(previous).add(itemId));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Resources &amp; Files</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {entries.map(({ item, render }) => {
          if (render.mode === 'image') {
            if (failedImages.has(item.id)) {
              return (
                <ResourceLinkRow key={item.id} item={item} url={render.url} />
              );
            }

            return (
              <figure key={item.id} className="space-y-2">
                <AssetImage
                  src={render.url}
                  alt={item.title || 'Event resource'}
                  imageWidth={960}
                  imageFit="scale-down"
                  imageQuality={90}
                  className="w-full rounded-lg"
                  onError={() => markImageFailed(item.id)}
                />
                {(item.title || item.description) && (
                  <figcaption className="space-y-1">
                    {item.title && (
                      <p className="text-sm font-medium">{item.title}</p>
                    )}
                    {item.description && (
                      <LinkifiedText
                        text={item.description}
                        className="text-muted-foreground block text-sm"
                      />
                    )}
                  </figcaption>
                )}
              </figure>
            );
          }

          if (render.mode === 'pdf') {
            return (
              <div key={item.id} className="space-y-2">
                <PdfEmbed
                  src={render.embedData.embed}
                  title={item.title || 'Event Document'}
                  className="h-[70vh]"
                />
                {(item.title || item.description) && (
                  <div className="space-y-1">
                    {item.title && (
                      <p className="text-sm font-medium">{item.title}</p>
                    )}
                    {item.description && (
                      <LinkifiedText
                        text={item.description}
                        className="text-muted-foreground block text-sm"
                      />
                    )}
                  </div>
                )}
              </div>
            );
          }

          return <ResourceLinkRow key={item.id} item={item} url={render.url} />;
        })}
      </CardContent>
    </Card>
  );
}

export { EventResourcesCard };
