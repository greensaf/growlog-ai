'use client';

import { VoiceButton } from '@/components/VoiceButton';
import { useState, useRef, useEffect } from 'react';

interface ChatInputProps {
  isRecording: boolean;
  toggleRecording: () => void;
  handleSend: (text: string) => void;
}

export function ChatInput({
  isRecording,
  toggleRecording,
  handleSend,
}: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Автоматическая подгонка высоты textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      handleSend(text);
      setText('');
    }
  };

  const handleClick = async () => {
    toggleRecording();
    if (!isRecording) {
      setTimeout(() => {
        toggleRecording();
        handleSend('Simulated voice input');
      }, 2000);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex items-end gap-2 px-4 sm:px-6 md:px-8 lg:px-12 py-3 w-full bg-background pb-[calc(env(safe-area-inset-bottom)+8px)]'
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Type your message...'
        className='flex-1 resize-none rounded-md border bg-background text-foreground placeholder:text-muted-foreground px-4 py-3 max-h-40 overflow-auto focus:outline-none'
      />
      <VoiceButton isRecording={isRecording} onClick={handleClick} />
    </form>
  );
}
