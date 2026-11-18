import { useState } from 'react';
import { FaTwitch } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventMediaIconView } from '@/components/EventMediaIconView';
import type { EventMediaEmbedData } from '@/lib/embedUtils';
import {
  resolveMediaRender,
  type EventMediaItem,
} from '@/lib/eventMediaGrouping';
import { cn } from '@/lib/utils';

const ICAA_TWITCH_URL = 'https://www.twitch.tv/icaa_world';
const ICAA_YOUTUBE_URL = 'https://www.youtube.com/@Icaa-world/streams';

interface EventVideosCardProps {
  videoItems: EventMediaItem[];
}

interface EmbeddableVideo {
  item: EventMediaItem;
  embedData: EventMediaEmbedData;
}

interface LinkedVideo {
  item: EventMediaItem;
  url: string;
}

function DefaultLivestreamCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Livestream Links</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-center gap-4 p-6 sm:flex-row">
        <Button asChild>
          <a href={ICAA_TWITCH_URL} target="_blank" rel="noreferrer noopener">
            <EventMediaIconView
              item={{ type: 'video', source: ICAA_TWITCH_URL }}
              className="mr-2"
            />
            Watch on Twitch!
          </a>
        </Button>
        <Button asChild>
          <a href={ICAA_YOUTUBE_URL} target="_blank" rel="noreferrer noopener">
            <EventMediaIconView
              item={{ type: 'video', source: ICAA_YOUTUBE_URL }}
              className="mr-2"
            />
            Watch on YouTube!
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

function EventVideosCard({ videoItems }: EventVideosCardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  if (videoItems.length === 0) {
    return <DefaultLivestreamCard />;
  }

  const embeddableVideos: EmbeddableVideo[] = [];
  const linkedVideos: LinkedVideo[] = [];

  for (const item of videoItems) {
    const render = resolveMediaRender(item);

    if (render.section === 'videos' && render.mode === 'embed') {
      embeddableVideos.push({ item, embedData: render.embedData });
    } else if (render.section === 'videos' && render.mode === 'link') {
      linkedVideos.push({ item, url: render.url });
    }
  }

  const activeVideo =
    embeddableVideos.find((video) => video.item.id === activeId) ??
    embeddableVideos[0];
  const isTwitchPlayer = activeVideo?.embedData.service === 'twitch';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Videos &amp; Livestreams</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeVideo && (
          <div
            className={cn(
              'grid gap-4',
              embeddableVideos.length > 1 &&
                'lg:grid-cols-[minmax(0,1fr)_18rem]',
            )}
          >
            <div className="relative aspect-video min-h-[300px] w-full overflow-hidden rounded-xl bg-black">
              {isTwitchPlayer && (
                <a
                  href={activeVideo.item.source}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm font-medium text-white min-[400px]:hidden"
                >
                  <FaTwitch aria-hidden="true" className="size-8" />
                  Watch on Twitch
                </a>
              )}
              <iframe
                key={activeVideo.item.id}
                src={activeVideo.embedData.embed}
                title={activeVideo.item.title || 'Event video player'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                // oxlint-disable-next-line react/iframe-missing-sandbox
                sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
                className={cn(
                  'h-full w-full border-0',
                  isTwitchPlayer && 'hidden min-[400px]:block',
                )}
              />
            </div>
            {embeddableVideos.length > 1 && (
              <ul className="flex flex-col gap-2">
                {embeddableVideos.map(({ item }) => {
                  const isActive = item.id === activeVideo.item.id;

                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        aria-pressed={isActive}
                        onClick={() => setActiveId(item.id)}
                        className={cn(
                          'flex w-full items-start gap-2 rounded-lg border p-3 text-left transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                          isActive && 'bg-accent border-primary',
                        )}
                      >
                        <EventMediaIconView item={item} className="mt-0.5" />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">
                            {item.title || 'Event video'}
                          </span>
                          {item.description && (
                            <span className="text-muted-foreground mt-1 block text-xs">
                              {item.description}
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
        {linkedVideos.length > 0 && (
          <div className="flex flex-wrap gap-2 border-t pt-4">
            {linkedVideos.map(({ item, url }) => (
              <Button key={item.id} variant="outline" asChild>
                <a href={url} target="_blank" rel="noreferrer noopener">
                  <EventMediaIconView item={item} className="mr-2" />
                  {item.title || 'Watch video'}
                </a>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export { EventVideosCard };
