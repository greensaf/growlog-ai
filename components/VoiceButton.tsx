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
      variant="default"
      className="relative flex items-center justify-center gap-2 px-4 py-2"
    >
      <span
        className={`w-2 h-2 rounded-full transition-all duration-200 ${
          isRecording ? 'bg-red-500 animate-ping' : 'bg-transparent'
        }`}
      />
      <span className="text-sm font-semibold">
        {isRecording ? 'AI' : 'REC'}
      </span>
    </Button>
  );
}