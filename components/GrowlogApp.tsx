// components/GrowlogApp.tsx
'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Menu, LogOut } from 'lucide-react';
import { UploadDropzone } from '@uploadthing/react';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import type { OurFileRouter } from '@/lib/uploadthing';
import Recorder from 'recorder-js';
import type { GrowData } from '@/types/grow';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '@/lib/useTheme';

const isIOS =
  typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent);

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export default function GrowlogApp() {
  /* ---------------- state / refs ---------------- */
  const { user, isLoading } = useUser();
  const { theme, toggleTheme } = useTheme();

  const [recording, setRecording] = useState(false);
  const [collectedData, setCollectedData] = useState<GrowData | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [inputText, setInputText] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recorderJsRef = useRef<any>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const sessionId = uuidv4();
  const cycleId = 'grow-' + (user?.email?.split('@')[0] || 'default');

  /* ---------------- helpers ---------------- */
  const getStream = async (): Promise<MediaStream | null> => {
    if (streamRef.current) {
      // повторное использование без запроса разрешения
      streamRef.current.getAudioTracks().forEach((t) => (t.enabled = true));
      return streamRef.current;
    }
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = s;
      return s;
    } catch (e) {
      console.error('getUserMedia error:', e);
      alert('Не удалось получить доступ к микрофону.');
      return null;
    }
  };

  const uploadAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    formData.append('user', user?.email || '');
    formData.append('sessionId', sessionId);
    formData.append('cycleId', cycleId);

    try {
      const res = await fetch('/api/whisper-chatgpt', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();

      setCollectedData(json.data); // строка из grow_logs
      setAiAnalysis(json.text || '✅ Всё записал!');
    } catch (error) {
      console.error('Error uploading audio:', error);
      alert('Failed to upload audio. Please try again.');
    }
  };

  /* ---------------- recording logic ---------------- */
  useEffect(() => {
    if (!user) return;

    const startRecording = async () => {
      const stream = await getStream();
      if (!stream) return;

      if (isIOS || typeof MediaRecorder === 'undefined') {
        const audioContext = new AudioContext();
        const recorder = new Recorder(audioContext);
        await recorder.init(stream);
        recorderJsRef.current = recorder;
        recorder.start();
      } else {
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        recorder.onstop = async () => {
          const blob = new Blob(audioChunksRef.current, {
            type: 'audio/webm',
          });
          await uploadAudio(blob);
          // поток НЕ останавливаем, просто отключаем звук
          stream.getAudioTracks().forEach((t) => (t.enabled = false));
        };

        recorder.start();
      }
    };

    const stopRecording = async () => {
      if (isIOS || typeof MediaRecorder === 'undefined') {
        const recorder = recorderJsRef.current;
        if (recorder) {
          const { blob } = await recorder.stop();
          await uploadAudio(blob);
        }
        streamRef.current?.getAudioTracks().forEach((t) => (t.enabled = false));
      } else {
        mediaRecorderRef.current?.stop();
      }
    };

    recording ? startRecording() : stopRecording();
  }, [recording, user]);

  // Очищаем поток при размонтировании
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleRecording = () => setRecording((p) => !p);

  /* ---------------- UI ---------------- */
  if (isLoading) return <div className='text-center mt-10'>Загрузка...</div>;
  if (!user) return null;

  return (
    <div className='max-w-[375px] h-[812px] mx-auto bg-background text-foreground flex flex-col justify-between p-2 relative transition-colors duration-700 ease-in-out rounded-xl shadow-xl border'>
      {/* logout */}
      <div className='absolute top-2 right-2'>
        <Button
          variant='ghost'
          size='icon'
          className='scale-90'
          onClick={() => {
            streamRef.current?.getTracks().forEach((t) => t.stop());
            window.location.href = '/api/auth/logout';
          }}
        >
          <LogOut size={20} />
        </Button>
      </div>

      {/* JSON popover */}
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger>
          <div className='w-16 h-16 bg-secondary rounded-full mx-auto mb-1 shadow flex items-center justify-center text-lg font-bold'>
            📋
          </div>
        </PopoverTrigger>
        <PopoverContent className='max-h-80 overflow-auto bg-background border'>
          <pre className='text-xs whitespace-pre-wrap'>
            {collectedData
              ? JSON.stringify(collectedData, null, 2)
              : 'Нет данных.'}
          </pre>
        </PopoverContent>
      </Popover>

      {/* AI analysis */}
      {aiAnalysis && (
        <Alert className='mb-2 border'>
          <AlertTitle>Grow Tip of the Day</AlertTitle>
          <AlertDescription>{aiAnalysis}</AlertDescription>
        </Alert>
      )}

      {/* input + menu */}
      <div className='flex items-center gap-2'>
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='Optional text input…'
          className='flex-1 text-sm'
        />
        <Button variant='outline' size='icon'>
          <Menu size={18} />
        </Button>
      </div>

      {/* footer: upload / REC / theme */}
      <div className='flex justify-between items-center mt-3'>
        <UploadDropzone<OurFileRouter>
          endpoint='imageUploader'
          onClientUploadComplete={(res) => {
            if (res && res[0]?.url) {
              setCollectedData((prev) =>
                prev
                  ? { ...prev, imageUrl: res[0].url }
                  : { imageUrl: res[0].url }
              );
            }
          }}
          onUploadError={(e) => {
            console.error('Upload error:', e);
            alert('Upload failed.');
          }}
        />

        <Button
          onClick={toggleRecording}
          className={`w-20 h-20 rounded-full text-white font-bold transition-all duration-500 ${
            recording || inputText ? 'bg-orange-500' : 'bg-red-600'
          }`}
        >
          {recording || inputText ? 'AI' : 'REC'}
        </Button>

        <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
      </div>
    </div>
  );
}
