import { useState, useCallback, useMemo } from 'react';
import { useTitle } from 'react-use';
import { Link } from 'react-router-dom';
import Turnstile from 'react-turnstile';
import { ArrowLeft, CheckCircle, Clock, User } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { cn, generateUUID } from '@/lib/utils';
import {
  useGetPolls,
  useGetPollResults,
  useVoteOnPoll,
} from '@/hooks/useVoting';
import type { Poll, PollResults } from '@/hooks/useVoting';

const VOTED_POLLS_KEY = 'icaa_voted_polls';

function getVotedPollIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(VOTED_POLLS_KEY) || '[]');
  } catch {
    return [];
  }
}

function markPollVoted(pollId: string) {
  const voted = getVotedPollIds();
  if (!voted.includes(pollId)) {
    voted.push(pollId);
    localStorage.setItem(VOTED_POLLS_KEY, JSON.stringify(voted));
  }
}

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
                  {meta?.imageUrl && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={meta.imageUrl} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
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

function PollCard({ poll }: { poll: Poll }) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(() =>
    getVotedPollIds().includes(poll.id),
  );
  const [showTurnstile, setShowTurnstile] = useState(false);
  const [voteError, setVoteError] = useState<string | null>(null);

  const voteMutation = useVoteOnPoll();
  const showResults =
    hasVoted || poll.status === 'Closed' || poll.resultsVisibility === 'Live';
  const { data: results } = useGetPollResults(
    showResults ? poll.id : undefined,
  );

  const voteConfig = poll.voteConfig ?? { maxSelections: 1 };
  const groups = poll.groups ?? [];
  const ungroupedOptions = poll.options ?? [];

  const optionMeta = useMemo(() => {
    const map = new Map<string, OptionMeta>();
    for (const opt of ungroupedOptions) {
      if (opt.id) map.set(opt.id, opt);
    }
    for (const group of groups) {
      for (const opt of group.options) {
        if (opt.id) map.set(opt.id, opt);
      }
    }
    return map;
  }, [ungroupedOptions, groups]);

  const optionGroupMap = useMemo(() => {
    const map = new Map<string, number>();
    groups.forEach((group, groupIdx) => {
      group.options.forEach((opt) => {
        if (opt.id) map.set(opt.id, groupIdx);
      });
    });
    return map;
  }, [groups]);

  const handleOptionToggle = useCallback(
    (optionId: string) => {
      setSelectedOptionIds((prev) => {
        if (prev.includes(optionId)) {
          return prev.filter((id) => id !== optionId);
        }
        if (prev.length >= voteConfig.maxSelections) return prev;

        if (voteConfig.maxSelectionsPerGroup !== undefined) {
          const groupIdx = optionGroupMap.get(optionId);
          if (groupIdx !== undefined) {
            const groupOptionIds = new Set(
              groups[groupIdx].options.map((o) => o.id).filter(Boolean),
            );
            const selectedInGroup = prev.filter((id) =>
              groupOptionIds.has(id),
            ).length;
            if (selectedInGroup >= voteConfig.maxSelectionsPerGroup)
              return prev;
          }
        }

        return [...prev, optionId];
      });
    },
    [voteConfig, optionGroupMap, groups],
  );

  const canSubmit =
    selectedOptionIds.length > 0 &&
    poll.status === 'Active' &&
    !voteMutation.isPending;

  const handleTurnstileVerify = (token: string) => {
    const idempotencyKey = generateUUID();
    setVoteError(null);

    voteMutation.mutate(
      {
        params: {
          path: { id: poll.id },
          header: {
            'cf-turnstile-response': token,
            'Idempotency-Key': idempotencyKey,
          },
        },
        body: { optionIds: selectedOptionIds },
      },
      {
        onSuccess: () => {
          setHasVoted(true);
          setShowTurnstile(false);
          markPollVoted(poll.id);
        },
        onError: () => {
          setVoteError('Vote submission failed. Please try again.');
          setShowTurnstile(false);
        },
      },
    );
  };

  if (hasVoted) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <h3 className="text-2xl font-bold">Vote Submitted!</h3>
          <p className="text-muted-foreground">
            Your vote for {poll.name} has been recorded.
          </p>
          {results && (
            <div className="mt-4 w-full">
              <h4 className="mb-2 font-semibold">Results</h4>
              <PollResultsDisplay results={results} optionMeta={optionMeta} />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader className="text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <CardTitle>{poll.name}</CardTitle>
          <Badge variant={statusVariant(poll.status)}>{poll.status}</Badge>
        </div>
        {poll.description && (
          <CardDescription>{poll.description}</CardDescription>
        )}
        {poll.status === 'Upcoming' && (
          <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Opens {new Date(poll.startTime).toLocaleString()}
          </div>
        )}
        {poll.status === 'Active' && poll.endTime && (
          <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Closes {new Date(poll.endTime).toLocaleString()}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {groups.map((group) => (
          <div key={group.id ?? group.name}>
            {group.imageUrl && (
              <div
                className="mx-auto mb-4 flex max-w-sm items-center justify-center rounded-lg p-4"
                style={{
                  backgroundColor: group.color ?? undefined,
                }}
              >
                <img
                  src={group.imageUrl}
                  alt={`${group.name} Logo`}
                  className="h-32 w-auto md:h-40"
                />
              </div>
            )}
            {!group.imageUrl && group.name && (
              <h3 className="mb-3 text-center text-lg font-semibold">
                {group.name}
              </h3>
            )}
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
              {group.options.map((option) => {
                const isSelected = option.id
                  ? selectedOptionIds.includes(option.id)
                  : false;
                return (
                  <div
                    key={option.id ?? option.name}
                    className={cn(
                      'flex cursor-pointer flex-row items-center gap-3 rounded-lg border p-2.5 transition-all hover:bg-muted/50',
                      isSelected && 'border-primary ring-2 ring-primary',
                      poll.status !== 'Active' &&
                        'cursor-not-allowed opacity-60',
                    )}
                    onClick={() => {
                      if (poll.status === 'Active' && option.id) {
                        handleOptionToggle(option.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-14 w-14 shrink-0">
                        <AvatarImage src={option.imageUrl} />
                        <AvatarFallback className="bg-muted">
                          <User className="h-7 w-7 text-muted-foreground" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-sm font-medium leading-tight">
                          {option.name}
                        </div>
                        {option.subtitle && (
                          <div className="text-xs text-muted-foreground">
                            {option.subtitle}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {ungroupedOptions.length > 0 && (
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {ungroupedOptions.map((option) => {
              const isSelected = option.id
                ? selectedOptionIds.includes(option.id)
                : false;
              return (
                <div
                  key={option.id ?? option.name}
                  className={cn(
                    'flex cursor-pointer flex-row items-center gap-3 rounded-lg border p-2.5 transition-all hover:bg-muted/50',
                    isSelected && 'border-primary ring-2 ring-primary',
                    poll.status !== 'Active' && 'cursor-not-allowed opacity-60',
                  )}
                  onClick={() => {
                    if (poll.status === 'Active' && option.id) {
                      handleOptionToggle(option.id);
                    }
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-14 w-14 shrink-0">
                      <AvatarImage src={option.imageUrl} />
                      <AvatarFallback className="bg-muted">
                        <User className="h-7 w-7 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="text-sm font-medium leading-tight">
                        {option.name}
                      </div>
                      {option.subtitle && (
                        <div className="text-xs text-muted-foreground">
                          {option.subtitle}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {poll.status === 'Active' && (
          <div className="flex flex-col items-center gap-4 pt-4">
            <p className="text-sm text-muted-foreground">
              {selectedOptionIds.length} of {voteConfig.maxSelections} selected
            </p>
            {!showTurnstile ? (
              <Button
                size="lg"
                disabled={!canSubmit}
                onClick={() => setShowTurnstile(true)}
              >
                Submit Vote
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-muted-foreground">
                  Verify you are human to submit your vote:
                </p>
                <Turnstile
                  theme="light"
                  sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
                  onVerify={handleTurnstileVerify}
                  onError={() => {
                    setVoteError(
                      'Captcha verification failed. Please try again.',
                    );
                    setShowTurnstile(false);
                  }}
                  onExpire={() => {
                    setShowTurnstile(false);
                  }}
                />
              </div>
            )}
            {voteError && (
              <p className="text-sm text-destructive">{voteError}</p>
            )}
          </div>
        )}

        {poll.status === 'Closed' && results && (
          <div className="mt-4">
            <h4 className="mb-2 text-center font-semibold">Results</h4>
            <PollResultsDisplay results={results} optionMeta={optionMeta} />
          </div>
        )}

        {poll.status === 'Closed' && !results && (
          <p className="text-center text-muted-foreground">
            This poll has closed.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function PollSkeleton() {
  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader className="text-center">
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto h-4 w-96" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center space-y-2 p-4">
              <Skeleton className="h-28 w-28 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function VotePage() {
  useTitle('MVP Voting - ICAA');

  const { data, isLoading, isError } = useGetPolls();
  const polls = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  return (
    <section className="container mx-auto space-y-12 px-4 py-8">
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link to="/espn">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to ESPN Page
          </Link>
        </Button>
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary">MVP Voting</h1>
        <p className="text-muted-foreground">Select your MVP for each match.</p>
      </div>

      {isLoading && (
        <div className="space-y-8">
          <PollSkeleton />
          <PollSkeleton />
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
              No active polls at this time. Check back later!
            </p>
          </CardContent>
        </Card>
      )}

      {polls.map((poll) => (
        <PollCard key={poll.id} poll={poll} />
      ))}
    </section>
  );
}
