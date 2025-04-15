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
    <form onSubmit={handleSend} className="flex items-center gap-2 px-4 sm:px-6 md:px-8 lg:px-12 py-3 w-full">
      <Input
        placeholder="Press the button and speak..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-[75%]"
      />
      <div className="flex justify-end w-[25%]">
        <VoiceButton isRecording={isRecording} onClick={toggleRecording} />
      </div>
    </form>
  );
}