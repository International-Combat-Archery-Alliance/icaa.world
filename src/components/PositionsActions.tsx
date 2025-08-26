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
    <Card className="w-full flex flex-row items-center p-4 gap-6">
      <img
        width="150"
        src={
          isHovered
            ? 'images/action shots/' + actionshot + '.png'
            : 'images/logos/' + icon + '.png'
        }
        alt={`${position}'s Icon`}
        className="position-icon flex-shrink-0 rounded-lg"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      <div className="flex flex-col">
        <CardHeader className="p-0">
          <CardTitle className="text-xl font-bold text-secondary">
            {position + ':'}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 mt-2">{description}</CardContent>
      </div>
    </Card>
  );
};
export default Positions;
