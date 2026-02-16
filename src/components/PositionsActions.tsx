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
    <Card className="w-full flex flex-col md:flex-row items-center p-4 gap-6">
      <img
        src={isHovered ? actionshot : icon}
        alt={`${position}'s Icon`}
        className="flex-shrink-0 rounded-lg w-[150px] h-[150px] object-cover"
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
