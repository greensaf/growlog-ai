'use client';

import { Button } from '@/components/ui/button';

interface VoiceButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

export function VoiceButton({ isRecording, onClick }: VoiceButtonProps) {
  const pulseColor = '#536C4A'; // зелёный при записи
  const idleColor = 'text-red-600'; // красный при простое

  return (
    <Button
      onClick={onClick}
      variant='ghost'
      size='lg'
      aria-label={isRecording ? 'Stop recording' : 'Start recording'}
      className={`
        relative flex items-center justify-center gap-2 px-3 h-10 sm:h-11 md:h-12 w-full rounded-md
        bg-black dark:bg-white ${idleColor} transition-all duration-300
        focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary
      `}
    >
      <span
        className={`
          w-2 h-2 rounded-full transition-all duration-300
          ${isRecording ? `bg-[${pulseColor}] animate-ping` : 'bg-red-600'}
        `}
      />
      <span
        className={`
          text-sm sm:text-base md:text-lg font-semibold transition-colors duration-300
          ${isRecording ? `text-[${pulseColor}] animate-slowpulse` : idleColor}
        `}
      >
        REC
      </span>
    </Button>
  );
}
