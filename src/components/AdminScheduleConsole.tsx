import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useGetGames,
  useGenerateSchedule,
  useUpdateGameScore,
  useInvalidateEventSchedule,
} from '@/hooks/useEvent';
import type { Game } from '@/hooks/useEvent';

interface AdminScheduleConsoleProps {
  eventId: string;
}

const RESULT_STATUSES = [
  'SCHEDULED',
  'COMPLETED',
  'FORFEIT',
  'DOUBLE_FORFEIT',
  'CANCELLED',
] as const;

function AdminScheduleConsole({ eventId }: AdminScheduleConsoleProps) {
  const invalidateSchedule = useInvalidateEventSchedule();
  const { data: gamesData, isLoading: gamesLoading } = useGetGames(
    eventId,
    false,
  );
  const generateMutation = useGenerateSchedule();

  const [format, setFormat] = useState<'ROUND_ROBIN' | 'SWISS'>('ROUND_ROBIN');
  const [mirror, setMirror] = useState(false);
  const [round, setRound] = useState('');
  const [replace, setReplace] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generatedCount, setGeneratedCount] = useState<number | null>(null);

  const onGenerate = () => {
    setGenerateError(null);
    setGeneratedCount(null);
    generateMutation.mutate(
      {
        params: { path: { eventId } },
        body: {
          format,
          mirror: format === 'ROUND_ROBIN' ? mirror : undefined,
          round: format === 'SWISS' && round !== '' ? Number(round) : undefined,
          replace: format === 'ROUND_ROBIN' && replace ? true : undefined,
        },
      },
      {
        onSuccess: (response) => {
          setGeneratedCount(response.games?.length ?? 0);
          invalidateSchedule(eventId);
        },
        onError: () => {
          setGenerateError(
            'Generation refused. Check event state and replace flag.',
          );
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Generate schedule</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row">
            <label
              className="flex flex-col gap-1 text-sm"
              htmlFor="schedule-format"
            >
              Format
              <Select
                value={format}
                onValueChange={(value) =>
                  setFormat(value as 'ROUND_ROBIN' | 'SWISS')
                }
              >
                <SelectTrigger id="schedule-format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ROUND_ROBIN">Round robin</SelectItem>
                  <SelectItem value="SWISS">Swiss (one round)</SelectItem>
                </SelectContent>
              </Select>
            </label>
            {format === 'ROUND_ROBIN' ? (
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={mirror}
                  onChange={(event) => setMirror(event.target.checked)}
                />
                Mirror (home/away reversed second leg)
              </label>
            ) : (
              <label
                className="flex flex-col gap-1 text-sm"
                htmlFor="swiss-round"
              >
                Round (blank for next)
                <Input
                  id="swiss-round"
                  type="number"
                  min={1}
                  value={round}
                  onChange={(event) => setRound(event.target.value)}
                  className="w-32"
                />
              </label>
            )}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={replace}
                onChange={(event) => setReplace(event.target.checked)}
              />
              Replace unplayed games (refused once results exist)
            </label>
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={onGenerate} disabled={generateMutation.isPending}>
              {generateMutation.isPending ? 'Generating…' : 'Generate'}
            </Button>
            {generatedCount !== null ? (
              <p className="text-sm">Generated {generatedCount} games.</p>
            ) : null}
            {generateError !== null ? (
              <p className="text-destructive text-sm">{generateError}</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Scores</CardTitle>
        </CardHeader>
        <CardContent>
          {gamesLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (gamesData?.games ?? []).length === 0 ? (
            <p>No schedule yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Matchup</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score A</TableHead>
                  <TableHead>Score B</TableHead>
                  <TableHead>Forfeit</TableHead>
                  <TableHead>Save</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(gamesData?.games ?? []).map((game) => (
                  <ScoreRow key={game.id} eventId={eventId} game={game} />
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function teamShort(game: Game, side: 'sideA' | 'sideB'): string {
  const entry = game[side];
  if (entry.isBye) {
    return 'BYE';
  }
  return entry.teamName ?? 'TBD';
}

function ScoreRow({ eventId, game }: { eventId: string; game: Game }) {
  const invalidateSchedule = useInvalidateEventSchedule();
  const updateMutation = useUpdateGameScore();

  const [status, setStatus] = useState<string>(game.status);
  const [scoreA, setScoreA] = useState(game.scoreA?.toString() ?? '');
  const [scoreB, setScoreB] = useState(game.scoreB?.toString() ?? '');
  const [forfeitSide, setForfeitSide] = useState(game.forfeitSide ?? '');
  const [saveError, setSaveError] = useState<string | null>(null);
  // Resync inputs only when fresh server data arrives (e.g. a sibling
  // live-poll or another admin saved): background polls with no changes
  // keep the same version and never clobber drafts.
  const [syncedVersion, setSyncedVersion] = useState(game.version);
  useEffect(() => {
    if (game.version !== syncedVersion) {
      setStatus(game.status);
      setScoreA(game.scoreA?.toString() ?? '');
      setScoreB(game.scoreB?.toString() ?? '');
      setForfeitSide(game.forfeitSide ?? '');
      setSyncedVersion(game.version);
      setSaveError(null);
    }
  }, [game, syncedVersion]);

  if (game.status === 'BYE') {
    return (
      <TableRow>
        <TableCell>{teamShort(game, 'sideA')} has a bye</TableCell>
        <TableCell>BYE</TableCell>
        <TableCell>–</TableCell>
        <TableCell>–</TableCell>
        <TableCell>–</TableCell>
        <TableCell>–</TableCell>
      </TableRow>
    );
  }

  const onSave = () => {
    setSaveError(null);
    updateMutation.mutate(
      {
        params: { path: { eventId, gameId: game.id! } },
        body: {
          status: status as
            | 'SCHEDULED'
            | 'COMPLETED'
            | 'FORFEIT'
            | 'DOUBLE_FORFEIT'
            | 'CANCELLED'
            | 'BYE',
          scoreA: scoreA === '' ? null : Number(scoreA),
          scoreB: scoreB === '' ? null : Number(scoreB),
          forfeitSide: forfeitSide === '' ? null : (forfeitSide as 'A' | 'B'),
          version: game.version!,
        },
      },
      {
        onSuccess: () => {
          invalidateSchedule(eventId);
        },
        onError: () => {
          invalidateSchedule(eventId);
          setSaveError(
            'Save refused — check values or refetch for the latest version.',
          );
        },
      },
    );
  };

  return (
    <TableRow>
      <TableCell>
        {teamShort(game, 'sideA')} vs {teamShort(game, 'sideB')}
      </TableCell>
      <TableCell>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {RESULT_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min={0}
          value={scoreA}
          onChange={(event) => setScoreA(event.target.value)}
          className="w-20"
        />
      </TableCell>
      <TableCell>
        <Input
          type="number"
          min={0}
          value={scoreB}
          onChange={(event) => setScoreB(event.target.value)}
          className="w-20"
        />
      </TableCell>
      <TableCell>
        <Select
          value={forfeitSide === '' ? 'none' : forfeitSide}
          onValueChange={(value) =>
            setForfeitSide(value === 'none' ? '' : value)
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="–" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">–</SelectItem>
            <SelectItem value="A">A</SelectItem>
            <SelectItem value="B">B</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <Button
            size="sm"
            onClick={onSave}
            disabled={updateMutation.isPending}
          >
            Save
          </Button>
          {saveError !== null ? (
            <p className="text-destructive text-xs">{saveError}</p>
          ) : null}
        </div>
      </TableCell>
    </TableRow>
  );
}

export { AdminScheduleConsole };
