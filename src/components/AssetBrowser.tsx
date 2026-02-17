import { useState } from 'react';
import {
  Folder,
  FileText,
  Image as ImageIcon,
  Film,
  Music,
  Archive,
  ChevronLeft,
  ChevronRight,
  Upload,
  FolderPlus,
  Trash2,
  Copy,
  ExternalLink,
  LayoutGrid,
  List,
  RefreshCw,
  ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  useGetAssets,
  useCreateFolder,
  useDeleteAsset,
  useGetUploadUrl,
  useConfirmUpload,
  useGetReplaceUrl,
  type Asset,
  type AdminAsset,
} from '@/hooks/useAssets';

const isAssetAdmin = (asset: Asset): asset is AdminAsset => {
  return 'id' in asset;
};

const joinPath = (basePath: string, name: string): string => {
  if (basePath === '/') {
    return `/${name}`;
  }
  return `${basePath}/${name}`;
};

const isImageAsset = (asset: Asset): boolean => {
  return (
    asset.type === 'file' &&
    asset.contentType.toLowerCase().startsWith('image/')
  );
};

const isPdfAsset = (asset: Asset): boolean => {
  return (
    asset.type === 'file' &&
    asset.contentType.toLowerCase() === 'application/pdf'
  );
};

interface AssetBrowserProps {
  initialPath?: string;
}

