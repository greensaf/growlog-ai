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
    className={`relative flex items-center justify-center gap-2 px-6 h-12 sm:h-14 md:h-16 rounded-md w-full transition-all duration-300 
  bg-black dark:bg-white text-red-600`}
    >
      <span
        className={`w-2 h-2 rounded-full transition-all duration-300 ${
          isRecording ? 'bg-red-600 animate-ping' : 'bg-red-600'
        }`}
      />
      <span className="text-sm sm:text-base md:text-lg font-semibold">REC</span>
    </Button>
  );
}