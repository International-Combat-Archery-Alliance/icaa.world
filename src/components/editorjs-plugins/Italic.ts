import type { InlineTool, SanitizerConfig, API } from '@editorjs/editorjs';
import type { InlineToolConstructorOptions } from '@editorjs/editorjs/types/tools/inline-tool';

const icon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="14" y1="20" x2="5" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="15" y1="4" x2="9" y2="20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

export default class Italic implements InlineTool {
  private button: HTMLButtonElement | null = null;
  private tag = 'I';
  private api: API;

  static get CSS(): string {
    return 'cdx-italic';
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
    const termWrapper = this.api.selection.findParentTag(this.tag, Italic.CSS);
    if (termWrapper) {
      this.unwrap(termWrapper);
    } else {
      this.wrap(range);
    }
  }

  wrap(range: Range): void {
    const el = document.createElement(this.tag);
    el.classList.add(Italic.CSS);
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
    const termTag = this.api.selection.findParentTag(this.tag, Italic.CSS);
    this.button?.classList.toggle(
      this.api.styles.inlineToolButtonActive,
      !!termTag,
    );
    return !!termTag;
  }

  static get sanitize(): SanitizerConfig {
    return {
      i: {
        class: Italic.CSS,
      },
    };
  }
}
