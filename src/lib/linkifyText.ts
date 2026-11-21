import { parseSafeHttpUrl } from '@/lib/embedUtils';

export interface TextPlainSegment {
  kind: 'text';
  text: string;
}

export interface TextLinkSegment {
  kind: 'link';
  url: string;
  label: string;
  service?: 'instagram';
}

export type TextSegment = TextPlainSegment | TextLinkSegment;

const URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<>"'`]+/gi;
const TRAILING_PUNCTUATION = /[.,;:!?)\]}"']+$/;
const INSTAGRAM_HANDLE = /^[A-Za-z0-9._]{1,30}$/;

// Paths that are not profile handles, e.g. instagram.com/p/<id>.
const INSTAGRAM_RESERVED_SEGMENTS = new Set([
  'about',
  'accounts',
  'challenge',
  'developer',
  'directory',
  'emails',
  'explore',
  'legal',
  'p',
  'reel',
  'reels',
  'session',
  'stories',
  'topics',
  'tv',
]);

const INSTAGRAM_HOSTNAMES = new Set(['instagram.com', 'www.instagram.com']);

function isInstagramUrl(url: URL): boolean {
  return INSTAGRAM_HOSTNAMES.has(url.hostname.toLowerCase());
}

function instagramHandle(url: URL): string | null {
  if (!isInstagramUrl(url)) return null;

  const [segment] = url.pathname.split('/').filter(Boolean);
  if (!segment || INSTAGRAM_RESERVED_SEGMENTS.has(segment.toLowerCase())) {
    return null;
  }

  return INSTAGRAM_HANDLE.test(segment) ? segment : null;
}

function toLinkSegment(raw: string): TextLinkSegment | null {
  const url = parseSafeHttpUrl(
    raw.toLowerCase().startsWith('www.') ? `https://${raw}` : raw,
  );
  if (!url) return null;

  if (isInstagramUrl(url)) {
    const handle = instagramHandle(url);
    return {
      kind: 'link',
      url: url.href,
      label: handle ? `@${handle}` : 'Instagram',
      service: 'instagram',
    };
  }

  return { kind: 'link', url: url.href, label: raw };
}

export function linkifyText(text: string): TextSegment[] {
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(URL_PATTERN)) {
    const raw = match[0].replace(TRAILING_PUNCTUATION, '');
    const startIndex = match.index;
    if (raw === '' || startIndex === undefined) continue;

    // Skip URLs glued to other text, such as an email address containing www.
    const precedingChar = startIndex > 0 ? text[startIndex - 1] : '';
    if (precedingChar !== '' && /[\w@/.-]/.test(precedingChar)) continue;

    const link = toLinkSegment(raw);
    if (!link) continue;

    const endIndex = startIndex + raw.length;
    if (startIndex > lastIndex) {
      segments.push({ kind: 'text', text: text.slice(lastIndex, startIndex) });
    }
    segments.push(link);
    lastIndex = endIndex;
  }

  if (lastIndex < text.length) {
    segments.push({ kind: 'text', text: text.slice(lastIndex) });
  }

  return segments;
}
