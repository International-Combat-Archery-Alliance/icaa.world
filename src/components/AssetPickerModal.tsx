import { useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Folder,
  FolderPlus,
  FileText,
  Image as ImageIcon,
  Upload,
  ChevronLeft,
} from 'lucide-react';
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
  useCreateFolder,
  type Asset,
} from '@/hooks/useAssets';
import {
  MAX_ASSET_UPLOAD_BYTES,
  getFolderNameError,
  joinAssetPath,
} from '@/lib/assetUtils';

type AssetPickerMode = 'image' | 'allFiles' | 'folder';

interface AssetPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
  folderPath?: string;
  mode?: AssetPickerMode;
  accept?: string;
  title?: string;
  filesLabel?: string;
  emptyMessage?: string;
  uploadPrompt?: string;
  onBatchUploaded?: (urls: string[]) => void;
}

const MODE_DEFAULTS: Record<
  AssetPickerMode,
  {
    accept: string | undefined;
    title: string;
    filesLabel: string;
    emptyMessage: string;
    uploadPrompt: string;
  }
> = {
  image: {
    accept: 'image/*',
    title: 'Insert Image',
    filesLabel: 'Images',
    emptyMessage: 'No images in this folder',
    uploadPrompt: 'Click to upload an image',
  },
  allFiles: {
    accept: undefined,
    title: 'Select File',
    filesLabel: 'Files',
    emptyMessage: 'No files in this folder',
    uploadPrompt: 'Click to upload a file',
  },
  folder: {
    accept: undefined,
    title: 'Select Folder',
    filesLabel: 'Files',
    emptyMessage: 'No subfolders in this folder',
    uploadPrompt: 'Click to upload files to this folder',
  },
};

const MAX_ASSET_UPLOAD_MB = MAX_ASSET_UPLOAD_BYTES / 1024 / 1024;

interface UploadFailure {
  fileName: string;
  message: string;
}

interface UploadBatchResult {
  urls: string[];
  failures: UploadFailure[];
}

function isImageFile(asset: Asset): boolean {
  return (
    asset.type === 'file' &&
    asset.contentType.toLowerCase().startsWith('image/')
  );
}

function isFileAsset(asset: Asset): boolean {
  return asset.type === 'file';
}

function getUrl(asset: Asset): string {
  return (asset as { url?: string }).url ?? '';
}

function describeFolderCreationError(
  error: unknown,
  folderName: string,
): string {
  const code = (error as { code?: string })?.code;

  if (code === 'AlreadyExists') {
    return `A folder named "${folderName}" already exists here.`;
  }

  if (code === 'ParentFolderNotFound') {
    return 'This folder no longer exists. Navigate back and try again.';
  }

  return error instanceof Error
    ? error.message
    : 'Could not create the folder. Please try again.';
}

function describeUploadError(error: unknown, uploadPath: string): string {
  if ((error as { code?: string })?.code === 'ParentFolderNotFound') {
    return `Folder "${uploadPath}" does not exist yet. Create it in the Browse tab, then try again.`;
  }

  return error instanceof Error
    ? error.message
    : 'Upload failed. Please try again.';
}

