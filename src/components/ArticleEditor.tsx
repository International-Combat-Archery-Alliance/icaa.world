import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
  useUnpublishArticle,
  useDeleteArticle,
  type Article,
} from '@/hooks/useArticles';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import type { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import CustomImageTool from '@/components/editorjs-plugins/CustomImageTool';
import AlignmentTune from '@/components/editorjs-plugins/AlignmentTune';
import EmbedSizeTune from '@/components/editorjs-plugins/EmbedSizeTune';
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
import { EmbedUrlDialog } from '@/components/EmbedUrlDialog';
import { type EmbedBlockData } from '@/lib/embedUtils';
import { getAssetsFetchClient } from '@/context/assetsQueryClientContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

const articleSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(
      /^[a-zA-Z0-9]+(?:-[a-zA-Z0-9]+)*$/,
      'Slug must be letters, numbers, and hyphens only',
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
  embedSizeTune: EmbedSizeTune,
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
  embed: {
    class: Embed,
    tunes: ['alignmentTune', 'embedSizeTune'],
    config: {
      services: {
        'google-drive-viewer': {
          regex: /^(https?:\/\/.+\.pdf(?:\?.*)?)$/i,
          embedUrl:
            'https://drive.google.com/viewerng/viewer?embedded=true&url=<%= remote_id %>',
          html: '<iframe style="width:100%;" height="600" frameborder="0" allowfullscreen></iframe>',
          height: 600,
          width: 600,
          id: (groups: string[]) => encodeURIComponent(groups[0]),
        },
        generic: {
          regex: /^$/,
          embedUrl: '<%= remote_id %>',
          html: '<iframe style="width:100%;" height="400" frameborder="0" allowfullscreen></iframe>',
          height: 400,
          width: 600,
          id: (groups: string[]) => groups[0],
        },
      },
    },
  },
  table: Table,
  linkTool: LinkTool,
  delimiter: Delimiter,
} as const;

interface ArticleEditorProps {
  article?: Article;
  isNew?: boolean;
  onDelete?: () => void;
}

export function ArticleEditor({
  article,
  isNew = false,
  onDelete,
}: ArticleEditorProps) {
  const { mutateAsync: createMutateAsync, isPending: createPending } =
    useCreateArticle();
  const { mutateAsync: updateMutateAsync, isPending: updatePending } =
    useUpdateArticle();
  const { mutateAsync: publishMutateAsync, isPending: publishPending } =
    usePublishArticle();
  const { mutateAsync: unpublishMutateAsync, isPending: unpublishPending } =
    useUnpublishArticle();
  const { mutateAsync: deleteMutateAsync, isPending: deletePending } =
    useDeleteArticle();

  const { editor } = useEditor({
    holder: 'editorjs-container',
    tools,
    data: parseContent(article?.content),
    placeholder: 'Write your article content here...',
  });

  const [saving, setSaving] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [embedDialogOpen, setEmbedDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [publishConfirmOpen, setPublishConfirmOpen] = useState(false);
  const [unpublishConfirmOpen, setUnpublishConfirmOpen] = useState(false);
  const [articleStatus, setArticleStatus] = useState(
    article?.status ?? 'draft',
  );
  const slugManuallyEditedRef = useRef(false);
  const pendingPublishDataRef = useRef<ArticleFormData | null>(null);

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

  const handleInsertEmbed = (data: EmbedBlockData) => {
    const currentIndex = editor?.blocks.getCurrentBlockIndex() ?? 0;
    editor?.blocks.insert(
      'embed',
      {
        service: data.service,
        source: data.source,
        embed: data.embed,
        width: data.width,
        height: data.height,
        caption: '',
      },
      {},
      currentIndex + 1,
      true,
    );
  };

  const form = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: article?.title ?? '',
      slug: article?.slug ?? '',
      excerpt: article?.excerpt ?? '',
    },
  });

  const isPending =
    createPending ||
    updatePending ||
    publishPending ||
    unpublishPending ||
    deletePending ||
    saving;

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
        await createMutateAsync({
          body: {
            slug: data.slug,
            title: data.title,
            excerpt: data.excerpt,
            content,
          },
        });
      } else {
        await updateMutateAsync({
          params: { path: { slug: article!.slug } },
          body: {
            title: data.title,
            excerpt: data.excerpt,
            content,
          },
        });
      }
      toast.success('Draft saved');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (data: ArticleFormData) => {
    setSaving(true);
    try {
      const content: OutputData = (await editor?.save()) ?? { blocks: [] };

      if (isNew) {
        await createMutateAsync({
          body: {
            slug: data.slug,
            title: data.title,
            excerpt: data.excerpt,
            content,
          },
        });
        await publishMutateAsync({
          params: { path: { slug: data.slug } },
        });
      } else {
        await updateMutateAsync({
          params: { path: { slug: article!.slug } },
          body: {
            title: data.title,
            excerpt: data.excerpt,
            content,
          },
        });
        await publishMutateAsync({
          params: { path: { slug: article!.slug } },
        });
      }
      toast.success('Article published');
      setArticleStatus('published');
      setPublishConfirmOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setSaving(false);
    }
  };

  const handleUnpublish = async () => {
    if (!article) return;
    setSaving(true);
    try {
      await unpublishMutateAsync({
        params: { path: { slug: article.slug } },
      });
      toast.success('Article unpublished');
      setArticleStatus('draft');
      setUnpublishConfirmOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to unpublish');
    } finally {
      setSaving(false);
    }
  };

  const handlePublishClick = (data: ArticleFormData) => {
    pendingPublishDataRef.current = data;
    setPublishConfirmOpen(true);
  };

  const handleUnpublishClick = () => {
    setUnpublishConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (!article) return;
    setSaving(true);
    try {
      await deleteMutateAsync({
        params: { path: { slug: article.slug } },
      });
      toast.success('Article deleted');
      onDelete?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete');
    } finally {
      setSaving(false);
      setDeleteConfirmOpen(false);
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
              onInsertEmbed={() => setEmbedDialogOpen(true)}
              className="mt-1"
            />
            <div
              id="editorjs-container"
              className="min-h-[300px] border border-t-0 rounded-b-md p-4 bg-background"
            />
          </div>

          <div className="flex gap-2">
            {articleStatus === 'published' ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  onClick={form.handleSubmit(handleSaveDraft)}
                >
                  {isPending ? 'Updating...' : 'Update'}
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isPending}
                  onClick={handleUnpublishClick}
                >
                  {isPending ? 'Unpublishing...' : 'Unpublish'}
                </Button>
              </>
            ) : (
              <>
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
                  onClick={form.handleSubmit(handlePublishClick)}
                >
                  {isPending ? 'Publishing...' : 'Publish'}
                </Button>
                {!isNew && (
                  <Button
                    type="button"
                    variant="destructive"
                    disabled={isPending}
                    onClick={() => setDeleteConfirmOpen(true)}
                  >
                    {isPending ? 'Deleting...' : 'Delete'}
                  </Button>
                )}
              </>
            )}
          </div>

          <AlertDialog
            open={publishConfirmOpen}
            onOpenChange={setPublishConfirmOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Publish Article</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to publish &ldquo;
                  {article?.title ?? pendingPublishDataRef.current?.title}
                  &rdquo;? It will be visible to the public.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isPending}
                  onClick={() => {
                    const data = pendingPublishDataRef.current;
                    if (data) handlePublish(data);
                  }}
                >
                  {isPending ? 'Publishing...' : 'Publish'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={unpublishConfirmOpen}
            onOpenChange={setUnpublishConfirmOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Unpublish Article</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to unpublish &ldquo;{article?.title}
                  &rdquo;? It will no longer be visible to the public.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isPending}
                  onClick={handleUnpublish}
                >
                  {isPending ? 'Unpublishing...' : 'Unpublish'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={deleteConfirmOpen}
            onOpenChange={setDeleteConfirmOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Article</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &ldquo;{article?.title}
                  &rdquo;? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={isPending}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  disabled={isPending}
                  onClick={handleDelete}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  {isPending ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      </Form>

      <EmbedUrlDialog
        open={embedDialogOpen}
        onOpenChange={setEmbedDialogOpen}
        onInsert={handleInsertEmbed}
      />

      <ImagePickerModal
        open={imageModalOpen}
        onOpenChange={setImageModalOpen}
        onSelect={handleInsertImage}
        folderPath="/articles/images"
      />
    </div>
  );
}
