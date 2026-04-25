import ImageTool from '@editorjs/image';

type ImageSize = 'small' | 'medium' | 'large' | 'full';

const SIZE_CSS_SUFFIX: Record<ImageSize, string> = {
  small: 'size-sm',
  medium: 'size-md',
  large: 'size-lg',
  full: 'size-full',
};

const SIZE_OPTIONS = [
  { size: 'full' as ImageSize, title: 'Full width' },
  { size: 'large' as ImageSize, title: 'Large' },
  { size: 'medium' as ImageSize, title: 'Medium' },
  { size: 'small' as ImageSize, title: 'Small' },
];

export default class CustomImageTool extends ImageTool {
  appendCallback(): void {
    queueMicrotask(() => {
      document.dispatchEvent(new CustomEvent('editorjs:request-image'));
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(params: any) {
    super(params);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)._data.size =
      (params.data as Record<string, unknown>)?.size || 'full';
  }

  render() {
    const wrapper = super.render() as HTMLElement;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const size: ImageSize = (this as any)._data.size || 'full';
    if (size !== 'full') {
      wrapper.classList.add(`image-tool--${SIZE_CSS_SUFFIX[size]}`);
    }
    return wrapper;
  }

  renderSettings() {
    const parentSettings = super.renderSettings() || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentSize: ImageSize = (this as any)._data.size || 'full';

    const sizeTune = {
      name: 'size',
      icon: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="2" y="4" width="14" height="10" rx="1.5" stroke="currentColor" stroke-width="2"/><path d="M6.5 4V14M11.5 4V14M2.5 7H15.5M2.5 11H15.5" stroke="currentColor" stroke-width="1.5" stroke-dasharray="1.5 1"/></svg>`,
      title: 'Image Size',
      isActive: currentSize !== 'full',
      closeOnActivate: true,
      children: {
        items: SIZE_OPTIONS.map(({ size, title }) => ({
          name: size,
          title,
          icon: '',
          isActive: currentSize === size,
          closeOnActivate: true,
          onActivate: () => this._setSize(size),
        })),
      },
    };

    return [...parentSettings, sizeTune];
  }

  save(blockContent: HTMLElement) {
    const data = super.save(blockContent);
    return {
      ...data,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      size: (this as any)._data.size || 'full',
    };
  }

  private _setSize(size: ImageSize): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const self = this as any;
    const oldSize: ImageSize = self._data.size || 'full';
    self._data.size = size;

    const wrapper = self.ui?.nodes?.wrapper as HTMLElement | undefined;
    if (wrapper) {
      if (oldSize !== 'full') {
        wrapper.classList.remove(`image-tool--${SIZE_CSS_SUFFIX[oldSize]}`);
      }
      if (size !== 'full') {
        wrapper.classList.add(`image-tool--${SIZE_CSS_SUFFIX[size]}`);
      }
    }

    self.block?.dispatchChange?.();
  }
}
