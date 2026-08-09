import type { API, BlockAPI, BlockTune, MenuConfig } from '@editorjs/editorjs';

type Alignment = 'left' | 'center' | 'right';

const ALIGN_ICONS: Record<Alignment, string> = {
  left: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 3H14M2 7H10M2 11H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  center: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 3H13M5 7H11M3 11H13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  right: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 3H14M6 7H14M2 11H14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

const ALIGNMENTS: Alignment[] = ['left', 'center', 'right'];

export default class AlignmentTune implements BlockTune {
  static isTune = true;

  private api: API;
  private block: BlockAPI;
  private _alignment: Alignment;

  constructor({
    api,
    block,
    data,
  }: {
    api: API;
    block: BlockAPI;
    data?: { alignment: Alignment };
  }) {
    this.api = api;
    this.block = block;
    this._alignment = data?.alignment || 'left';
  }

  render(): MenuConfig {
    return {
      name: 'alignment',
      title: 'Alignment',
      icon: ALIGN_ICONS.center,
      children: {
        items: ALIGNMENTS.map((align) => ({
          name: `align-${align}`,
          title: align.charAt(0).toUpperCase() + align.slice(1),
          icon: ALIGN_ICONS[align],
          isActive: this._alignment === align,
          closeOnActivate: true,
          onActivate: () => this._setAlignment(align),
        })),
      },
    };
  }

  wrap(pluginsContent: HTMLElement): HTMLElement {
    this._applyAlignment(pluginsContent, this._alignment);
    return pluginsContent;
  }

  save(): { alignment: Alignment } {
    return { alignment: this._alignment };
  }

  private _setAlignment(alignment: Alignment): void {
    this._alignment = alignment;

    const holder = this.block.holder;
    if (holder) {
      const content = holder.querySelector(
        '.ce-block__content',
      ) as HTMLElement | null;
      if (content) {
        this._applyAlignment(content, alignment);
      }
    }

    this.block.dispatchChange();
  }

  private _applyAlignment(el: HTMLElement, alignment: Alignment): void {
    el.style.textAlign = alignment;

    const imagePicture = el.querySelector(
      '.image-tool__image-picture',
    ) as HTMLElement | null;
    if (imagePicture) {
      if (alignment === 'center') {
        imagePicture.style.marginLeft = 'auto';
        imagePicture.style.marginRight = 'auto';
      } else if (alignment === 'right') {
        imagePicture.style.marginLeft = 'auto';
        imagePicture.style.marginRight = '0';
      } else {
        imagePicture.style.marginLeft = '';
        imagePicture.style.marginRight = '';
      }
    }
  }
}
