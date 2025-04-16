'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

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
  const { theme } = useTheme(); // определяем активную тему

  const baseTextColor = theme === 'dark' ? 'text-white' : 'text-black'; // по умолчанию: белый/чёрный

  return (
    <Button
      onClick={onClick}
      variant='ghost'
      size='icon'
      className={cn(
        'relative flex flex-col items-center justify-center rounded-md transition-all duration-300 p-0',
        'w-12 h-12', // квадратная форма
        className
      )}
    >
      {/* Кружок */}
      <span
        className={cn(
          'w-2 h-2 mb-1 rounded-full',
          isRecording ? 'bg-[#536C4A] animate-slowpulse' : 'bg-red-600'
        )}
      />
      {/* Надпись */}
      <span
        className={cn(
          'text-xs font-medium',
          isRecording ? 'text-[#536C4A]' : baseTextColor,
          !isRecording && 'transition-colors duration-300'
        )}
      >
        REC
      </span>
    </Button>
  );
}
