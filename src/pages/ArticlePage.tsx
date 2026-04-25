import { useParams, Link } from 'react-router-dom';
import { useTitle } from 'react-use';
import { useGetArticle } from '@/hooks/useArticles';
import { Skeleton } from '@/components/ui/skeleton';
import { EditorJsRenderer } from '@/components/EditorJsRenderer';

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function ArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, error } = useGetArticle(slug);

  const article = data?.article;

  useTitle(article ? `${article.title} - ICAA News` : 'Loading... - ICAA News');

  if (isLoading) {
    return (
      <section className="content-section news-page">
        <div className="content-wrapper max-w-screen-lg mx-auto p-4 md:p-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-10 w-96 mb-4" />
          <Skeleton className="h-5 w-32 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="content-section news-page">
        <div className="content-wrapper max-w-screen-lg mx-auto p-4 md:p-8 text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The article you are looking for does not exist or has been removed.
          </p>
          <Link to="/" className="text-primary underline">
            Back to Home
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="content-section news-page">
      <Link to="/" className="back-btn ml-4 md:ml-8 mt-4 inline-block">
        &larr; Back to Home
      </Link>
      <div className="content-wrapper max-w-screen-lg mx-auto p-4 md:p-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            {article.title}
          </h1>
          <p className="text-sm text-muted-foreground">
            {article.author && (
              <span>
                By {article.author}
                {' · '}
              </span>
            )}
            {formatDate(article.publishedAt ?? article.createdAt)}
          </p>
        </header>

        <div className="flex flex-col gap-6 text-lg text-justify">
          {article.content &&
            typeof article.content === 'object' &&
            'blocks' in article.content &&
            'blocks' in (article.content as Record<string, unknown>) && (
              <EditorJsRenderer
                data={article.content as { blocks: unknown[] }}
              />
            )}
        </div>
      </div>
    </section>
  );
}
