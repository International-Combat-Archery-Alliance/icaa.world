import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Player {
  imageUrl: string;
  firstName: string;
  lastName: string;
  number: string;
  position: string;
  city: string;
  experience: string;
}

interface PlayerRosterProps {
  players: Player[];
}

const getPositionIcon = (position: string) => {
  const formattedPosition = position.replace(/\s+/g, ''); // Remove spaces
  return `/images/logos/${formattedPosition}.png`;
};

export function PlayerRoster({ players }: PlayerRosterProps) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px] md:w-[80px]"></TableHead>
            <TableHead className="text-base md:text-lg">Name</TableHead>
            <TableHead className="text-center text-base md:text-lg">
              #
            </TableHead>
            <TableHead className="text-center text-base md:text-lg">
              Position
            </TableHead>
            <TableHead className="hidden md:table-cell text-lg">
              Home City
            </TableHead>
            <TableHead className="hidden md:table-cell text-right text-lg">
              Exp (years)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {players.map((player, index) => (
            <TableRow key={index} className="h-20 md:h-24">
              <TableCell>
                <Avatar className="h-12 w-12 md:h-16 md:w-16">
                  <AvatarImage src={player.imageUrl} alt={player.firstName} />
                  <AvatarFallback>{player.firstName[0]}</AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell className="font-medium text-base md:text-lg">{`${player.firstName} ${player.lastName}`}</TableCell>
              <TableCell className="text-center text-base md:text-lg">
                {player.number}
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center">
                  <img
                    src={getPositionIcon(player.position)}
                    alt={player.position}
                    className="h-8 w-8 md:h-10 md:w-10 object-contain"
                  />
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell text-lg">
                {player.city}
              </TableCell>
              <TableCell className="hidden md:table-cell text-right text-lg">
                {player.experience}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
