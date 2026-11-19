import {
  FaFilePdf,
  FaGoogleDrive,
  FaInstagram,
  FaTwitch,
  FaYoutube,
} from 'react-icons/fa';
import { ExternalLink, File, Images, Video } from 'lucide-react';
import type { EventMediaItem } from '@/api/events';
import { resolveMediaIcon } from '@/lib/embedUtils';
import { cn } from '@/lib/utils';

interface EventMediaIconViewProps {
  item: Pick<EventMediaItem, 'type' | 'source' | 'icon'>;
  className?: string;
}

const DEFAULT_ICON_CLASS = 'size-4 shrink-0';

function EventMediaIconView({ item, className }: EventMediaIconViewProps) {
  const iconClassName = cn(DEFAULT_ICON_CLASS, className);
  const iconProps = { className: iconClassName, 'aria-hidden': true } as const;

  switch (resolveMediaIcon(item)) {
    case 'youtube':
      return <FaYoutube {...iconProps} />;
    case 'twitch':
      return <FaTwitch {...iconProps} />;
    case 'google_drive':
      return <FaGoogleDrive {...iconProps} />;
    case 'instagram':
      return <FaInstagram {...iconProps} />;
    case 'pdf':
      return <FaFilePdf {...iconProps} />;
    case 'photo_gallery':
      return <Images {...iconProps} />;
    case 'video':
      return <Video {...iconProps} />;
    case 'external_link':
      return <ExternalLink {...iconProps} />;
    case 'file':
      return <File {...iconProps} />;
  }
}

export { EventMediaIconView };
