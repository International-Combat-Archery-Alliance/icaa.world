import Embed from '@editorjs/embed';
import type { components } from '@/api/events-v1';

if (!Embed.services || Object.keys(Embed.services).length === 0) {
  Embed.prepare({ config: {} });
}

type EventMediaIcon = components['schemas']['EventMediaIcon'];
type EventMediaItem = components['schemas']['EventMediaItem'];

interface EmbedBlockData {
  service: string;
  source: string;
  embed: string;
  width?: number;
  height?: number;
}

interface EventMediaEmbedOptions {
  parentHost?: string;
}

interface YouTubeVideo {
  kind: 'video';
  videoId: string;
  playlistId?: string;
}

interface YouTubePlaylist {
  kind: 'playlist';
  playlistId: string;
}

type YouTubeTarget = YouTubeVideo | YouTubePlaylist;

interface TwitchTarget {
  kind: 'video' | 'clip' | 'channel';
  id: string;
}

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'youtu.be']);
const TWITCH_HOSTS = new Set(['twitch.tv', 'www.twitch.tv', 'clips.twitch.tv']);
const GOOGLE_DRIVE_HOSTS = new Set(['drive.google.com', 'docs.google.com']);
const INSTAGRAM_HOSTS = new Set(['instagram.com', 'www.instagram.com']);

const YOUTUBE_VIDEO_ID = /^[A-Za-z0-9_-]{6,64}$/;
const YOUTUBE_PLAYLIST_ID = /^[A-Za-z0-9_-]{6,128}$/;
const TWITCH_VIDEO_ID = /^\d+$/;
const TWITCH_CHANNEL = /^[a-zA-Z0-9_]{2,25}$/;
const TWITCH_CLIP_SLUG = /^[A-Za-z0-9_-]{2,100}$/;
const PDF_PATH = /\.pdf$/i;

const TWITCH_RESERVED_PATHS = new Set([
  'about',
  'clip',
  'clips',
  'collections',
  'directory',
  'downloads',
  'embed',
  'events',
  'friends',
  'inventory',
  'jobs',
  'login',
  'logout',
  'messages',
  'moderator',
  'p',
  'popout',
  'prime',
  'schedule',
  'search',
  'settings',
  'signup',
  'subscriptions',
  'teams',
  'turbo',
  'user',
  'videos',
  'wallet',
]);

const YOUTUBE_EMBED_SIZE = { width: 560, height: 315 };
const TWITCH_EMBED_SIZE = { width: 620, height: 378 };

function parseAbsoluteHttpUrl(raw: string): URL | null {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (url.hostname === '') return null;
  return url;
}

function hasCredentials(url: URL): boolean {
  return url.username !== '' || url.password !== '';
}

function parseProviderUrl(raw: string): URL | null {
  const url = parseAbsoluteHttpUrl(raw);
  if (!url || hasCredentials(url) || url.port !== '') return null;
  return url;
}

function pathSegments(url: URL): string[] {
  return url.pathname.split('/').filter((segment) => segment !== '');
}

function isValidPlaylistId(value: string | null): value is string {
  return value !== null && YOUTUBE_PLAYLIST_ID.test(value);
}

function toYouTubeTarget(
  videoId: string | null,
  listParam: string | null,
): YouTubeTarget | null {
  if (videoId === null || !YOUTUBE_VIDEO_ID.test(videoId)) return null;
  if (listParam === null) return { kind: 'video', videoId };
  if (!isValidPlaylistId(listParam)) return null;
  return { kind: 'video', videoId, playlistId: listParam };
}

function parseYouTubeUrl(raw: string): YouTubeTarget | null {
  const url = parseProviderUrl(raw);
  if (!url) return null;
  if (!YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null;

  const segments = pathSegments(url);
  const listParam = url.searchParams.get('list');

  if (url.hostname.toLowerCase() === 'youtu.be') {
    if (segments.length !== 1) return null;
    return toYouTubeTarget(segments[0], listParam);
  }

  if (segments.length === 1 && segments[0] === 'watch') {
    return toYouTubeTarget(url.searchParams.get('v'), listParam);
  }

  if (
    segments.length === 2 &&
    (segments[0] === 'shorts' || segments[0] === 'live')
  ) {
    return toYouTubeTarget(segments[1], null);
  }

  if (segments.length === 1 && segments[0] === 'playlist') {
    if (!isValidPlaylistId(listParam)) return null;
    return { kind: 'playlist', playlistId: listParam };
  }

  return null;
}

function isTwitchChannel(segment: string): boolean {
  if (!TWITCH_CHANNEL.test(segment)) return false;
  if (segment.startsWith('_')) return false;
  return !TWITCH_RESERVED_PATHS.has(segment.toLowerCase());
}

function parseTwitchUrl(raw: string): TwitchTarget | null {
  const url = parseProviderUrl(raw);
  if (!url) return null;

  const host = url.hostname.toLowerCase();
  if (!TWITCH_HOSTS.has(host)) return null;

  const segments = pathSegments(url);

  if (host === 'clips.twitch.tv') {
    if (segments.length !== 1) return null;
    const slug = segments[0];
    if (slug.toLowerCase() === 'embed' || !TWITCH_CLIP_SLUG.test(slug))
      return null;
    return { kind: 'clip', id: slug };
  }

  if (segments.length === 2 && segments[0] === 'videos') {
    const id = segments[1].replace(/^v/, '');
    return TWITCH_VIDEO_ID.test(id) ? { kind: 'video', id } : null;
  }

  if (segments.length === 3 && segments[1] === 'clip') {
    const [channel, , slug] = segments;
    if (!isTwitchChannel(channel) || !TWITCH_CLIP_SLUG.test(slug)) return null;
    return { kind: 'clip', id: slug };
  }

  if (segments.length === 1 && isTwitchChannel(segments[0])) {
    return { kind: 'channel', id: segments[0] };
  }

  return null;
}

function buildYouTubeEmbedUrl(target: YouTubeTarget): string {
  if (target.kind === 'playlist') {
    const query = new URLSearchParams({ list: target.playlistId }).toString();
    return `https://www.youtube.com/embed/videoseries?${query}`;
  }

  const base = `https://www.youtube.com/embed/${target.videoId}`;
  if (!target.playlistId) return base;
  return `${base}?${new URLSearchParams({ list: target.playlistId }).toString()}`;
}

function resolveTwitchParent(parentHost?: string): string {
  if (parentHost) return parentHost;
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return window.location.hostname;
  }
  return 'localhost';
}

