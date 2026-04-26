import { useGetAdminArticles, type Article } from '@/hooks/useArticles';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface ArticleListProps {
  onEdit: (article: Article) => void;
  onNew: () => void;
}

const PAGE_SIZE = 20;

export function ArticleList({ onEdit, onNew }: ArticleListProps) {
  const { data, isLoading, isFetchingNextPage, fetchNextPage } =
    useGetAdminArticles(PAGE_SIZE);

  const allArticles = data?.pages.flatMap((p) => p.data) ?? [];
  const hasNextPage = data?.pages[data.pages.length - 1]?.hasNextPage ?? false;

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Articles</CardTitle>
        <Button onClick={onNew}>New Article</Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allArticles.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground"
                  >
                    No articles yet. Create your first one!
                  </TableCell>
                </TableRow>
              )}
              {allArticles.map((article) => (
                <TableRow key={article.slug}>
                  <TableCell className="font-medium">{article.title}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        article.status === 'published' ? 'default' : 'secondary'
                      }
                    >
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {article.author}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(article.createdAt)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(article.updatedAt)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(article)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {hasNextPage && (
          <div className="mt-4 text-center">
            <Button
              variant="outline"
              size="sm"
              disabled={isFetchingNextPage}
              onClick={() => fetchNextPage()}
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
