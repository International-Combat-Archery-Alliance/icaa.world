import { useMemo } from 'react';
import { FaInstagram } from 'react-icons/fa';
import { linkifyText } from '@/lib/linkifyText';
import { cn } from '@/lib/utils';

interface LinkifiedTextProps {
  text: string;
  className?: string;
}

// Renders plain text with clickable URLs, preserving line breaks. Instagram
// links are shown as an icon plus the @handle instead of the raw URL.
function LinkifiedText({ text, className }: LinkifiedTextProps) {
  const segments = useMemo(() => linkifyText(text), [text]);

  return (
    <span className={cn('whitespace-pre-line', className)}>
      {segments.map((segment, index) =>
        segment.kind === 'text' ? (
          <span key={index}>{segment.text}</span>
        ) : (
          <a
            key={index}
            href={segment.url}
            target="_blank"
            rel="noreferrer noopener"
            className="text-primary decoration-primary/40 hover:decoration-primary font-medium break-words underline underline-offset-4"
          >
            {segment.service === 'instagram' && (
              <FaInstagram
                aria-hidden="true"
                className="mr-1 inline size-[1em] align-[-0.125em]"
              />
            )}
            {segment.label}
          </a>
        ),
      )}
    </span>
  );
}

export { LinkifiedText };
