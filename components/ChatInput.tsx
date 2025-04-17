'use client';

import { useState, useRef, useEffect } from 'react';
import { VoiceButton } from '@/components/VoiceButton';
import { SendHorizonal } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

  const handleMicClick = async () => {
    toggleRecording();

    if ('vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]);
    }

    if (!isRecording) {
      setTimeout(() => {
        toggleRecording();
        handleSend('Simulated voice input');
      }, 2000);
    }
  };
  //      className='flex items-end gap-2 px-4 sm:px-6 md:px-8 lg:px-12 py-3 bg-background w-full'

  return (
    <form
      onSubmit={handleSubmit}
      className='flex items-end gap-2 px-4 py-3 w-full bg-background pb-[calc(env(safe-area-inset-bottom)+18px)]'
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder='Type your message...'
        className='flex-1 resize-none rounded-md border bg-background text-foreground placeholder:text-muted-foreground px-4 py-3 max-h-40 overflow-auto focus:outline-none text-base h-12' // <= фиксированная начальная высота
      />

      {text.length === 0 ? (
        <VoiceButton
          isRecording={isRecording}
          onClick={handleMicClick}
          className='w-16 h-12'
        />
      ) : (
        <Button
          type='submit'
          size='icon'
          className='w-16 h-12 text-[#536C4A] border border-[#536C4A]'
          variant='ghost'
        >
          <SendHorizonal size={20} />
        </Button>
      )}
    </form>
  );
}