function BrowseTab({
  mode,
  currentPath,
  onPathChange,
  fileFilter,
  filesLabel,
  emptyMessage,
  onSelect,
}: {
  mode: AssetPickerMode;
  currentPath: string;
  onPathChange: (path: string) => void;
  fileFilter: (asset: Asset) => boolean;
  filesLabel: string;
  emptyMessage: string;
  onSelect: (selection: string) => void;
}) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderError, setNewFolderError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const createFolderMutation = useCreateFolder();

  const { data, isLoading, error } = useGetAssets(currentPath, 100);

  const allAssets = data?.pages.flatMap((page) => page.data) ?? [];

  const isFolderMode = mode === 'folder';
  const folders = allAssets.filter((a) => a.type === 'folder');
  const files = isFolderMode
    ? []
    : allAssets.filter(fileFilter).filter((a) => getUrl(a) !== '');

  const isAtRoot = currentPath === '/';

  const navigateTo = (path: string) => {
    onPathChange(path);
    setSelectedPath(null);
  };

  const navigateUp = () => {
    if (isAtRoot) return;
    const parts = currentPath.split('/').filter(Boolean);
    if (parts.length > 0) {
      const parent = '/' + parts.slice(0, -1).join('/');
      navigateTo(parent === '/' ? '/' : parent);
    } else {
      navigateTo('/');
    }
  };

  const closeNewFolder = () => {
    setNewFolderOpen(false);
    setNewFolderName('');
    setNewFolderError(null);
  };

  const createFolder = async () => {
    const validationError = getFolderNameError(newFolderName);
    if (validationError) {
      setNewFolderError(validationError);
      return;
    }

    const name = newFolderName.trim();

    try {
      await createFolderMutation.mutateAsync({
        body: { path: currentPath, name },
      });
    } catch (err) {
      setNewFolderError(describeFolderCreationError(err, name));
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ['get', '/assets/v1'] });
    navigateTo(joinAssetPath(currentPath, name));
    closeNewFolder();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Go to parent folder"
          onClick={navigateUp}
          disabled={isAtRoot}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Input
          value={currentPath}
          readOnly
          aria-label="Current folder path"
          className="bg-white font-mono text-sm"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setNewFolderOpen(true);
            setNewFolderError(null);
          }}
          disabled={newFolderOpen}
        >
          <FolderPlus className="h-4 w-4" />
          New Folder
        </Button>
      </div>

      {isFolderMode && isAtRoot && (
        <p className="text-muted-foreground text-sm">
          Root folder (/) selected — navigate into a subfolder or select the
          site root.
        </p>
      )}

      {newFolderOpen && (
        <div className="space-y-2 rounded-md border p-3">
          <div className="flex flex-wrap items-center gap-2">
            <Input
              value={newFolderName}
              aria-label="New folder name"
              placeholder="Folder name"
              className="bg-white"
              onChange={(e) => {
                setNewFolderName(e.target.value);
                setNewFolderError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void createFolder();
                }
              }}
            />
            <Button
              type="button"
              onClick={() => void createFolder()}
              disabled={createFolderMutation.isPending}
            >
              {createFolderMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={closeNewFolder}
              disabled={createFolderMutation.isPending}
            >
              Cancel
            </Button>
          </div>
          <p className="text-muted-foreground text-xs">
            Creates a folder inside {currentPath}
          </p>
          {newFolderError && (
            <p className="text-destructive text-sm" role="alert">
              {newFolderError}
            </p>
          )}
        </div>
      )}

      {error && !isLoading && allAssets.length === 0 ? (
        <div className="bg-destructive/10 border-destructive/20 text-destructive rounded-md border px-3 py-2 text-sm">
          Could not load {currentPath}. If this folder does not exist yet,
          create it with the New Folder button above.
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-md" />
          ))}
        </div>
      ) : (
        <>
          {folders.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium">
                Folders
              </p>
              <div className="grid grid-cols-3 gap-2">
                {folders.map((folder) => (
                  <button
                    key={folder.name}
                    type="button"
                    onClick={() =>
                      navigateTo(joinAssetPath(currentPath, folder.name))
                    }
                    className="hover:bg-accent flex flex-col items-center gap-1 rounded-md border p-3 transition-colors"
                  >
                    <Folder className="h-8 w-8 text-blue-500" />
                    <span className="w-full truncate text-center text-xs">
                      {folder.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {files.length > 0 && (
            <div>
              <p className="text-muted-foreground mb-2 text-xs font-medium">
                {filesLabel}
              </p>
              <div className="grid grid-cols-3 gap-3">
                {files.map((asset) => {
                  const url = getUrl(asset);
                  const assetPath = joinAssetPath(currentPath, asset.name);
                  const isSelected = selectedPath === assetPath;
                  const isImage = isImageFile(asset);

                  return (
                    <button
                      key={asset.name}
                      type="button"
                      onClick={() => {
                        setSelectedPath(isSelected ? null : assetPath);
                      }}
                      className={`relative aspect-square overflow-hidden rounded-md border-2 transition-all ${
                        isSelected
                          ? 'border-primary ring-primary/30 ring-2'
                          : 'hover:border-muted-foreground/30 border-transparent'
                      }`}
                    >
                      {isImage ? (
                        <img
                          src={url}
                          alt={asset.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full flex-col items-center justify-center gap-2 bg-white p-2">
                          <FileText className="h-10 w-10 text-gray-500" />
                          <span className="w-full truncate text-center text-[10px] text-gray-700">
                            {asset.name}
                          </span>
                        </span>
                      )}
                      <div className="absolute right-0 bottom-0 left-0 bg-black/50 px-1 py-0.5">
                        <span className="block truncate text-[10px] text-white">
                          {asset.name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {folders.length === 0 && files.length === 0 && (
            <div className="text-muted-foreground py-12 text-center">
              <ImageIcon className="mx-auto mb-3 h-12 w-12 opacity-30" />
              <p className="text-sm">{emptyMessage}</p>
            </div>
          )}
        </>
      )}

      <div className="flex justify-end gap-2 border-t pt-2">
        {isFolderMode ? (
          <Button type="button" onClick={() => onSelect(currentPath)}>
            Select Current Folder
          </Button>
        ) : (
          <Button
            type="button"
            disabled={!selectedPath}
            onClick={() => {
              const selected = files.find(
                (a) => joinAssetPath(currentPath, a.name) === selectedPath,
              );
              if (selected) {
                onSelect(getUrl(selected));
              } else {
                setSelectedPath(null);
              }
            }}
          >
            Insert Selected
          </Button>
        )}
      </div>
    </div>
  );
}

function UploadTab({
  uploadPath,
  accept,
  uploadPrompt,
  onBatchComplete,
}: {
  uploadPath: string;
  accept: string | undefined;
  uploadPrompt: string;
  onBatchComplete: (result: UploadBatchResult) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({
    current: 0,
    total: 0,
    fileName: '',
  });
  const [uploadedCount, setUploadedCount] = useState(0);
  const [failures, setFailures] = useState<UploadFailure[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const getUploadUrlMutation = useGetUploadUrl();
  const confirmUploadMutation = useConfirmUpload();
  const deleteAssetMutation = useDeleteAsset();

  const uploadFile = async (file: File): Promise<string> => {
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
            query: { path: joinAssetPath(uploadPath, file.name) },
          },
        });
      } catch {
        // ignore cleanup errors
      }
      throw new Error('Upload to storage failed');
    }

    const confirmResult = await confirmUploadMutation.mutateAsync({
      params: {
        query: { path: joinAssetPath(uploadPath, file.name) },
      },
    });

    return confirmResult.file.url;
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadedCount(0);
    setFailures([]);

    const confirmedUrls: string[] = [];
    const batchFailures: UploadFailure[] = [];

    for (const [index, file] of files.entries()) {
      if (file.size > MAX_ASSET_UPLOAD_BYTES) {
        batchFailures.push({
          fileName: file.name,
          message: `Exceeds the ${MAX_ASSET_UPLOAD_MB} MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB)`,
        });
        continue;
      }

      setProgress({
        current: index + 1,
        total: files.length,
        fileName: file.name,
      });

      try {
        confirmedUrls.push(await uploadFile(file));
        setUploadedCount(confirmedUrls.length);
      } catch (err) {
        batchFailures.push({
          fileName: file.name,
          message: describeUploadError(err, uploadPath),
        });
      }
    }

    if (confirmedUrls.length > 0) {
      await queryClient.invalidateQueries({ queryKey: ['get', '/assets/v1'] });
    }

    setFailures(batchFailures);
    setUploading(false);
    setProgress({ current: 0, total: 0, fileName: '' });
    e.target.value = '';

    onBatchComplete({ urls: confirmedUrls, failures: batchFailures });
  };

  return (
    <div className="space-y-4">
      <div
        className="hover:bg-accent/50 cursor-pointer rounded-lg border-2 border-dashed p-12 text-center transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="text-muted-foreground mx-auto mb-3 h-10 w-10" />
        <p className="text-sm font-medium">
          {uploading ? 'Uploading...' : uploadPrompt}
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Max file size: {MAX_ASSET_UPLOAD_MB} MB per file
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Uploads to {uploadPath}
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={handleFiles}
        disabled={uploading}
      />

      {uploading && progress.total > 0 && (
        <div className="bg-primary/10 border-primary/20 space-y-2 rounded-md border px-3 py-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary font-medium">
              Uploading {progress.fileName} ({progress.current} of{' '}
              {progress.total})...
            </span>
          </div>
          <Progress value={(progress.current / progress.total) * 100} />
        </div>
      )}

      {!uploading && uploadedCount > 0 && (
        <p className="text-sm">
          Uploaded {uploadedCount} file{uploadedCount === 1 ? '' : 's'} to{' '}
          {uploadPath}.
        </p>
      )}

      {failures.length > 0 && (
        <div className="bg-destructive/10 border-destructive/20 text-destructive space-y-1 rounded-md border px-3 py-2 text-sm">
          <p className="font-medium">
            {failures.length} file{failures.length === 1 ? '' : 's'} failed:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            {failures.map((failure) => (
              <li key={failure.fileName}>
                {failure.fileName}: {failure.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function AssetPickerModal({
  open,
  onOpenChange,
  onSelect,
  folderPath,
  mode = 'image',
  accept,
  title,
  filesLabel,
  emptyMessage,
  uploadPrompt,
  onBatchUploaded,
}: AssetPickerModalProps) {
  const defaults = MODE_DEFAULTS[mode];
  const [currentPath, setCurrentPath] = useState(folderPath ?? '/');

  useEffect(() => {
    if (open) {
      setCurrentPath(folderPath ?? '/');
    }
  }, [open, folderPath]);

  const emitSelection = (selection: string) => {
    onSelect(selection);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[80vh] max-w-2xl flex-col">
        <DialogHeader>
          <DialogTitle>{title ?? defaults.title}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="browse" className="flex min-h-0 flex-1 flex-col">
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
            className="mt-4 min-h-0 flex-1 overflow-y-auto"
          >
            <BrowseTab
              mode={mode}
              currentPath={currentPath}
              onPathChange={setCurrentPath}
              fileFilter={mode === 'allFiles' ? isFileAsset : isImageFile}
              filesLabel={filesLabel ?? defaults.filesLabel}
              emptyMessage={emptyMessage ?? defaults.emptyMessage}
              onSelect={emitSelection}
            />
          </TabsContent>

          <TabsContent
            value="upload"
            className="mt-4 min-h-0 flex-1 overflow-y-auto"
          >
            <UploadTab
              uploadPath={currentPath}
              accept={accept ?? defaults.accept}
              uploadPrompt={uploadPrompt ?? defaults.uploadPrompt}
              onBatchComplete={({ urls, failures }) => {
                if (urls.length > 0) {
                  onBatchUploaded?.(urls);
                }

                const keepOpen =
                  mode === 'folder' || failures.length > 0 || urls.length === 0;
                if (keepOpen) return;

                emitSelection(urls[urls.length - 1]);
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
