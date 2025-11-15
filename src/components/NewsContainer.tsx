import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Newspaper } from 'lucide-react';
import { cn } from '@/lib/utils';

const newsItems = [
  {
    id: 'icaa-launch',
    to: '/news/icaa-launch',
    title: 'ICAA to Launch with Inaugural Boston Play Ins',
    date: 'August 29, 2025',
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
  {
    id: 'play-ins-results',
    to: '/news/play-ins-results',
    title: 'Boston Play-In Results Are In!',
    date: 'September 7, 2025',
    excerpt:
      "The inaugural Boston Play-Ins have concluded! Three teams have punched their ticket to the international tournament. Find out who came out on top and see the full breakdown of the day's action.",
  },
  {
    id: 'boston-championship-registration',
    to: '/news/boston-championship-registration',
    title: 'Registration is Now Open for the Boston Championships 2025!',
    date: 'September 20, 2025',
    excerpt:
      'The stage is set! Registration for the premier Boston Championships 2025 is now open to teams and free agents. Secure your spot to compete against the best in North America.',
  },
  {
    id: 'boston-championship-results',
    to: '/news/boston-championship-results',
    title: 'Boston Renegades Win the 2025 Boston Championships!',
    date: 'October 26, 2025',
    excerpt:
      'The inaugural ICAA Boston Championships have concluded! The Boston Renegades have been crowned champions after a thrilling day of competition. See the final standings and read the full recap.',
  },
];

const NewsContainer = ({ className }: { className?: string }) => {
  const sortedNews = [...newsItems].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <Card className={cn('flex h-full flex-col', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Newspaper className="h-6 w-6 text-primary" />
          <span>Latest News</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid flex-grow gap-4 overflow-y-auto max-h-[450px]">
        {sortedNews.map((item) => (
          <div key={item.id}>
            <Link
              to={item.to}
              className="group grid gap-1 rounded-lg p-2 transition-colors hover:bg-muted/50"
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
