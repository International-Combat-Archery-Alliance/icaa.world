import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PositionProps {
  position: string;
  description: string;
  icon: string;
  actionshot: string;
}

const Positions: React.FC<PositionProps> = ({
  position,
  description,
  icon,
  actionshot,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card className="flex w-full flex-col items-center gap-6 p-4 md:flex-row">
      <img
        src={isHovered ? actionshot : icon}
        alt={`${position}'s Icon`}
        className="h-[150px] w-[150px] flex-shrink-0 rounded-lg object-cover"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <div className="flex flex-col">
        <CardHeader className="p-0">
          <CardTitle className="text-secondary text-xl font-bold">
            {position + ':'}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-2 p-0">{description}</CardContent>
      </div>
    </Card>
  );
};
export default Positions;
