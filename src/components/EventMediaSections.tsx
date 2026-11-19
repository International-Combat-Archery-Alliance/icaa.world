import { EventFolderCard } from '@/components/EventFolderCard';
import { EventResourcesCard } from '@/components/EventResourcesCard';
import { EventVideosCard } from '@/components/EventVideosCard';
import type { Event } from '@/hooks/useEvent';
import { groupEventMediaItems } from '@/lib/eventMediaGrouping';

interface EventMediaSectionsProps {
  event: Event;
}

function EventMediaSections({ event }: EventMediaSectionsProps) {
  const { videoItems, folderItems, resourceItems } = groupEventMediaItems(
    event.media ?? [],
  );

  return (
    <>
      <EventVideosCard videoItems={videoItems} />
      {folderItems.map((folder) => (
        <EventFolderCard key={folder.id} item={folder} />
      ))}
      {resourceItems.length > 0 && <EventResourcesCard items={resourceItems} />}
    </>
  );
}

export { EventMediaSections };
