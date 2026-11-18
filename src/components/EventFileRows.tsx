import { FaFilePdf } from 'react-icons/fa';
import { File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/assetUtils';
import type { EventFileAsset } from '@/lib/eventMediaGrouping';

interface EventFileRowsProps {
  files: EventFileAsset[];
}

function FileTypeIcon({ contentType }: { contentType: string }) {
  if (contentType.toLowerCase() === 'application/pdf') {
    return <FaFilePdf aria-hidden="true" className="size-4 shrink-0" />;
  }

  return <File aria-hidden="true" className="size-4 shrink-0" />;
}

function EventFileRows({ files }: EventFileRowsProps) {
  return (
    <ul className="divide-y rounded-lg border">
      {files.map((file) => (
        <li
          key={`${file.path}/${file.name}`}
          className="flex items-center gap-3 p-3"
        >
          <FileTypeIcon contentType={file.contentType} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            <p className="text-muted-foreground text-xs">
              {formatFileSize(file.size)}
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <a href={file.url} target="_blank" rel="noreferrer noopener">
              Open
            </a>
          </Button>
        </li>
      ))}
    </ul>
  );
}

export { EventFileRows };
