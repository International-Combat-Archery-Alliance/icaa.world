import type { API, BlockAPI, BlockTune } from '@editorjs/editorjs';

type EmbedSize = 'small' | 'medium' | 'large' | 'fill';

const SIZES: { key: EmbedSize; label: string; width: string }[] = [
  { key: 'small', label: 'Small', width: '400px' },
  { key: 'medium', label: 'Medium', width: '600px' },
  { key: 'large', label: 'Large', width: '900px' },
  { key: 'fill', label: 'Fill width', width: '100%' },
];

export default class EmbedSizeTune implements BlockTune {
  static isTune = true;

  private api: API;
  private block: BlockAPI;
  private _size: EmbedSize;

  constructor({
    api,
    block,
    data,
  }: {
    api: API;
    block: BlockAPI;
    data?: { size: EmbedSize };
  }) {
    this.api = api;
    this.block = block;
    this._size = data?.size ?? 'medium';
  }

  render() {
    return {
      name: 'embed-size',
      title: 'Size',
      icon: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 5h3m6 0h3M2 8h12M2 11h3m6 0h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M5 5v6M11 5v6" stroke="currentColor" stroke-width="1.5"/></svg>`,
      children: {
        items: SIZES.map((s) => ({
          name: `size-${s.key}`,
          title: s.label,
          isActive: this._size === s.key,
          closeOnActivate: true,
          onActivate: () => {
            this._size = s.key;
            this._applySize(s.width);
            this.block.dispatchChange();
          },
        })),
      },
    };
  }

  wrap(pluginsContent: HTMLElement): HTMLElement {
    const cfg = SIZES.find((s) => s.key === this._size);
    if (cfg) this._applySizeOnElement(pluginsContent, cfg.width);
    return pluginsContent;
  }

  save(): { size: EmbedSize } {
    return { size: this._size };
  }

  private _applySize(width: string): void {
    const holder = this.block.holder;
    if (holder) {
      const iframe = holder.querySelector('iframe') as HTMLElement | null;
      if (iframe) {
        this._setIframeWidth(iframe, width);
      }
    }
  }

  private _applySizeOnElement(el: HTMLElement, width: string): void {
    const iframe = el.querySelector('iframe') as HTMLElement | null;
    if (iframe) {
      this._setIframeWidth(iframe, width);
    }
  }

  private _setIframeWidth(iframe: HTMLElement, width: string): void {
    iframe.style.width = width;
    iframe.style.maxWidth = width;
  }
}
