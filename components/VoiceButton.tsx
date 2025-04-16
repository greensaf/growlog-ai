'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useRef, useEffect } from 'react';

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
  const { resolvedTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Автофокус на кнопке при монтировании
  useEffect(() => {
    if (buttonRef.current) {
      buttonRef.current.focus();
    }
  }, []);

  const backgroundColor = resolvedTheme === 'dark' ? 'bg-white' : 'bg-black';

  return (
    <Button
      ref={buttonRef}
      onClick={onClick}
      variant='ghost'
      size='icon'
      className={cn(
        'relative flex items-center justify-center gap-2 h-12 w-16 rounded-md transition-all duration-300',
        backgroundColor,
        className
      )}
    >
      {/* Кружочек слева */}
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
