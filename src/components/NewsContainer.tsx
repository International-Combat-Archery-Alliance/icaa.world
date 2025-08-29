import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

const newsItems = [
  {
    id: 'icaa-launch',
    to: '/news/icaa-launch',
    title: 'ICAA to Launch with Inaugural Boston Play Ins',
    date: 'August 30, 2025',
    excerpt:
      'The ICAA is proud to announce its official launch with the first-ever Boston Play Ins Tournament this fall.',
  },
  {
    id: 'rules',
    to: '/news/rules',
    title: 'Official Tournament Rules Announced!',
    date: 'August 30, 2025',
    excerpt:
      'The official rulebook for competitive tournament play has been released, outlining standardized regulations for all ICAA-sanctioned events.',
  },
];

const NewsContainer = ({ className }: { className?: string }) => {
  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Newspaper className="h-6 w-6 text-primary" />
          <span>Latest News</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid flex-grow gap-4">
        {newsItems.map((item) => (
          <div key={item.id}>
            <Link
              to={item.to}
              className="group grid gap-1 rounded-lg transition-colors hover:bg-muted/50"
            >
              <p className="text-sm text-muted-foreground">{item.date}</p>
              <h4 className="font-semibold group-hover:text-primary">
                {item.title}
              </h4>
              {/* Need the wrapper dive for the line clamp to work correctly for some reason */}
              <div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.excerpt}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NewsContainer;
