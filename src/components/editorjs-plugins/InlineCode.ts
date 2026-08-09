import type { InlineTool, SanitizerConfig, API } from '@editorjs/editorjs';
import type { InlineToolConstructorOptions } from '@editorjs/editorjs/types/tools/inline-tool';

const icon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 18l-6-6 6-6M16 6l6 6-6 6"/></svg>';

export default class InlineCode implements InlineTool {
  private button: HTMLButtonElement | null = null;
  private tag = 'CODE';
  private api: API;

  static get CSS(): string {
    return 'cdx-inline-code';
  }

  constructor(options: InlineToolConstructorOptions) {
    this.api = options.api;
  }

  static isInline: boolean = true;

  render(): HTMLElement {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.classList.add(this.api.styles.inlineToolButton);
    this.button.innerHTML = icon;
    return this.button;
  }

  surround(range: Range): void {
    if (!range) return;
    const termWrapper = this.api.selection.findParentTag(
      this.tag,
      InlineCode.CSS,
    );
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  wrap(range: Range): void {
    const el = document.createElement(this.tag);
    el.classList.add(InlineCode.CSS);
    el.appendChild(range.extractContents());
    range.insertNode(el);
    this.api.selection.expandToTag(el);
  }

  unwrap(termWrapper: HTMLElement): void {
    this.api.selection.expandToTag(termWrapper);
    const sel = window.getSelection();
    if (!sel) return;
    const range = sel.getRangeAt(0);
    if (!range) return;
    const unwrappedContent = range.extractContents();
    if (unwrappedContent) {
      termWrapper.parentNode?.removeChild(termWrapper);
      range.insertNode(unwrappedContent);
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }

  checkState(): boolean {
    const termTag = this.api.selection.findParentTag(this.tag, InlineCode.CSS);
    this.button?.classList.toggle(
      this.api.styles.inlineToolButtonActive,
      !!termTag,
    );
    return !!termTag;
  }

  static get sanitize(): SanitizerConfig {
    return {
      code: {
        class: InlineCode.CSS,
      },
    };
  }
}
