'use client';

import { Button } from "@/components/ui/button";

interface VoiceButtonProps {
  isRecording: boolean;
  onClick: () => void;
}

export function VoiceButton({ isRecording, onClick }: VoiceButtonProps) {
  return (
    <div className="flex items-center">
      <Button
        type="button"
        size="sm"
        onClick={onClick}
        className={`w-[80px] min-w-[80px] max-w-[80px] font-semibold py-2 rounded-md transition-all text-center ${
          isRecording
            ? "bg-[#536C4A] text-white animate-pulse shadow-[0_0_10px_#536C4A]"
            : "bg-black text-red-600 hover:bg-gray-900"
        }`}
      >
        {isRecording ? (
          <span className="flex items-center gap-2 justify-center">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            AI
          </span>
        ) : (
          "REC"
        )}
      </Button>
    </div>
  );
}