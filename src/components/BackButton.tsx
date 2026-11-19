import * as React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

function BackButton({
  to,
  children,
  className,
}: BackButtonProps): React.ReactElement {
  return (
    <Button asChild className={cn(className)}>
      <Link to={to}>
        <ArrowLeft />
        {children}
      </Link>
    </Button>
  );
}

export { BackButton, type BackButtonProps };
