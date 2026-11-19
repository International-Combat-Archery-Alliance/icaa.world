import { cn } from '@/lib/utils';

interface PdfEmbedProps {
  src: string;
  title: string;
  className?: string;
}

function PdfEmbed({ src, title, className }: PdfEmbedProps) {
  return (
    <iframe
      src={src}
      title={title}
      className={cn('w-full rounded-xl border-0 bg-white', className)}
      // oxlint-disable-next-line react/iframe-missing-sandbox
      sandbox="allow-scripts allow-same-origin allow-popups"
    />
  );
}

export { PdfEmbed };
