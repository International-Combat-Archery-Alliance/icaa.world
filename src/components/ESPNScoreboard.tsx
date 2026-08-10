import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

type RoundType = 'Fence' | 'Bunkers' | 'Neutral Zone' | 'Sudden Death';

interface RoundResult {
  round: number;
  roundType: RoundType;
  winner: string;
  lengthSec: number;
}

interface HalfResult {
  label: string;
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  rounds: RoundResult[];
}

const formatDuration = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};

const teamColors: Record<string, string> = {
  Barrie: '#3163a6',
  Toronto: '#b02026',
  Ottawa: '#33593a',
  Boston: '#70b2e0',
};

const roundTypeStyles: Record<RoundType, string> = {
  Fence: 'bg-sky-500/15 text-sky-700 dark:text-sky-400 border-sky-600/30',
  Bunkers:
    'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-600/30',
  'Neutral Zone':
    'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-600/30',
  'Sudden Death': 'bg-destructive/15 text-destructive border-destructive/30',
};

const firstHalfRounds: RoundResult[] = [
  { round: 1, roundType: 'Fence', winner: 'Barrie', lengthSec: 133 },
  { round: 2, roundType: 'Bunkers', winner: 'Barrie', lengthSec: 65 },
  { round: 3, roundType: 'Neutral Zone', winner: 'Barrie', lengthSec: 93 },
  { round: 4, roundType: 'Fence', winner: 'Toronto', lengthSec: 41 },
  { round: 5, roundType: 'Bunkers', winner: 'Barrie', lengthSec: 23 },
  { round: 6, roundType: 'Neutral Zone', winner: 'Barrie', lengthSec: 20 },
  { round: 7, roundType: 'Fence', winner: 'Toronto', lengthSec: 71 },
  { round: 8, roundType: 'Bunkers', winner: 'Barrie', lengthSec: 88 },
  { round: 9, roundType: 'Neutral Zone', winner: 'Toronto', lengthSec: 25 },
  { round: 10, roundType: 'Fence', winner: 'Toronto', lengthSec: 22 },
  { round: 11, roundType: 'Bunkers', winner: 'Toronto', lengthSec: 48 },
  { round: 12, roundType: 'Neutral Zone', winner: 'Toronto', lengthSec: 43 },
];

const secondHalfRounds: RoundResult[] = [
  { round: 13, roundType: 'Fence', winner: 'Ottawa', lengthSec: 42 },
  { round: 14, roundType: 'Bunkers', winner: 'Boston', lengthSec: 27 },
  { round: 15, roundType: 'Neutral Zone', winner: 'Ottawa', lengthSec: 14 },
  { round: 16, roundType: 'Fence', winner: 'Boston', lengthSec: 45 },
  { round: 17, roundType: 'Bunkers', winner: 'Boston', lengthSec: 238 },
  { round: 18, roundType: 'Neutral Zone', winner: 'Ottawa', lengthSec: 42 },
  { round: 19, roundType: 'Fence', winner: 'Ottawa', lengthSec: 170 },
  { round: 20, roundType: 'Bunkers', winner: 'Boston', lengthSec: 27 },
  { round: 21, roundType: 'Neutral Zone', winner: 'Ottawa', lengthSec: 35 },
  { round: 22, roundType: 'Fence', winner: 'Boston', lengthSec: 99 },
];

const halves: HalfResult[] = [
  {
    label: 'First Half',
    teamA: 'Barrie',
    teamB: 'Toronto',
    scoreA: 6,
    scoreB: 6,
    rounds: firstHalfRounds,
  },
  {
    label: 'Second Half',
    teamA: 'Ottawa',
    teamB: 'Boston',
    scoreA: 5,
    scoreB: 5,
    rounds: secondHalfRounds,
  },
];

function HalfScoreboard({ half }: { half: HalfResult }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-bold">{half.label}</h3>
        <div className="flex items-center gap-3 text-lg font-semibold">
          <span className="flex items-center gap-2">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: teamColors[half.teamA] }}
            />
            {half.teamA}
          </span>
          <span className="text-muted-foreground">
            {half.scoreA} - {half.scoreB}
          </span>
          <span className="flex items-center gap-2">
            {half.teamB}
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ backgroundColor: teamColors[half.teamB] }}
            />
          </span>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Round</TableHead>
            <TableHead className="text-center">Round Type</TableHead>
            <TableHead className="text-center">
              Round Length{' '}
              <span className="text-muted-foreground font-normal">(m:ss)</span>
            </TableHead>
            <TableHead className="text-center">Winner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {half.rounds.map((result) => (
            <TableRow key={result.round}>
              <TableCell className="text-center font-medium">
                {result.round}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant="outline"
                  className={cn(
                    'font-semibold',
                    roundTypeStyles[result.roundType],
                  )}
                >
                  {result.roundType}
                </Badge>
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {formatDuration(result.lengthSec)}
              </TableCell>
              <TableCell className="text-center font-medium">
                <span
                  className="inline-flex items-center gap-2"
                  style={{ color: teamColors[result.winner] }}
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: teamColors[result.winner] }}
                  />
                  {result.winner}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ESPNScoreboard() {
  const totalA = halves.reduce((sum, half) => sum + half.scoreA, 0);
  const totalB = halves.reduce((sum, half) => sum + half.scoreB, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl md:text-3xl text-center text-primary">
          Final Scoreboard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="rounded-lg border p-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
            <div className="space-y-2">
              <span className="text-lg font-semibold">Barrie / Ottawa</span>
              <span className="block text-4xl font-bold">{totalA}</span>
            </div>
            <span className="text-muted-foreground font-bold">VS</span>
            <div className="space-y-2">
              <span className="text-lg font-semibold">Toronto / Boston</span>
              <span className="block text-4xl font-bold">{totalB}</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-center">
            <span className="text-muted-foreground">
              Regulation ended tied at {totalA} - {totalB}
            </span>
            <Badge variant="default" className="font-semibold">
              Winners: Ottawa / Barrie
            </Badge>
          </div>
        </div>

        {halves.map((half) => (
          <HalfScoreboard key={half.label} half={half} />
        ))}

        <div className="rounded-lg border p-6">
          <h3 className="text-xl font-bold">Tiebreaker Round</h3>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <Badge
              variant="outline"
              className={cn('font-semibold', roundTypeStyles['Sudden Death'])}
            >
              1v1 Sudden Death
            </Badge>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 text-center">
            <div>
              <p className="font-semibold">Cameron Cardwell</p>
              <p
                className="text-sm font-medium"
                style={{ color: teamColors.Boston }}
              >
                Boston
              </p>
            </div>
            <span className="text-muted-foreground font-bold">VS</span>
            <div>
              <p className="font-semibold">Andrew Bui</p>
              <p
                className="text-sm font-medium"
                style={{ color: teamColors.Ottawa }}
              >
                Ottawa
              </p>
            </div>
          </div>
          <p className="mt-4 text-center text-muted-foreground">
            Winner:{' '}
            <span className="font-semibold text-foreground">Andrew Bui</span>{' '}
            (Ottawa)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
