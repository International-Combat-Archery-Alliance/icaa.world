import { describe, expect, it } from 'bun:test';
import { buildEmbedData } from '@/lib/editorEmbedUtils';

const YOUTUBE_WATCH = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

describe('buildEmbedData', () => {
  it('recognizes YouTube and Twitch URLs before falling back', () => {
    expect(buildEmbedData(YOUTUBE_WATCH)?.service).toBe('youtube');
    expect(
      buildEmbedData('https://www.twitch.tv/videos/987654321')?.service,
    ).toBe('twitch-channel');
  });

  it('uses a service key that @editorjs/embed can render', () => {
    const embed = buildEmbedData('https://www.twitch.tv/videos/987654321');
    expect(embed?.service).not.toBe('twitch');
    expect(embed?.embed).toBe(
      'https://player.twitch.tv/?video=v987654321&parent=localhost&autoplay=false',
    );
  });

  it('does not return a data: embed URL from detector services', () => {
    const embed = buildEmbedData('https://gist.github.com/someone/abc123');
    expect(embed?.service).toBe('generic');
    expect(embed?.embed.startsWith('data:')).toBe(false);
  });

  it('embeds PDFs through the Google Drive viewer', () => {
    expect(buildEmbedData('https://example.com/bracket.pdf')).toMatchObject({
      service: 'google-drive-viewer',
      embed:
        'https://drive.google.com/viewerng/viewer?embedded=true&url=https%3A%2F%2Fexample.com%2Fbracket.pdf',
      width: 600,
      height: 600,
    });
  });

  it('encodes PDF sources as a single query parameter', () => {
    const embed = buildEmbedData('https://example.com/bracket.pdf?v=2&x=a b');
    expect(embed?.service).toBe('google-drive-viewer');
    expect(embed?.embed).toBe(
      'https://drive.google.com/viewerng/viewer?embedded=true&url=https%3A%2F%2Fexample.com%2Fbracket.pdf%3Fv%3D2%26x%3Da+b',
    );
  });

  it('does not treat .pdf in the query string as a PDF', () => {
    expect(
      buildEmbedData('https://example.com/search?file=bracket.pdf')?.service,
    ).toBe('generic');
  });

  it('does not treat a .pdf suffix on another extension as a PDF', () => {
    expect(buildEmbedData('https://example.com/bracket.pdf.exe')?.service).toBe(
      'generic',
    );
  });

  it('keeps the generic embed for absolute http(s) URLs', () => {
    expect(buildEmbedData('https://example.com/page')?.embed).toBe(
      'https://example.com/page',
    );
    expect(buildEmbedData('http://localhost:3000/page')?.embed).toBe(
      'http://localhost:3000/page',
    );
  });

  it.each([
    'javascript:alert(1)',
    'javascript:alert(1)//https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'data:text/html,<script>alert(1)</script>',
    'data:text/html,https://www.reddit.com/r/archery',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    'https://user:pass@example.com/page',
    'https://user:pass@example.com/bracket.pdf',
    'not a url',
    '',
  ])('rejects %s', (url) => {
    expect(buildEmbedData(url)).toBeNull();
  });

  it('does not fall back to a generic iframe for unsupported provider URLs', () => {
    expect(buildEmbedData('https://www.twitch.tv/collections/123')).toBeNull();
    expect(buildEmbedData('https://www.youtube.com/@Icaa-world')).toBeNull();
  });
});
