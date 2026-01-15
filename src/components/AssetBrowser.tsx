import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  const queryClient = useQueryClient();
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGetAssets(currentPath, 50);

  const createFolderMutation = useCreateFolder();
  const deleteAssetMutation = useDeleteAsset();
  const getUploadUrlMutation = useGetUploadUrl();
  const confirmUploadMutation = useConfirmUpload();

  const allAssets = data?.pages.flatMap((page) => page.data) || [];

  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
  };

  const navigateUp = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const parentPath = '/' + pathParts.slice(0, -1).join('/');
      setCurrentPath(parentPath);
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
      await queryClient.invalidateQueries({
        queryKey: ['get', '/assets/v1'],
      });
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
      await queryClient.invalidateQueries({
        queryKey: ['get', '/assets/v1'],
      });
      setSelectedAsset(null);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Failed to delete asset:', error);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const uploadResponse = await getUploadUrlMutation.mutateAsync({
        body: {
          path: currentPath,
          fileName: file.name,
          contentType: file.type,
        },
      });

      const formData = new FormData();
      Object.entries(uploadResponse.formFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('file', file);

      await fetch(uploadResponse.uploadUrl, {
        method: 'POST',
        body: formData,
      });

      await confirmUploadMutation.mutateAsync({
        params: {
          query: { path: joinPath(currentPath, file.name) },
        },
      });

      await queryClient.invalidateQueries({
        queryKey: ['get', '/assets/v1'],
      });
    } catch (error) {
      console.error('Failed to upload file:', error);
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
                Upload File
              </span>
            </Button>
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={
              getUploadUrlMutation.isPending || confirmUploadMutation.isPending
            }
          />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        Total items: {allAssets.length}
      </div>

      {allAssets.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p>This folder is empty</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allAssets.map((asset) => (
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
                }
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getAssetIcon(asset)}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{asset.name}</p>
                    <p className="text-xs text-gray-500">{asset.type}</p>
                  </div>
                </div>
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
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Name:</span> {selectedAsset.name}
            </div>
            <div>
              <span className="text-gray-600">Type:</span> {selectedAsset.type}
            </div>
            {selectedAsset.type === 'file' && (
              <>
                <div>
                  <span className="text-gray-600">Size:</span>{' '}
                  {selectedAsset.size && (selectedAsset.size / 1024).toFixed(2)}{' '}
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(selectedAsset.url as string)}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy URL
              </Button>
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
    </div>
  );
}
