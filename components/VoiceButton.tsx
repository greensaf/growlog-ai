'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // или просто classNames, если у тебя есть утилита

interface VoiceButtonProps {
  isRecording: boolean;
  onClick: () => void;
  className?: string;
}

export function VoiceButton({
  isRecording,
  onClick,
  className,
}: VoiceButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant='ghost'
      size='icon'
      className={cn(
        'relative flex items-center justify-center gap-2 px-3 h-10 rounded-md transition-all duration-300',
        className
      )}
    >
      {/* Мигающий кружочек */}
      <span
        className={cn(
          'w-2 h-2 rounded-full',
          isRecording ? 'bg-[#536C4A] animate-slowpulse' : 'bg-red-600'
        )}
      />

      {/* Надпись */}
      <span
        className={cn(
          'text-sm font-medium',
          isRecording ? 'text-[#536C4A]' : 'text-red-600'
        )}
      >
        REC
      </span>
    </Button>
  );
}
