import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

import { Newspaper, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetArticles } from '@/hooks/useArticles';

const NewsContainer = ({ className }: { className?: string }) => {
  const { data, isLoading } = useGetArticles(10);

  const articles = data?.pages.flatMap((p) => p.data) ?? [];

  const isRecent = (dateString: string | undefined) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 7);
    return date >= thirtyDaysAgo;
  };

  const handleShare = async (
    e: React.MouseEvent,
    article: { slug: string; title: string; excerpt: string },
  ) => {
    e.preventDefault();
    const url = `${window.location.origin}/news/${article.slug}`;
    const shareData = {
      title: article.title,
      text: article.excerpt,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Newspaper className="text-primary h-6 w-6" />
          <span>Latest News</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid max-h-[450px] flex-grow gap-4 overflow-y-auto">
        {isLoading && (
          <>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </>
        )}
        {!isLoading && articles.length === 0 && (
          <p className="text-muted-foreground text-sm">No articles yet.</p>
        )}
        {articles.map((item) => (
          <div
            key={item.slug}
            className="group hover:bg-muted/50 relative rounded-lg p-2 transition-colors"
          >
            <Link to={`/news/${item.slug}`} className="grid gap-1">
              <div className="pr-8">
                <p className="text-muted-foreground text-sm">
                  {item.publishedAt
                    ? new Date(item.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                    : ''}
                </p>
              </div>
              <h4 className="group-hover:text-primary font-semibold">
                {item.title}
                {isRecent(item.publishedAt) && (
                  <span className="bg-primary text-primary-foreground ml-2 inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold shadow transition-colors">
                    New
                  </span>
                )}
              </h4>
              <div>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {item.excerpt}
                </p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={(e) => handleShare(e, item)}
            >
              <Share2 className="h-4 w-4" />
              <span className="sr-only">Share</span>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NewsContainer;
