'use client';

import { Button } from '@/components/ui/button';

interface VoiceButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

export function VoiceButton({ isRecording, onClick }: VoiceButtonProps) {
  return (
    <Button
      onClick={onClick}
      variant="ghost"
      size="lg"
      className={`relative flex items-center justify-center gap-2 px-3 h-10 sm:h-11 md:h-12 rounded-md w-full transition-all duration-300
        bg-black dark:bg-white text-red-600`}
    >
      {/* Кружок — мигает при записи */}
      <span
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isRecording ? 'bg-red-600 animate-ping' : 'bg-red-600'
        }`}
      />

      {/* Надпись "REC" — пульсирует при записи */}
      <span
        className={`text-sm sm:text-base md:text-lg font-semibold ${
          isRecording ? 'animate-pulse' : ''
        }`}
      >
        REC
      </span>
    </Button>
  );
}