import Embed from '@editorjs/embed';

if (!Embed.services || Object.keys(Embed.services).length === 0) {
  Embed.prepare({ config: {} });
}

interface EmbedBlockData {
  service: string;
  source: string;
  embed: string;
  width?: number;
  height?: number;
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
  try {
    const u = new URL(url);
    return /\.pdf(\?.*)?$/i.test(u.pathname);
  } catch {
    return false;
  }
}

function buildPdfEmbedData(url: string): EmbedBlockData {
  const encodedUrl = encodeURIComponent(url);
  return {
    service: 'google-drive-viewer',
    source: url,
    embed: `https://drive.google.com/viewerng/viewer?embedded=true&url=${encodedUrl}`,
    width: 600,
    height: 600,
  };
}

function buildGenericEmbedData(url: string): EmbedBlockData | null {
  try {
    new URL(url);
  } catch {
    return null;
  }

  return {
    service: 'generic',
    source: url,
    embed: url,
    width: 600,
    height: 400,
  };
}

function buildEmbedData(url: string): EmbedBlockData | null {
  const detected = detectEmbedFromUrl(url);
  if (detected) return detected;
  if (isPdfUrl(url)) return buildPdfEmbedData(url);
  return buildGenericEmbedData(url);
}

export { buildEmbedData, type EmbedBlockData };
