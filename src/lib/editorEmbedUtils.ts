import Embed from '@editorjs/embed';
import {
  buildEventMediaEmbedData,
  buildPdfEmbedData,
  isMediaProviderHost,
  isPdfUrl,
  parseSafeHttpUrl,
  type EventMediaEmbedData,
} from '@/lib/embedUtils';

if (!Embed.services || Object.keys(Embed.services).length === 0) {
  Embed.prepare({ config: {} });
}

// Editor.js embed block payload. Structurally identical to an event media
// embed, but `service` must be a key that @editorjs/embed can render.
type EmbedBlockData = EventMediaEmbedData;

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
      if (!parseSafeHttpUrl(embedUrl)) continue;
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

function buildGenericEmbedData(url: string): EmbedBlockData {
  return {
    service: 'generic',
    source: url,
    embed: url,
    width: 600,
    height: 400,
  };
}

function buildEmbedData(url: string): EmbedBlockData | null {
  const parsed = parseSafeHttpUrl(url);
  if (!parsed) return null;

  const providerEmbed = buildEventMediaEmbedData(url);
  if (providerEmbed) {
    // @editorjs/embed registers twitch-channel/twitch-video, not twitch, and
    // render() looks the service up by key.
    return providerEmbed.service === 'twitch'
      ? { ...providerEmbed, service: 'twitch-channel' }
      : providerEmbed;
  }

  if (isMediaProviderHost(parsed.hostname)) return null;

  const detected = detectEmbedFromUrl(url);
  if (detected) return detected;
  if (isPdfUrl(parsed)) return buildPdfEmbedData(url);
  return buildGenericEmbedData(url);
}

export { buildEmbedData, type EmbedBlockData };
