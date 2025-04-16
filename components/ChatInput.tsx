'use client';

import { VoiceButton } from '@/components/VoiceButton';

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
  // Симуляция распознавания — замените позже на реальное использование Whisper
  const simulateRecognition = async () => {
    // В будущем — сюда подставится результат голосового ввода
    const simulatedText = 'Simulated voice input';
    handleSend(simulatedText);
  };

  const handleClick = async () => {
    toggleRecording();

    // Пока просто имитируем окончание записи через 2 секунды
    if (!isRecording) {
      setTimeout(async () => {
        toggleRecording(); // завершили запись
        await simulateRecognition();
      }, 2000);
    }
  };

  return (
    <div className='flex items-center justify-end px-4 sm:px-6 md:px-8 lg:px-12 py-3 w-full pb-[calc(env(safe-area-inset-bottom)+8px)] bg-background'>
      <div className='w-full max-w-[72px]'>
        <VoiceButton isRecording={isRecording} onClick={handleClick} />
      </div>
    </div>
  );
}
