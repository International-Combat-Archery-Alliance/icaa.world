import { useState, useRef } from 'react';
import { Folder, Image as ImageIcon, Upload, ChevronLeft } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetAssets,
  useGetUploadUrl,
  useConfirmUpload,
  useDeleteAsset,
  type Asset,
} from '@/hooks/useAssets';

interface ImagePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  folderPath?: string;
}

const MAX_SIZE_BYTES = 25 * 1024 * 1024;

function joinPath(basePath: string, name: string): string {
  if (basePath === '/') return `/${name}`;
  return `${basePath}/${name}`;
}

function isImageFile(asset: Asset): boolean {
  return (
    asset.type === 'file' &&
    asset.contentType.toLowerCase().startsWith('image/')
  );
}

function BrowseTab({
  onInsert,
  rootFolder,
}: {
  onInsert: (url: string) => void;
  rootFolder?: string;
}) {
  const [currentPath, setCurrentPath] = useState(rootFolder ?? '/');
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const { data, isLoading } = useGetAssets(currentPath, 100);

  const allAssets = data?.pages.flatMap((page) => page.data) ?? [];

  const folders = allAssets.filter((a) => a.type === 'folder');
  const images = allAssets.filter(isImageFile);

  const isAtRoot = currentPath === (rootFolder ?? '/');

  const navigateTo = (path: string) => {
    setCurrentPath(path);
    setSelectedPath(null);
  };

  const navigateUp = () => {
    if (isAtRoot) return;
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length > 0) {
      navigateTo('/' + parts.slice(0, -1).join('/'));
    }
  };

  const getUrl = (asset: Asset): string => {
    return (asset as { url?: string }).url ?? '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={navigateUp}
          disabled={isAtRoot}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Input value={currentPath} readOnly className="font-mono text-sm" />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      ) : (
        <>
          {folders.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                Folders
              </p>
              <div className="grid grid-cols-3 gap-2">
                {folders.map((folder) => (
                  <button
                    key={folder.name}
                    type="button"
                    onClick={() =>
                      navigateTo(joinPath(currentPath, folder.name))
                    }
                    className="flex flex-col items-center gap-1 p-3 rounded-md border hover:bg-accent transition-colors"
                  >
                    <Folder className="w-8 h-8 text-blue-500" />
                    <span className="text-xs truncate w-full text-center">
                      {folder.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {images.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2 font-medium">
                Images
              </p>
              <div className="grid grid-cols-3 gap-3">
                {images.map((asset) => {
                  const url = getUrl(asset);
                  const assetPath = joinPath(currentPath, asset.name);
                  const isSelected = selectedPath === assetPath;

                  return (
                    <button
                      key={asset.name}
                      type="button"
                      onClick={() => {
                        setSelectedPath(isSelected ? null : assetPath);
                      }}
                      className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/30'
                          : 'border-transparent hover:border-muted-foreground/30'
                      }`}
                    >
                      <img
                        src={url}
                        alt={asset.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 px-1 py-0.5">
                        <span className="text-[10px] text-white truncate block">
                          {asset.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {folders.length === 0 && images.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No images in this folder</p>
            </div>
          )}
        </>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t">
        <Button
          disabled={!selectedPath}
          onClick={() => {
            const selected = images.find(
              (a) => joinPath(currentPath, a.name) === selectedPath,
            );
            if (selected) {
              onInsert(getUrl(selected));
            }
          }}
        >
          Insert Selected
        </Button>
      </div>
    </div>
  );
}

function UploadTab({
  onInsert,
  folderPath,
}: {
  onInsert: (url: string) => void;
  folderPath?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, file: '' });
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadPath = folderPath ?? '/';

  const getUploadUrlMutation = useGetUploadUrl();
  const confirmUploadMutation = useConfirmUpload();
  const deleteAssetMutation = useDeleteAsset();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_SIZE_BYTES) {
      setError(
        `File exceeds 25 MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB)`,
      );
      e.target.value = '';
      return;
    }

    setUploading(true);
    setError(null);
    setProgress({ current: 0, total: 1, file: file.name });

    try {
      const uploadResponse = await getUploadUrlMutation.mutateAsync({
        body: {
          path: uploadPath,
          fileName: file.name,
          contentType: file.type,
        },
      });

      const formData = new FormData();
      Object.entries(uploadResponse.formFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', file);

      const s3Response = await fetch(uploadResponse.uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!s3Response.ok) {
        try {
          await deleteAssetMutation.mutateAsync({
            params: {
              query: { path: joinPath(uploadPath, file.name) },
            },
          });
        } catch {
          // ignore cleanup errors
        }
        throw new Error('Upload to storage failed');
      }

      const confirmResult = await confirmUploadMutation.mutateAsync({
        params: {
          query: { path: joinPath(uploadPath, file.name) },
        },
      });

      setProgress({ current: 1, total: 1, file: file.name });

      onInsert(confirmResult.file.url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Upload failed. Please try again.',
      );
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        className="border-2 border-dashed rounded-lg p-12 text-center cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <p className="text-sm font-medium">
          {uploading ? 'Uploading...' : 'Click to upload an image'}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Max file size: 25 MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />

      {uploading && (
        <div className="bg-primary/10 border border-primary/20 rounded-md px-3 py-2 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary font-medium">
              Uploading {progress.file}...
            </span>
            <span className="text-muted-foreground">
              {progress.current} of {progress.total}
            </span>
          </div>
          <Progress value={(progress.current / progress.total) * 100} />
        </div>
      )}

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}

export function ImagePickerModal({
  open,
  onOpenChange,
  onSelect,
  folderPath,
}: ImagePickerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="browse" className="flex-1 flex flex-col min-h-0">
          <TabsList className="w-full">
            <TabsTrigger value="browse" className="flex-1">
              Browse Assets
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex-1">
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="browse"
            className="flex-1 overflow-y-auto min-h-0 mt-4"
          >
            <BrowseTab
              rootFolder={folderPath}
              onInsert={(url) => {
                onSelect(url);
                onOpenChange(false);
              }}
            />
          </TabsContent>

          <TabsContent
            value="upload"
            className="flex-1 overflow-y-auto min-h-0 mt-4"
          >
            <UploadTab
              folderPath={folderPath}
              onInsert={(url) => {
                onSelect(url);
                onOpenChange(false);
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
