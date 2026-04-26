import { buttonVariants } from '@/components/ui/button';

type ButtonVariant = 'default' | 'secondary' | 'outline' | 'destructive';

interface ButtonLinkData {
  url: string;
  text: string;
  variant: ButtonVariant;
}

const VARIANTS: { value: ButtonVariant; label: string }[] = [
  { value: 'default', label: 'Primary' },
  { value: 'secondary', label: 'Secondary' },
  { value: 'outline', label: 'Outline' },
  { value: 'destructive', label: 'Destructive' },
];

export default class ButtonLinkTool {
  private data: ButtonLinkData;
  private previewEl: HTMLElement | null = null;

  static get toolbox() {
    return {
      title: 'Button Link',
      icon: '<svg width="17" height="15" viewBox="0 0 17 15" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="3.5" width="16" height="10" rx="4" fill="currentColor" fill-opacity="0.2" stroke="currentColor"/><path d="M5 8h7M9 5l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    };
  }

  constructor({ data }: { data: Partial<ButtonLinkData> }) {
    this.data = {
      url: data.url || '',
      text: data.text || '',
      variant: data.variant || 'default',
    };
  }

  render(): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '8px';
    wrapper.style.padding = '8px 0';

    // Variant selector
    const variantRow = document.createElement('div');
    variantRow.style.display = 'flex';
    variantRow.style.alignItems = 'center';
    variantRow.style.gap = '6px';

    const variantLabel = document.createElement('span');
    variantLabel.style.fontSize = '13px';
    variantLabel.style.fontWeight = '500';
    variantLabel.style.color = '#64748b';
    variantLabel.textContent = 'Variant:';
    variantRow.appendChild(variantLabel);

    for (const { value, label } of VARIANTS) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = label;
      btn.style.padding = '4px 10px';
      btn.style.borderRadius = '4px';
      btn.style.fontSize = '12px';
      btn.style.fontWeight = '500';
      btn.style.cursor = 'pointer';
      btn.style.border = '1px solid #d1d5db';
      btn.style.transition = 'all 0.15s';

      const applyVariantStyle = () => {
        const isActive = this.data.variant === value;
        btn.style.backgroundColor = isActive ? '#1d4ed8' : 'transparent';
        btn.style.color = isActive ? 'white' : '#374151';
        btn.style.borderColor = isActive ? '#1d4ed8' : '#d1d5db';
      };

      btn.addEventListener('click', () => {
        this.data.variant = value;
        for (const b of variantRow.querySelectorAll('button')) {
          const v = b.textContent || '';
          const variant = VARIANTS.find((x) => x.label === v);
          if (variant) {
            const isActive = variant.value === value;
            (b as HTMLButtonElement).style.backgroundColor = isActive
              ? '#1d4ed8'
              : 'transparent';
            (b as HTMLButtonElement).style.color = isActive
              ? 'white'
              : '#374151';
            (b as HTMLButtonElement).style.borderColor = isActive
              ? '#1d4ed8'
              : '#d1d5db';
          }
        }
        this.updatePreview();
      });
      applyVariantStyle();
      variantRow.appendChild(btn);
    }

    wrapper.appendChild(variantRow);

    // Input row: text + url
    const inputRow = document.createElement('div');
    inputRow.style.display = 'flex';
    inputRow.style.gap = '8px';

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Button text';
    textInput.value = this.data.text;
    textInput.classList.add('cdx-input');
    textInput.addEventListener('input', () => {
      this.data.text = textInput.value;
      this.updatePreview();
    });

    const urlInput = document.createElement('input');
    urlInput.type = 'url';
    urlInput.placeholder = 'https://example.com';
    urlInput.value = this.data.url;
    urlInput.classList.add('cdx-input');
    urlInput.addEventListener('input', () => {
      this.data.url = urlInput.value;
      this.updatePreview();
    });

    inputRow.appendChild(textInput);
    inputRow.appendChild(urlInput);
    wrapper.appendChild(inputRow);

    // Preview
    const preview = document.createElement('div');
    preview.style.marginTop = '4px';
    this.previewEl = preview;
    this.updatePreview();
    wrapper.appendChild(preview);

    return wrapper;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  save(_blockContent: HTMLElement): ButtonLinkData {
    return { ...this.data };
  }

  private updatePreview(): void {
    if (!this.previewEl) return;
    const { url, text, variant } = this.data;

    if (url && text) {
      const classes = buttonVariants({ variant });
      this.previewEl.innerHTML = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="${classes} pointer-events-none">${text}</a>`;
    } else {
      this.previewEl.innerHTML =
        '<span class="text-slate-400 text-[13px]">Enter a URL and button text to see a preview</span>';
    }
  }
}
