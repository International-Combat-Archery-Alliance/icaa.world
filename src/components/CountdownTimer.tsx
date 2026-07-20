import { useState, useEffect, type JSX } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

const calculateTimeLeft = (targetDate: string) => {
  const difference = +new Date(targetDate) - +new Date();
  let timeLeft = {};

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents: JSX.Element[] = [];

  Object.entries(timeLeft).forEach(([interval, value]) => {
    if (value === undefined) return;

    timerComponents.push(
      <div key={interval} className="flex flex-col items-center">
        <span className="text-4xl md:text-5xl font-bold text-primary">
          {String(value).padStart(2, '0')}
        </span>
        <span className="text-xs uppercase text-muted-foreground">
          {interval}
        </span>
      </div>,
    );
  });

  return (
    <div className="flex justify-center gap-4 md:gap-8 my-4">
      {timerComponents.length ? (
        timerComponents
      ) : (
        <span>Event has started!</span>
      )}
    </div>
  );
}
