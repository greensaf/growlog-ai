//ChatInput.tsx
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

    if ('vibrate' in navigator) navigator.vibrate([50, 30, 50]);

    if (!isRecording) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

        // отправляем на сервер
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice.webm');

        try {
          const res = await fetch('/api/whisper', {
            method: 'POST',
            body: formData,
          });

          const result = await res.json();
          console.log('Ответ от whisper:', result);
        } catch (error) {
          console.error('Ошибка отправки аудио:', error);
        }

        stream.getTracks().forEach((track) => track.stop());
      };

      recorder.start();

      setTimeout(() => {
        recorder.stop();
        toggleRecording(); // прекращаем анимацию
      }, 3000); // 3 секунды записи
    }
  };



  return (
    <form
      onSubmit={handleSubmit}
      className='flex items-end gap-2 px-4 py-3 w-full bg-background pb-[calc(env(safe-area-inset-bottom)+42px)]'
      
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
