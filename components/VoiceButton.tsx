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
        className={`w-[80px] font-semibold py-2 rounded-md transition-all text-center ${
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
      {isRecording && (
        <div className="flex items-end gap-[2px] h-5 ml-2" style={{ animation: 'fadeIn 0.3s ease-in-out' }}>
          <div className="w-[2px] h-3 bg-[#536C4A] animate-[ping_0.8s_ease-in-out_infinite]" />
          <div className="w-[2px] h-5 bg-[#536C4A] animate-[ping_1.1s_ease-in-out_infinite]" />
          <div className="w-[2px] h-4 bg-[#536C4A] animate-[ping_0.9s_ease-in-out_infinite]" />
          <div className="w-[2px] h-2 bg-[#536C4A] animate-[ping_1.2s_ease-in-out_infinite]" />
          <div className="w-[2px] h-3 bg-[#536C4A] animate-[ping_1s_ease-in-out_infinite]" />
        </div>
      )}
    </div>
  );
}