import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';

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
  teamColor?: string;
}

const getPositionIcon = (position: string) => {
  const positionMap: Record<string, string> = {
    centerback:
      'https://assets.icaa.world/e58af81b-af45-4e23-b82f-3c54839d0eff.webp',
    flex: 'https://assets.icaa.world/714c4f1a-11f4-45d4-bdc8-2c1b9a10f65c.webp',
    forward:
      'https://assets.icaa.world/492fba5b-aed6-430b-9c97-2d6d56885eff.webp',
    'rear guard':
      'https://assets.icaa.world/912721cf-cbaf-4a83-b004-ab9ac6cec9c9.webp',
  };
  return positionMap[position.toLowerCase()] || '/images/logos/Flex.png';
};

export function PlayerRoster({ players, teamColor }: PlayerRosterProps) {
  const headerTextColor = teamColor === '#70b2e0' ? 'text-black' : 'text-white';

  return (
    <div className="overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow
            className="hover:bg-transparent"
            style={teamColor ? { backgroundColor: teamColor } : {}}
          >
            <TableHead className="w-[60px] md:w-[80px]"></TableHead>
            <TableHead className={`text-base md:text-lg ${headerTextColor}`}>
              Name
            </TableHead>
            <TableHead
              className={`text-center text-base md:text-lg ${headerTextColor}`}
            >
              #
            </TableHead>
            <TableHead
              className={`text-center text-base md:text-lg ${headerTextColor}`}
            >
              Position
            </TableHead>
            <TableHead
              className={`hidden md:table-cell text-lg ${headerTextColor}`}
            >
              Home City
            </TableHead>
            <TableHead
              className={`hidden md:table-cell text-right text-lg ${headerTextColor}`}
            >
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
                  <AvatarFallback className="bg-muted">
                    <User className="h-8 w-8 text-muted-foreground" />
                  </AvatarFallback>
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
