'use client';

import { Input } from "@/components/ui/input";
import { VoiceButton } from "@/components/VoiceButton";

interface ChatInputProps {
  input: string;
  setInput: (text: string) => void;
  isRecording: boolean;
  toggleRecording: () => void;
  handleSend: (e: React.FormEvent) => void;
}

export function ChatInput({
  input,
  setInput,
  isRecording,
  toggleRecording,
  handleSend,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSend} className="flex items-center gap-2 p-3">
      {!isRecording ? (
        <>
          <Input
            placeholder="Press the button and speak..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-[0.75]"
          />
          <VoiceButton isRecording={isRecording} onClick={toggleRecording} />
        </>
      ) : (
        <div className="ml-auto flex items-center gap-2">
          {/* Волны уже внутри VoiceButton */}
          <VoiceButton isRecording={isRecording} onClick={toggleRecording} />
        </div>
      )}
    </form>
  );
}