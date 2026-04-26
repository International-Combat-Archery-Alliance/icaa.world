import type { InlineTool, SanitizerConfig, API } from '@editorjs/editorjs';
import type { InlineToolConstructorOptions } from '@editorjs/editorjs/types/tools/inline-tool';

const icon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.5 12H6.5M17.5 12c.8 0 1.5.7 1.5 1.5v0c0 1.4-1.1 2.5-2.5 2.5h-4.3c-.8 0-1.5-.3-2.1-.9L6 13M6.5 12C5.7 12 5 11.3 5 10.5v0c0-1.4 1.1-2.5 2.5-2.5h4.3c.8 0 1.5.3 2.1.9L16 11"/></svg>';

export default class Strikethrough implements InlineTool {
  private button: HTMLButtonElement | null = null;
  private tag = 'S';
  private api: API;

  static get CSS(): string {
    return 'cdx-strikethrough';
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
      Strikethrough.CSS,
    );
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  wrap(range: Range): void {
    const el = document.createElement(this.tag);
    el.classList.add(Strikethrough.CSS);
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
    const termTag = this.api.selection.findParentTag(
      this.tag,
      Strikethrough.CSS,
    );
    this.button?.classList.toggle(
      this.api.styles.inlineToolButtonActive,
      !!termTag,
    );
    return !!termTag;
  }

  static get sanitize(): SanitizerConfig {
    return {
      s: {
        class: Strikethrough.CSS,
      },
    };
  }
}
