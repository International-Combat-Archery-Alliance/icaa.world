import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './ui/form';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import {
  useCreateArticle,
  useUpdateArticle,
  usePublishArticle,
  type Article,
} from '@/hooks/useArticles';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import type { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import CustomImageTool from '@/components/editorjs-plugins/CustomImageTool';
import AlignmentTune from '@/components/editorjs-plugins/AlignmentTune';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Embed from '@editorjs/embed';
import Table from '@editorjs/table';
import LinkTool from '@editorjs/link';
import Delimiter from '@editorjs/delimiter';
import Underline from '@editorjs/underline';
import BoldInlineTool from '@/components/editorjs-plugins/Bold';
import ItalicInlineTool from '@/components/editorjs-plugins/Italic';
import StrikethroughInlineTool from '@/components/editorjs-plugins/Strikethrough';
import InlineCodeTool from '@/components/editorjs-plugins/InlineCode';
import useEditor from '@/hooks/useEditor';
import { ImagePickerModal } from '@/components/ImagePickerModal';
import { EditorToolbar } from '@/components/EditorToolbar';
import { getAssetsFetchClient } from '@/context/assetsQueryClientContext';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Slug must be lowercase letters, numbers, and hyphens only',
    ),
  excerpt: z.string().min(1, 'Excerpt is required').max(1000),
});

type ArticleFormData = z.infer<typeof articleSchema>;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseContent(content: unknown): OutputData | undefined {
  if (!content) return undefined;

  let data: Record<string, unknown>;
  if (typeof content === 'string') {
    try {
      data = JSON.parse(content);
    } catch {
      return undefined;
    }
  } else {
    data = content as Record<string, unknown>;
  }

  if (!('blocks' in data) || !Array.isArray(data.blocks)) {
    return { blocks: [] };
  }

  return data as OutputData;
}

const tools = {
  bold: BoldInlineTool,
  italic: ItalicInlineTool,
  strikethrough: StrikethroughInlineTool,
  inlineCode: InlineCodeTool,
  underline: Underline,
  alignmentTune: AlignmentTune,
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
    tunes: ['alignmentTune'],
  },
  header: {
    class: Header,
    tunes: ['alignmentTune'],
  },
  list: {
    class: List,
    tunes: ['alignmentTune'],
  },
  image: {
    class: CustomImageTool,
    tunes: ['alignmentTune'],
    config: {
      uploader: {
        async uploadByFile(file: File) {
          const client = getAssetsFetchClient();

          const uploadResult = await client.POST('/assets/v1/upload-url', {
            body: {
              path: '/articles/images',
              fileName: file.name,
              contentType: file.type,
            },
          });

          if (uploadResult.error) {
            throw new Error(uploadResult.error.message || 'Upload failed');
          }

          const { uploadUrl, formFields } = uploadResult.data;

          const uploadForm = new FormData();
          for (const [key, value] of Object.entries(formFields)) {
            uploadForm.append(key, value as string);
          }
          uploadForm.append('file', file);

          const s3Resp = await fetch(uploadUrl, {
            method: 'POST',
            body: uploadForm,
          });

          if (!s3Resp.ok) {
            throw new Error('S3 upload failed');
          }

          const confirmResult = await client.POST(
            '/assets/v1/by-path/confirm',
            {
              params: {
                query: { path: `/articles/images/${file.name}` },
              },
            },
          );

          if (confirmResult.error) {
            throw new Error(confirmResult.error.message || 'Confirm failed');
          }

          return {
            success: 1,
            file: {
              url: confirmResult.data.file.url,
            },
          };
        },
        async uploadByUrl(url: string) {
          return {
            success: 1,
            file: { url },
          };
        },
      },
    },
  },
  quote: {
    class: Quote,
    tunes: ['alignmentTune'],
  },
  embed: Embed,
  table: Table,
  linkTool: LinkTool,
  delimiter: Delimiter,
} as const;

interface ArticleEditorProps {
  article?: Article;
  isNew?: boolean;
  onSaved?: () => void;
}