export function AssetBrowser({ initialPath = '/' }: AssetBrowserProps) {
  const [currentPath, setCurrentPath] = useState(initialPath);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cacheBuster, setCacheBuster] = useState<Record<string, number>>({});
  const [uploadProgress, setUploadProgress] = useState<{
    total: number;
    completed: number;
    currentFile: string | null;
  } | null>(null);
  const [sortField, setSortField] = useState<'name' | 'type' | 'size' | 'date'>(
    'name',
  );
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch,
  } = useGetAssets(currentPath, 50);

  const createFolderMutation = useCreateFolder();
  const deleteAssetMutation = useDeleteAsset();
  const getUploadUrlMutation = useGetUploadUrl();
  const confirmUploadMutation = useConfirmUpload();
  const getReplaceUrlMutation = useGetReplaceUrl();

  const allAssets = data?.pages.flatMap((page) => page.data) || [];

  const sortedAssets = allAssets.sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1;

    if (sortField === 'name') {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      return multiplier * a.name.localeCompare(b.name);
    }

    if (sortField === 'type') {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      const aType = a.type === 'folder' ? 'folder' : a.contentType;
      const bType = b.type === 'folder' ? 'folder' : b.contentType;
      return multiplier * aType.localeCompare(bType);
    }

    if (sortField === 'size') {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      const aSize = 'size' in a ? a.size : 0;
      const bSize = 'size' in b ? b.size : 0;
      return multiplier * (aSize - bSize);
    }

    if (sortField === 'date') {
      if (a.type === 'folder' && b.type !== 'folder') return -1;
      if (a.type !== 'folder' && b.type === 'folder') return 1;
      const aDate = 'createdAt' in a ? new Date(a.createdAt).getTime() : 0;
      const bDate = 'createdAt' in b ? new Date(b.createdAt).getTime() : 0;
      return multiplier * (aDate - bDate);
    }

    return 0;
  });

  const getAssetUrl = (asset: Asset): string | undefined => {
    if (!('url' in asset)) return undefined;
    const url = asset.url as string;
    const assetPath = joinPath(currentPath, asset.name);
    const buster = cacheBuster[assetPath];
    if (buster) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}v=${buster}`;
    }
    return url;
  };

  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
    setSelectedAsset(null);
  };

  const navigateUp = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const parentPath = '/' + pathParts.slice(0, -1).join('/');
      setCurrentPath(parentPath);
      setSelectedAsset(null);
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      await createFolderMutation.mutateAsync({
        body: {
          path: currentPath,
          name: newFolderName.trim(),
          description: newFolderDescription.trim() || undefined,
        },
      });
      await refetch();
      setNewFolderName('');
      setNewFolderDescription('');
      setShowCreateFolderDialog(false);
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedAsset) return;

    try {
      await deleteAssetMutation.mutateAsync({
        params: {
          query: { path: joinPath(currentPath, selectedAsset.name) },
        },
      });
      await refetch();
      setSelectedAsset(null);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete asset:', error);
      setShowDeleteDialog(false);

      // Check for FolderNotEmpty error
      const err = error as { code?: string };
      if (err.code === 'FolderNotEmpty') {
        setDeleteError(
          'Cannot delete folder because it is not empty. Please delete all files and subfolders first.',
        );
      } else {
        setDeleteError('Failed to delete. Please try again.');
      }
    }
  };

  // Retry utility with exponential backoff
  const retryWithBackoff = async <T,>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
  ): Promise<T> => {
    let lastError: Error | undefined;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        // Exponential backoff: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILES = 50;
    const MAX_SIZE_MB = 25;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

    // Check file count limit
    if (files.length > MAX_FILES) {
      setUploadError(
        `Too many files selected. Maximum ${MAX_FILES} files allowed at once.`,
      );
      event.target.value = '';
      return;
    }

    // Check for duplicate filenames
    const fileNames = Array.from(files).map((f) => f.name);
    const duplicates = fileNames.filter(
      (name, index) => fileNames.indexOf(name) !== index,
    );
    if (duplicates.length > 0) {
      setUploadError(
        `Duplicate filenames detected: ${[...new Set(duplicates)].join(', ')}. Please select unique files.`,
      );
      event.target.value = '';
      return;
    }

    // Check for files that already exist in the current folder
    const existingFileNames = allAssets
      .filter((asset) => asset.type === 'file')
      .map((asset) => asset.name);
    const alreadyExisting = fileNames.filter((name) =>
      existingFileNames.includes(name),
    );

    // Filter out files that already exist - they will be skipped
    const filesToUpload = Array.from(files).filter(
      (file) => !existingFileNames.includes(file.name),
    );

    if (filesToUpload.length === 0) {
      if (alreadyExisting.length === 1) {
        setUploadError(
          `File "${alreadyExisting[0]}" already exists in this folder.`,
        );
      } else {
        setUploadError(
          `Files already exist in this folder: ${alreadyExisting.join(', ')}.`,
        );
      }
      event.target.value = '';
      return;
    }

    // Check file sizes before upload
    const oversizedFiles = Array.from(files).filter(
      (file) => file.size > MAX_SIZE_BYTES,
    );
    if (oversizedFiles.length > 0) {
      const fileList = oversizedFiles
        .map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(1)} MB)`)
        .join(', ');
      setUploadError(`Files exceed ${MAX_SIZE_MB}MB limit: ${fileList}`);
      event.target.value = '';
      return;
    }

    setUploadProgress({
      total: filesToUpload.length,
      completed: 0,
      currentFile: null,
    });

    const uploadPromises = filesToUpload.map(async (file) => {
      setUploadProgress((prev) =>
        prev ? { ...prev, currentFile: file.name } : null,
      );

      try {
        const uploadResponse = await retryWithBackoff(() =>
          getUploadUrlMutation.mutateAsync({
            body: {
              path: currentPath,
              fileName: file.name,
              contentType: file.type,
            },
          }),
        );

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
          // Clean up the file metadata since the upload failed
          try {
            await deleteAssetMutation.mutateAsync({
              params: {
                query: { path: joinPath(currentPath, file.name) },
              },
            });
          } catch {
            // Ignore cleanup errors
          }

          const responseText = await s3Response.text();
          // S3 returns XML errors, try to parse the message
          const codeMatch = responseText.match(/<Code>([^<]+)<\/Code>/);
          const messageMatch = responseText.match(
            /<Message>([^<]+)<\/Message>/,
          );

          if (codeMatch?.[1] === 'EntityTooLarge') {
            const maxSize = responseText.match(
              /<MaxSizeAllowed>(\d+)<\/MaxSizeAllowed>/,
            );
            const maxSizeMB = maxSize
              ? (parseInt(maxSize[1]) / 1024 / 1024).toFixed(0)
              : 'unknown';
            return {
              fileName: file.name,
              success: false,
              error: `File is too large. Maximum allowed size is ${maxSizeMB} MB.`,
            };
          } else if (messageMatch?.[1]) {
            return {
              fileName: file.name,
              success: false,
              error: `Upload failed: ${messageMatch[1]}`,
            };
          } else {
            return {
              fileName: file.name,
              success: false,
              error: 'Upload failed. Please try again.',
            };
          }
        }

        await retryWithBackoff(() =>
          confirmUploadMutation.mutateAsync({
            params: {
              query: { path: joinPath(currentPath, file.name) },
            },
          }),
        );

        setUploadProgress((prev) =>
          prev ? { ...prev, completed: prev.completed + 1 } : null,
        );

        return { fileName: file.name, success: true };
      } catch (error) {
        console.error(`Failed to upload file ${file.name}:`, error);
        return {
          fileName: file.name,
          success: false,
          error: 'Upload failed. Please try again.',
        };
      }
    });

    const results = await Promise.all(uploadPromises);

    setUploadProgress(null);

    const failedUploads = results.filter((r) => !r.success && r.error);
    const hasSkippedFiles = alreadyExisting.length > 0;

    if (failedUploads.length > 0 || hasSkippedFiles) {
      let message = '';

      if (hasSkippedFiles) {
        if (alreadyExisting.length === 1) {
          message += `Skipped: "${alreadyExisting[0]}" already exists.`;
        } else {
          message += `Skipped ${alreadyExisting.length} files that already exist: ${alreadyExisting.join(', ')}.`;
        }
      }

      if (failedUploads.length > 0) {
        if (message) message += '\n\n';
        if (failedUploads.length === 1) {
          message +=
            failedUploads[0].error || 'Upload failed. Please try again.';
        } else {
          const errorList = failedUploads
            .map((r) => `${r.fileName}: ${r.error || 'Unknown error'}`)
            .join('\n');
          message += `Some uploads failed:\n${errorList}`;
        }
      }

      setUploadError(message);
    }

    // Only refetch once after all uploads are complete
    const hasAnySuccess = results.some((r) => r.success);
    if (hasAnySuccess) {
      await refetch();
    }

    event.target.value = '';
  };

  const handleFileReplace = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !selectedAsset || selectedAsset.type !== 'file') return;

    const assetPath = joinPath(currentPath, selectedAsset.name);

    try {
      const replaceResponse = await getReplaceUrlMutation.mutateAsync({
        params: {
          query: { path: assetPath },
        },
      });

      const formData = new FormData();
      Object.entries(replaceResponse.formFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', file);

      const s3Response = await fetch(replaceResponse.uploadUrl, {
        method: 'POST',
        body: formData,
      });

      if (!s3Response.ok) {
        const responseText = await s3Response.text();
        const codeMatch = responseText.match(/<Code>([^<]+)<\/Code>/);
        const messageMatch = responseText.match(/<Message>([^<]+)<\/Message>/);

        if (codeMatch?.[1] === 'EntityTooLarge') {
          const maxSize = responseText.match(
            /<MaxSizeAllowed>(\d+)<\/MaxSizeAllowed>/,
          );
          const maxSizeMB = maxSize
            ? (parseInt(maxSize[1]) / 1024 / 1024).toFixed(0)
            : 'unknown';
          setUploadError(
            `File is too large. Maximum allowed size is ${maxSizeMB} MB.`,
          );
        } else if (messageMatch?.[1]) {
          setUploadError(`Replace failed: ${messageMatch[1]}`);
        } else {
          setUploadError('Replace failed. Please try again.');
        }
        return;
      }

      await confirmUploadMutation.mutateAsync({
        params: {
          query: { path: assetPath },
        },
      });

      // Set cache buster to force browser to reload the image
      setCacheBuster((prev) => ({ ...prev, [assetPath]: Date.now() }));

      await refetch();
      setSelectedAsset(null);
    } catch (error) {
      console.error('Failed to update file:', error);
      setUploadError('Update failed. Please try again.');
    }

    event.target.value = '';
  };

  const getAssetIcon = (asset: Asset) => {
    if (asset.type === 'folder') {
      return <Folder className="w-8 h-8 text-blue-500" />;
    }

    const contentType = asset.contentType.toLowerCase();
    if (contentType.startsWith('image/')) {
      return <ImageIcon className="w-8 h-8 text-green-500" />;
    }
    if (contentType.startsWith('video/')) {
      return <Film className="w-8 h-8 text-purple-500" />;
    }
    if (contentType.startsWith('audio/')) {
      return <Music className="w-8 h-8 text-orange-500" />;
    }
    if (
      contentType.includes('zip') ||
      contentType.includes('tar') ||
      contentType.includes('rar')
    ) {
      return <Archive className="w-8 h-8 text-yellow-600" />;
    }
    return <FileText className="w-8 h-8 text-gray-500" />;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Button
            variant="outline"
            size="icon"
            onClick={navigateUp}
            disabled={currentPath === '/'}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Input
            value={currentPath}
            readOnly
            className="font-mono"
            onClick={() => copyToClipboard(currentPath)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCreateFolderDialog(true)}
          >
            <FolderPlus className="w-4 h-4 mr-2" />
            New Folder
          </Button>
          <label htmlFor="file-upload">
            <Button variant="outline" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Upload Files
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileUpload}
            disabled={
              getUploadUrlMutation.isPending || confirmUploadMutation.isPending
            }
          />
        </div>
      </div>

      <div className="text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
        <span className="font-medium">Note:</span> Maximum file size is 25 MB.
        All uploaded files are publicly accessible to everyone.
      </div>

      {uploadProgress && (
        <div className="bg-primary/10 border border-primary/20 rounded-md px-3 py-2 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-primary font-medium">
              Uploading {uploadProgress.currentFile}...
            </span>
            <span className="text-muted-foreground">
              {uploadProgress.completed} of {uploadProgress.total}
            </span>
          </div>
          <Progress
            value={(uploadProgress.completed / uploadProgress.total) * 100}
          />
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Total items: {allAssets.length}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <select
              value={sortField}
              onChange={(e) =>
                setSortField(
                  e.target.value as 'name' | 'type' | 'size' | 'date',
                )
              }
              className="h-9 px-3 text-sm border rounded-md bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="name">Name</option>
              <option value="type">Type</option>
              <option value="size">Size</option>
              <option value="date">Date Created</option>
            </select>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
              }
              title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
            >
              <ArrowUpDown
                className={`w-4 h-4 ${sortDirection === 'desc' ? 'rotate-180' : ''} transition-transform`}
              />
            </Button>
          </div>
          <div className="flex gap-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {sortedAssets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>This folder is empty</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedAssets.map((asset) => (
            <div
              key={isAssetAdmin(asset) ? asset.id : asset.name}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                selectedAsset &&
                isAssetAdmin(selectedAsset) &&
                isAssetAdmin(asset)
                  ? selectedAsset.id === asset.id
                    ? 'border-primary ring-2 ring-primary'
                    : ''
                  : ''
              }`}
              onClick={() => {
                if (isAssetAdmin(asset)) {
                  setSelectedAsset(asset);
                }
              }}
              onDoubleClick={() => {
                if (asset.type === 'folder') {
                  navigateToFolder(joinPath(currentPath, asset.name));
                } else if (asset.type === 'file' && 'url' in asset) {
                  window.open(asset.url, '_blank');
                }
              }}
            >
              {isImageAsset(asset) && 'url' in asset ? (
                <div className="mb-2">
                  <img
                    src={getAssetUrl(asset)}
                    alt={asset.name}
                    className="w-full h-32 object-cover rounded"
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getAssetIcon(asset)}
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{asset.name}</p>
                <p className="text-xs text-gray-500">{asset.type}</p>
              </div>
              {asset.type === 'file' && asset.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {asset.description}
                </p>
              )}
              {asset.type === 'file' && asset.size && (
                <p className="text-xs text-gray-500 mt-2">
                  {(asset.size / 1024).toFixed(2)} KB
                </p>
              )}
              {asset.type === 'folder' && (
                <p className="text-xs text-gray-500 mt-2">
                  {asset.contentCount} items
                </p>
              )}
              {'status' in asset && (
                <div className="mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      asset.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {asset.status}
                  </span>
                </div>
              )}
              {'createdAt' in asset && (
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(asset.createdAt).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg divide-y">
          {sortedAssets.map((asset) => (
            <div
              key={isAssetAdmin(asset) ? asset.id : asset.name}
              className={`flex items-center gap-4 p-3 cursor-pointer transition-all hover:bg-gray-50 ${
                selectedAsset &&
                isAssetAdmin(selectedAsset) &&
                isAssetAdmin(asset)
                  ? selectedAsset.id === asset.id
                    ? 'bg-primary/10'
                    : ''
                  : ''
              }`}
              onClick={() => {
                if (isAssetAdmin(asset)) {
                  setSelectedAsset(asset);
                }
              }}
              onDoubleClick={() => {
                if (asset.type === 'folder') {
                  navigateToFolder(joinPath(currentPath, asset.name));
                } else if (asset.type === 'file' && 'url' in asset) {
                  window.open(asset.url, '_blank');
                }
              }}
            >
              <div className="flex-shrink-0">
                {isImageAsset(asset) && 'url' in asset ? (
                  <img
                    src={getAssetUrl(asset)}
                    alt={asset.name}
                    className="w-10 h-10 object-cover rounded"
                  />
                ) : (
                  getAssetIcon(asset)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{asset.name}</p>
                {asset.description && (
                  <p className="text-xs text-gray-500 truncate">
                    {asset.description}
                  </p>
                )}
              </div>
              <div className="flex-shrink-0 text-sm text-gray-500">
                {asset.type === 'file' && asset.size
                  ? `${(asset.size / 1024).toFixed(1)} KB`
                  : asset.type === 'folder'
                    ? `${asset.contentCount} items`
                    : ''}
              </div>
              {'status' in asset && (
                <span
                  className={`flex-shrink-0 text-xs px-2 py-1 rounded-full ${
                    asset.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {asset.status}
                </span>
              )}
              {'createdAt' in asset && (
                <div className="flex-shrink-0 text-xs text-gray-500 hidden md:block">
                  {new Date(asset.createdAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              'Loading...'
            ) : (
              <>
                Load More
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      )}

      {selectedAsset && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold mb-2">Selected Asset</h3>
          <div className="flex gap-4">
            {isImageAsset(selectedAsset) && 'url' in selectedAsset && (
              <div className="flex-shrink-0">
                <img
                  src={getAssetUrl(selectedAsset)}
                  alt={selectedAsset.name}
                  className="w-48 h-48 object-contain rounded border bg-white"
                />
              </div>
            )}
            {isPdfAsset(selectedAsset) && 'url' in selectedAsset && (
              <div className="flex-shrink-0">
                <iframe
                  src={getAssetUrl(selectedAsset)}
                  title={selectedAsset.name}
                  className="w-64 h-80 rounded border bg-white"
                />
              </div>
            )}
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>{' '}
                  {selectedAsset.name}
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>{' '}
                  {selectedAsset.type}
                </div>
                {selectedAsset.type === 'file' && (
                  <>
                    <div>
                      <span className="text-gray-600">Size:</span>{' '}
                      {selectedAsset.size &&
                        (selectedAsset.size / 1024).toFixed(2)}{' '}
                      KB
                    </div>
                    <div>
                      <span className="text-gray-600">Content Type:</span>{' '}
                      {selectedAsset.contentType}
                    </div>
                    {isAssetAdmin(selectedAsset) && (
                      <div>
                        <span className="text-gray-600">Status:</span>{' '}
                        {selectedAsset.status}
                      </div>
                    )}
                  </>
                )}
                {selectedAsset.description && (
                  <div className="col-span-2">
                    <span className="text-gray-600">Description:</span>{' '}
                    {selectedAsset.description}
                  </div>
                )}
                {isAssetAdmin(selectedAsset) && (
                  <>
                    <div className="col-span-2">
                      <span className="text-gray-600">Created:</span>{' '}
                      {new Date(selectedAsset.createdAt).toLocaleString()}
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Created By:</span>{' '}
                      {selectedAsset.createdBy}
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                {selectedAsset.type === 'file' && 'url' in selectedAsset && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(selectedAsset.url as string, '_blank')
                      }
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(selectedAsset.url as string)
                      }
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </Button>
                    <label htmlFor="file-replace">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        disabled={
                          getReplaceUrlMutation.isPending ||
                          confirmUploadMutation.isPending
                        }
                      >
                        <span>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Update
                        </span>
                      </Button>
                    </label>
                    <input
                      id="file-replace"
                      type="file"
                      className="hidden"
                      onChange={handleFileReplace}
                      disabled={
                        getReplaceUrlMutation.isPending ||
                        confirmUploadMutation.isPending
                      }
                    />
                  </>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AlertDialog
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a name for the new folder in {currentPath}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Folder Name</label>
              <Input
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="my-folder"
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Description (optional)
              </label>
              <Input
                value={newFolderDescription}
                onChange={(e) => setNewFolderDescription(e.target.value)}
                placeholder="Description of this folder"
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleCreateFolder}>
              Create Folder
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {selectedAsset?.type}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedAsset?.name}&quot;?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={uploadError !== null}
        onOpenChange={(open) => !open && setUploadError(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upload Error</AlertDialogTitle>
            <AlertDialogDescription>{uploadError}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setUploadError(null)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={deleteError !== null}
        onOpenChange={(open) => !open && setDeleteError(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Error</AlertDialogTitle>
            <AlertDialogDescription>{deleteError}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setDeleteError(null)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
