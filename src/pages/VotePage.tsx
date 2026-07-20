import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTitle } from 'react-use';
import { ArrowRight, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetPolls } from '@/hooks/useVoting';
import type { Poll } from '@/hooks/useVoting';

function statusVariant(
  status: Poll['status'],
): 'default' | 'secondary' | 'outline' {
  switch (status) {
    case 'Active':
      return 'default';
    case 'Upcoming':
      return 'secondary';
    case 'Closed':
      return 'outline';
  }
}

function PollListItem({ poll }: { poll: Poll }) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-muted/50">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium">{poll.name}</span>
          <Badge variant={statusVariant(poll.status)}>{poll.status}</Badge>
        </div>
        {poll.description && (
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {poll.description}
          </p>
        )}
        <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {new Date(poll.startTime).toLocaleString()} —{' '}
          {new Date(poll.endTime).toLocaleString()}
        </div>
      </div>
      <Button asChild variant="outline" size="sm" className="ml-4 shrink-0">
        <Link to={`/vote/${poll.id}`}>
          {poll.status === 'Active'
            ? 'Vote'
            : poll.status === 'Closed'
              ? 'View Results'
              : 'View'}
          <ArrowRight className="ml-1.5 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

export default function VotePage() {
  useTitle('Voting - ICAA');

  const { data, isLoading, isError } = useGetPolls();
  const polls = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  return (
    <section className="container mx-auto space-y-8 px-4 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">Voting</h1>
        <p className="text-muted-foreground">
          Cast your vote in active polls or view past results.
        </p>
      </div>

      {isLoading && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      )}

      {isError && (
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Failed to load polls. Please try again later.
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && polls.length === 0 && (
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              No polls at this time. Check back later!
            </p>
          </CardContent>
        </Card>
      )}

      {polls.map((poll) => (
        <PollListItem key={poll.id} poll={poll} />
      ))}
    </section>
  );
}
