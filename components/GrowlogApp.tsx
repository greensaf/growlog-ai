// growlog.ai PWA MVP Interface with Vercel Auth support

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
import { Menu, LogOut, LogIn } from 'lucide-react';
import { UploadDropzone } from '@uploadthing/react';
import { generateReactHelpers } from '@uploadthing/react/hooks';
import type { OurFileRouter } from '@/lib/uploadthing';
import Recorder from 'recorder-js';
import type { GrowData } from '@/types/grow';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

const isIOS =
  typeof window !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent);

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export default function GrowlogApp() {
  const { user, isLoading } = useUser();
  const [recording, setRecording] = useState(false);
  const [flashlight, setFlashlight] = useState(false);
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

  useEffect(() => {
    if (!user) return;

    const startRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;

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

          recorder.ondataavailable = (event) => {
            audioChunksRef.current.push(event.data);
          };

          recorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, {
              type: 'audio/webm',
            });
            await uploadAudio(audioBlob);
            stream.getTracks().forEach((t) => t.stop());
          };

          recorder.start();
        }
      } catch (err) {
        console.error('Microphone error:', err);
        alert('Не удалось получить доступ к микрофону.');
        setRecording(false);
      }
    };

    const stopRecording = async () => {
      if (isIOS || typeof MediaRecorder === 'undefined') {
        const recorder = recorderJsRef.current;
        if (recorder) {
          const { blob } = await recorder.stop();
          await uploadAudio(blob);
        }
        streamRef.current?.getTracks().forEach((t) => t.stop());
      } else {
        mediaRecorderRef.current?.stop();
      }
    };

    if (recording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [recording, user]);

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

      const newData = {
        ...collectedData,
        ...json.data,
        cycleId: json.data?.cycleId || cycleId,
        cycleName:
          json.data?.cycleName ||
          collectedData?.cycleName ||
          'Unnamed Grow Cycle',
      };

      setCollectedData(newData);
      setAiAnalysis(
        typeof json.analysis === 'string'
          ? json.analysis
          : '✅ Всё идёт отлично! Записал данные.'
      );

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      const { error } = await supabase.from('grow_logs').insert([
        {
          user_id: user?.email || 'unknown',
          session_id: sessionId,
          cycle_id: newData.cycleId,
          cycle_name: newData.cycleName,
          timestamp: new Date().toISOString(),
          data: newData,
        },
      ]);

      if (error) {
        console.error('Supabase insert error:', error);
      }
    } catch (err) {
      console.error('Whisper error:', err);
      setAiAnalysis('Ошибка при расшифровке аудио.');
    }
  };

  const toggleRecording = () => {
    setRecording((prev) => !prev);
  };

  const handleFlashlightToggle = (checked: boolean) => {
    setFlashlight(checked);
    document.body.style.backgroundColor = checked ? '#00FF00' : '';
  };

  if (isLoading) return <div className='text-center mt-10'>Загрузка...</div>;
  if (!user) return null;

  return (
    <div className='max-w-[375px] h-[812px] mx-auto bg-white flex flex-col justify-between p-2 relative'>
      <div className='absolute top-2 right-2'>
        <Button
          variant='ghost'
          size='icon'
          className='w-13 h-13 scale-[0.8]'
          onClick={() => (window.location.href = '/api/auth/logout')}
        >
          <LogOut size={22} />
        </Button>
      </div>

      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger>
          <div className='w-16 h-16 bg-blue-200 rounded-full mx-auto mb-1 shadow flex items-center justify-center text-lg font-bold'>
            📋
          </div>
        </PopoverTrigger>
        <PopoverContent className='max-h-80 overflow-auto'>
          <pre className='text-xs whitespace-pre-wrap'>
            {collectedData
              ? JSON.stringify(collectedData, null, 2)
              : 'Нет данных.'}
          </pre>
        </PopoverContent>
      </Popover>

      {aiAnalysis && (
        <Alert className='mb-2'>
          <AlertTitle>Grow Tip of the Day</AlertTitle>
          <AlertDescription>{aiAnalysis}</AlertDescription>
        </Alert>
      )}

      <div className='flex items-center gap-2'>
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder='Optional text input...'
          className='text-sm flex-1'
        />
        <Button variant='outline' size='icon'>
          <Menu size={18} />
        </Button>
      </div>

      <div className='flex justify-between items-center mt-3'>
        <UploadDropzone
          endpoint='imageUploader'
          onClientUploadComplete={(res) => {
            if (res && res[0]?.url) {
              setCollectedData((prev) => ({ ...prev, imageUrl: res[0].url }));
            }
          }}
          onUploadError={(error: Error) => {
            console.error('Upload error:', error);
            alert('Upload failed. Please try again.');
          }}
        />

        <Button
          onClick={toggleRecording}
          className={`w-20 h-20 rounded-full text-white font-bold ${
            recording || inputText ? 'bg-orange-500' : 'bg-red-600'
          }`}
        >
          {recording || inputText ? 'AI' : 'REC'}
        </Button>

        <Switch checked={flashlight} onCheckedChange={handleFlashlightToggle} />
      </div>
    </div>
  );
}
