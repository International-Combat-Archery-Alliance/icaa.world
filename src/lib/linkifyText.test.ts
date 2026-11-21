import { describe, expect, it } from 'bun:test';
import { linkifyText } from '@/lib/linkifyText';

describe('linkifyText', () => {
  it('returns plain text as a single segment', () => {
    expect(linkifyText('Photos taken by Vikram')).toEqual([
      { kind: 'text', text: 'Photos taken by Vikram' },
    ]);
  });

  it('returns no segments for empty text', () => {
    expect(linkifyText('')).toEqual([]);
  });

  it('links an https URL and keeps surrounding text', () => {
    expect(linkifyText('Photos by https://example.com/gallery enjoy')).toEqual([
      { kind: 'text', text: 'Photos by ' },
      {
        kind: 'link',
        url: 'https://example.com/gallery',
        label: 'https://example.com/gallery',
      },
      { kind: 'text', text: ' enjoy' },
    ]);
  });

  it('preserves newlines around links', () => {
    expect(linkifyText('Line one\nhttps://example.com\nLine three')).toEqual([
      { kind: 'text', text: 'Line one\n' },
      {
        kind: 'link',
        url: 'https://example.com/',
        label: 'https://example.com',
      },
      { kind: 'text', text: '\nLine three' },
    ]);
  });

  it('leaves sentence punctuation out of the link', () => {
    expect(linkifyText('See https://example.com/gallery.')).toEqual([
      { kind: 'text', text: 'See ' },
      {
        kind: 'link',
        url: 'https://example.com/gallery',
        label: 'https://example.com/gallery',
      },
      { kind: 'text', text: '.' },
    ]);
  });

  it('links www URLs over https', () => {
    expect(linkifyText('www.example.com')).toEqual([
      {
        kind: 'link',
        url: 'https://www.example.com/',
        label: 'www.example.com',
      },
    ]);
  });

  it('links multiple URLs', () => {
    expect(linkifyText('https://one.example and https://two.example')).toEqual([
      {
        kind: 'link',
        url: 'https://one.example/',
        label: 'https://one.example',
      },
      { kind: 'text', text: ' and ' },
      {
        kind: 'link',
        url: 'https://two.example/',
        label: 'https://two.example',
      },
    ]);
  });

  it('shows an Instagram profile as the @handle', () => {
    expect(
      linkifyText(
        'Photos taken by Vikram\nhttps://www.instagram.com/crimsonclicks.photo?exln=abc',
      ),
    ).toEqual([
      { kind: 'text', text: 'Photos taken by Vikram\n' },
      {
        kind: 'link',
        url: 'https://www.instagram.com/crimsonclicks.photo?exln=abc',
        label: '@crimsonclicks.photo',
        service: 'instagram',
      },
    ]);
  });

  it('shows a bare Instagram profile with a trailing slash', () => {
    expect(linkifyText('https://instagram.com/icaa.world/')).toEqual([
      {
        kind: 'link',
        url: 'https://instagram.com/icaa.world/',
        label: '@icaa.world',
        service: 'instagram',
      },
    ]);
  });

  it('labels Instagram post links without a handle', () => {
    expect(linkifyText('https://www.instagram.com/p/Cabc123/')).toEqual([
      {
        kind: 'link',
        url: 'https://www.instagram.com/p/Cabc123/',
        label: 'Instagram',
        service: 'instagram',
      },
    ]);
  });

  it('does not link URLs with credentials', () => {
    const text = 'https://user:pass@example.com/gallery';
    expect(linkifyText(text)).toEqual([{ kind: 'text', text }]);
  });

  it('does not link URLs embedded in other text', () => {
    expect(linkifyText('me@www.example.com')).toEqual([
      { kind: 'text', text: 'me@www.example.com' },
    ]);
  });
});
