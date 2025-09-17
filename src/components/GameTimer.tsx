import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

interface GameTimerProps {
  initialTime: number; // in seconds
  onTimeUp: () => void;
  isActive: boolean;
}

export const GameTimer = ({ initialTime, onTimeUp, isActive }: GameTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, onTimeUp]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 60) return 'text-destructive text-glow';
    if (timeLeft <= 300) return 'text-accent';
    return 'text-primary';
  };

  return (
    <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-border">
      <Clock className="w-5 h-5 text-muted-foreground" />
      <span className={`font-ancient font-bold text-xl ${getTimeColor()} transition-colors`}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
};