function buildTwitchEmbedUrl(
  target: TwitchTarget,
  parentHost?: string,
): string {
  const parent = resolveTwitchParent(parentHost);

  if (target.kind === 'clip') {
    const query = new URLSearchParams({
      clip: target.id,
      parent,
      autoplay: 'false',
    }).toString();
    return `https://clips.twitch.tv/embed?${query}`;
  }

  const query = new URLSearchParams({
    ...(target.kind === 'video'
      ? { video: `v${target.id}` }
      : { channel: target.id }),
    parent,
    autoplay: 'false',
  }).toString();
  return `https://player.twitch.tv/?${query}`;
}

function detectEmbedFromUrl(url: string): EmbedBlockData | null {
  if (!Embed.patterns) return null;

  for (const [serviceName, regex] of Object.entries(Embed.patterns)) {
    if (!regex) continue;
    const match = regex.exec(url);
    if (match && match[0].length > 0) {
      const groups = match.slice(1);
      if (groups.every((g) => g === undefined)) continue;

      const serviceConfig = Embed.services[serviceName];
      const id = serviceConfig.id
        ? serviceConfig.id(groups)
        : (groups.shift() ?? '');
      const embedUrl = serviceConfig.embedUrl.replace(/<%= remote_id %>/g, id);
      return {
        service: serviceName,
        source: url,
        embed: embedUrl,
        width: serviceConfig.width,
        height: serviceConfig.height,
      };
    }
  }

  return null;
}

function isPdfUrl(url: string): boolean {
  const parsed = parseAbsoluteHttpUrl(url);
  return parsed !== null && PDF_PATH.test(parsed.pathname);
}

function buildPdfEmbedData(url: string): EmbedBlockData {
  const query = new URLSearchParams({ embedded: 'true', url }).toString();
  return {
    service: 'google-drive-viewer',
    source: url,
    embed: `https://drive.google.com/viewerng/viewer?${query}`,
    width: 600,
    height: 600,
  };
}

function buildGenericEmbedData(url: string): EmbedBlockData | null {
  const parsed = parseAbsoluteHttpUrl(url);
  if (!parsed || hasCredentials(parsed)) return null;

  return {
    service: 'generic',
    source: url,
    embed: url,
    width: 600,
    height: 400,
  };
}

function buildEventMediaEmbedData(
  url: string,
  options: EventMediaEmbedOptions = {},
): EmbedBlockData | null {
  const youtubeTarget = parseYouTubeUrl(url);
  if (youtubeTarget) {
    return {
      service: 'youtube',
      source: url,
      embed: buildYouTubeEmbedUrl(youtubeTarget),
      ...YOUTUBE_EMBED_SIZE,
    };
  }

  const twitchTarget = parseTwitchUrl(url);
  if (twitchTarget) {
    return {
      service: 'twitch',
      source: url,
      embed: buildTwitchEmbedUrl(twitchTarget, options.parentHost),
      ...TWITCH_EMBED_SIZE,
    };
  }

  return null;
}

function buildEmbedData(url: string): EmbedBlockData | null {
  const providerEmbed = buildEventMediaEmbedData(url);
  if (providerEmbed) return providerEmbed;

  const parsed = parseAbsoluteHttpUrl(url);
  if (parsed) {
    const host = parsed.hostname.toLowerCase();
    if (YOUTUBE_HOSTS.has(host) || TWITCH_HOSTS.has(host)) return null;
  }

  const detected = detectEmbedFromUrl(url);
  if (detected) return detected;
  if (isPdfUrl(url)) return buildPdfEmbedData(url);
  return buildGenericEmbedData(url);
}

function resolveMediaIcon(
  item: Pick<EventMediaItem, 'type' | 'source' | 'icon'>,
): EventMediaIcon {
  if (item.icon !== undefined) return item.icon;

  const parsed = parseAbsoluteHttpUrl(item.source);
  if (parsed) {
    const host = parsed.hostname.toLowerCase();
    if (YOUTUBE_HOSTS.has(host)) return 'youtube';
    if (TWITCH_HOSTS.has(host)) return 'twitch';
    if (GOOGLE_DRIVE_HOSTS.has(host)) return 'google_drive';
    if (INSTAGRAM_HOSTS.has(host)) return 'instagram';
    if (PDF_PATH.test(parsed.pathname)) return 'pdf';
  }

  switch (item.type) {
    case 'asset_folder':
      return 'photo_gallery';
    case 'asset_file':
      return 'file';
    case 'video':
      return 'video';
    case 'external_link':
      return 'external_link';
  }
}

export {
  buildEmbedData,
  buildEventMediaEmbedData,
  parseTwitchUrl,
  parseYouTubeUrl,
  resolveMediaIcon,
  type EmbedBlockData,
  type EventMediaEmbedOptions,
  type TwitchTarget,
  type YouTubeTarget,
};
