import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Newspaper } from 'lucide-react';

const newsItems = [
  {
    id: '',
    to: '',
    title: '',
    date: '',
    excerpt: '',
  },
];

const UpcomingEventsContainer = () => {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Newspaper className="h-6 w-6 text-primary" />
          <span>Upcoming Events</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid flex-grow gap-4">
        {newsItems.map((item) => (
          <Link
            key={item.id}
            to={item.to}
            className="group grid gap-1 rounded-lg p-3 transition-colors hover:bg-muted/50"
          >
            <p className="text-sm text-muted-foreground">{item.date}</p>
            <h4 className="font-semibold group-hover:text-primary">
              {item.title}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {item.excerpt}
            </p>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
};

export default UpcomingEventsContainer;
