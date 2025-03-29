'use client';

import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';

export const VoiceRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    audioChunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    recorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', blob);
      formData.append('model', 'whisper-1');

      const res = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setTranscript(data.text);
    };

    recorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className='flex flex-col items-center gap-4'>
      <Button
        variant={recording ? 'destructive' : 'default'}
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? '🟥 Stop' : '🔴 REC'}
      </Button>

      {transcript && (
        <div className='w-full p-2 rounded bg-muted text-sm'>{transcript}</div>
      )}
    </div>
  );
};
