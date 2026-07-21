import { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTitle } from 'react-use';
import Turnstile from 'react-turnstile';
import { CheckCircle, Clock, User } from 'lucide-react';
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
  useGetPoll,
  useGetPollResults,
  useVoteOnPoll,
} from '@/hooks/useVoting';
import type { Poll } from '@/hooks/useVoting';
import {
  PollResultsDisplay,
  type OptionMeta,
} from '@/components/PollResultsDisplay';

const VOTES_KEY = 'icaa_votes';

interface StoredVote {
  pollId: string;
  optionIds: string[];
  optionName: string;
  optionImageUrl?: string;
}

function getStoredVotes(): StoredVote[] {
  try {
    return JSON.parse(localStorage.getItem(VOTES_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveVote(vote: StoredVote) {
  const votes = getStoredVotes().filter((v) => v.pollId !== vote.pollId);
  votes.push(vote);
  localStorage.setItem(VOTES_KEY, JSON.stringify(votes));
}

function getStoredVote(pollId: string): StoredVote | undefined {
  return getStoredVotes().find((v) => v.pollId === pollId);
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

function VotedCard({
  vote,
  results,
  optionMeta,
}: {
  vote: StoredVote;
  results?: ReturnType<typeof useGetPollResults>['data'];
  optionMeta: Map<string, OptionMeta>;
}) {
  const votedOption = optionMeta.get(vote.optionIds[0]);

  return (
    <Card className="max-w-3xl mx-auto">
      <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h3 className="text-2xl font-bold">Vote Submitted!</h3>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={votedOption?.imageUrl} />
            <AvatarFallback className="bg-muted">
              <User className="h-6 w-6 text-muted-foreground" />
            </AvatarFallback>
          </Avatar>
          <p className="text-lg font-medium">
            You voted for{' '}
            <span className="text-primary">
              {votedOption?.name ?? vote.optionIds[0]}
            </span>
          </p>
        </div>
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

function PollSkeleton() {
  return (
    <Card className="max-w-5xl mx-auto">
      <CardHeader className="text-center">
        <Skeleton className="mx-auto h-8 w-64" />
        <Skeleton className="mx-auto h-4 w-96" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5">
              <Skeleton className="h-14 w-14 shrink-0 rounded-full" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function PollCountdown({ endTime }: { endTime: string }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const remaining = new Date(endTime).getTime() - now;

  if (remaining <= 0) {
    return (
      <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        Poll has closed
      </div>
    );
  }

  const days = Math.floor(remaining / 86400000);
  const hours = Math.floor((remaining % 86400000) / 3600000);
  const minutes = Math.floor((remaining % 3600000) / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  parts.push(`${minutes}m`, `${seconds}s`);

  return (
    <div className="flex items-center justify-center gap-1.5 text-sm tabular-nums text-muted-foreground">
      <Clock className="h-4 w-4" />
      Closes in {parts.join(' ')}
    </div>
  );
}

export default function VotePage() {
  const { pollId } = useParams<{ pollId: string }>();
  useTitle('Voting - ICAA');

  const { data, isLoading, isError } = useGetPoll(pollId);
  const poll = data?.poll;

  if (!pollId) {
    return (
      <section className="container mx-auto px-4 py-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No poll specified.</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="container mx-auto space-y-8 px-4 py-8">
      {isLoading && <PollSkeleton />}

      {isError && (
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">
              Failed to load poll. Please try again later.
            </p>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && !poll && (
        <Card className="max-w-lg mx-auto">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Poll not found.</p>
          </CardContent>
        </Card>
      )}

      {poll && <PollVoteCard poll={poll} />}
    </section>
  );
}

function PollVoteCard({ poll }: { poll: Poll }) {
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const storedVote = getStoredVote(poll.id);
  const [hasVoted, setHasVoted] = useState(!!storedVote);
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

        if (prev.length >= voteConfig.maxSelections) {
          if (voteConfig.maxSelections === 1) {
            return [optionId];
          }
          return prev;
        }

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
          const meta = optionMeta.get(selectedOptionIds[0]);
          saveVote({
            pollId: poll.id,
            optionIds: selectedOptionIds,
            optionName: meta?.name ?? selectedOptionIds[0],
            optionImageUrl: meta?.imageUrl,
          });
          setHasVoted(true);
          setShowTurnstile(false);
        },
        onError: () => {
          setVoteError('Vote submission failed. Please try again.');
          setShowTurnstile(false);
        },
      },
    );
  };

  if (hasVoted && storedVote) {
    return (
      <VotedCard vote={storedVote} results={results} optionMeta={optionMeta} />
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
          <PollCountdown endTime={poll.endTime} />
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {groups.length > 0 && (
          <p className="text-center text-sm text-muted-foreground">
            Select 1 player
          </p>
        )}
        {groups.map((group, groupIdx) => (
          <div key={group.id ?? group.name}>
            {groupIdx > 0 && (
              <div className="relative mb-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted-foreground/30" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-card px-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    OR
                  </span>
                </div>
              </div>
            )}
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