export function ArticleEditor({
  article,
  isNew = false,
  onSaved,
}: ArticleEditorProps) {
  const { mutate: createMutate, isPending: createPending } = useCreateArticle();
  const { mutate: updateMutate, isPending: updatePending } = useUpdateArticle();
  const { mutate: publishMutate, isPending: publishPending } =
    usePublishArticle();

  const { editor } = useEditor({
    holder: 'editorjs-container',
    tools,
    data: parseContent(article?.content),
    placeholder: 'Write your article content here...',
  });

  const [saving, setSaving] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const slugManuallyEditedRef = useRef(false);

  useEffect(() => {
    const handler = () => {
      const count = editor?.blocks.getBlocksCount() ?? 0;
      if (count > 0) {
        editor?.blocks.delete(count - 1);
      }
      setImageModalOpen(true);
    };
    document.addEventListener('editorjs:request-image', handler);
    return () => {
      document.removeEventListener('editorjs:request-image', handler);
    };
  }, [editor]);

  const handleInsertImage = (url: string) => {
    editor?.blocks.insert('image', {
      file: { url },
      caption: '',
    });
  };

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title ?? '',
      slug: article?.slug ?? '',
      excerpt: article?.excerpt ?? '',
    },
  });

  const isPending = createPending || updatePending || publishPending || saving;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    form.setValue('title', title);
    if (isNew && !slugManuallyEditedRef.current) {
      form.setValue('slug', slugify(title));
    }
  };

  const handleSaveDraft = async (data: ArticleFormData) => {
    setSaving(true);
    try {
      const content: OutputData = (await editor?.save()) ?? { blocks: [] };

      if (isNew) {
        createMutate({
          body: {
            slug: data.slug,
            title: data.title,
            excerpt: data.excerpt,
            content,
          },
        });
      } else {
        updateMutate({
          params: { path: { slug: article!.slug } },
          body: {
            title: data.title,
            excerpt: data.excerpt,
            content,
          },
        });
      }
      onSaved?.();
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (data: ArticleFormData) => {
    setSaving(true);
    try {
      const content: OutputData = (await editor?.save()) ?? { blocks: [] };

      if (isNew) {
        createMutate({
          body: {
            slug: data.slug,
            title: data.title,
            excerpt: data.excerpt,
            content,
          },
        });
        publishMutate({
          params: { path: { slug: data.slug } },
        });
      } else {
        updateMutate({
          params: { path: { slug: article!.slug } },
          body: {
            title: data.title,
            excerpt: data.excerpt,
            content,
          },
        });
        publishMutate({
          params: { path: { slug: article!.slug } },
        });
      }
      onSaved?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="Article title"
                    {...field}
                    onChange={handleTitleChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug (for the path in the URL)</FormLabel>
                <FormDescription>
                  Note: Slug cannot be changed after the article is saved.
                </FormDescription>
                <FormControl>
                  <Input
                    className="bg-white"
                    placeholder="article-slug"
                    disabled={!isNew}
                    value={field.value}
                    onChange={(e) => {
                      slugManuallyEditedRef.current = true;
                      field.onChange(e);
                    }}
                    onBlur={field.onBlur}
                    name={field.name}
                    ref={field.ref}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea
                    className="bg-white"
                    placeholder="Brief description of the article..."
                    rows={3}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Content</FormLabel>
            <EditorToolbar
              editor={editor}
              onInsertImage={() => setImageModalOpen(true)}
              className="mt-1"
            />
            <div
              id="editorjs-container"
              className="min-h-[300px] border border-t-0 rounded-b-md p-4 bg-background"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={form.handleSubmit(handleSaveDraft)}
            >
              {isPending ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              type="button"
              disabled={isPending}
              onClick={form.handleSubmit(handlePublish)}
            >
              {isPending ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
        </form>
      </Form>

      <ImagePickerModal
        open={imageModalOpen}
        onOpenChange={setImageModalOpen}
        onSelect={handleInsertImage}
        folderPath="/articles/images"
      />
    </div>
  );
}
