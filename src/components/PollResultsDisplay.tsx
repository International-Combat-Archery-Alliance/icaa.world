import { User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { PollResults, PublicResultsLevel } from '@/hooks/useVoting';

interface OptionMeta {
  name: string;
  subtitle?: string;
  imageUrl?: string;
}

function PollResultsDisplay({
  results,
  optionMeta,
}: {
  results: PollResults;
  optionMeta: Map<string, OptionMeta>;
}) {
  const maxCount =
    results.level === 'Full'
      ? Math.max(...results.results.map((r) => r.count ?? 0), 1)
      : results.level === 'Percentages'
        ? 100
        : 0;

  const sorted = [...results.results].sort((a, b) => {
    if (results.level === 'Rankings') return (a.rank ?? 0) - (b.rank ?? 0);
    if (results.level === 'Full' || results.level === 'Percentages') {
      return (b.count ?? b.percentage ?? 0) - (a.count ?? a.percentage ?? 0);
    }
    return 0;
  });

  if (results.level === 'None') {
    return (
      <p className="text-center text-muted-foreground">
        Results are not available for this poll.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {results.level === 'Full' && results.totalVotes !== undefined && (
        <p className="text-center text-sm text-muted-foreground">
          {results.totalVotes} total vote{results.totalVotes !== 1 ? 's' : ''}
        </p>
      )}
      <div className="space-y-2">
        {sorted.map((r) => {
          const meta = optionMeta.get(r.optionId);
          const value =
            results.level === 'Full'
              ? (r.count ?? 0)
              : results.level === 'Percentages'
                ? (r.percentage ?? 0)
                : 0;
          const barWidth =
            results.level === 'Rankings'
              ? 0
              : Math.round((value / maxCount) * 100);

          return (
            <div key={r.optionId} className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={meta?.imageUrl} />
                    <AvatarFallback className="bg-muted">
                      <User className="h-4 w-4 text-muted-foreground" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate text-sm font-medium">
                    {meta?.name ?? r.optionId}
                  </span>
                </div>
                <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                  {results.level === 'Full' && r.count !== undefined && r.count}
                  {results.level === 'Percentages' &&
                    r.percentage !== undefined &&
                    `${r.percentage}%`}
                  {results.level === 'Rankings' &&
                    r.rank !== undefined &&
                    `#${r.rank}`}
                </span>
              </div>
              {results.level !== 'Rankings' && (
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export { PollResultsDisplay };
export type { OptionMeta, PollResults, PublicResultsLevel };
