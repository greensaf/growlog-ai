'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import PhotoUploader from '@/components/PhotoUploader';
import type { GrowLogEntry } from '@/types/GrowLogEntry';

export default function JournalPage() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [structuredData, setStructuredData] = useState<GrowLogEntry | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [photoLog, setPhotoLog] = useState<Record<string, string[]>>({});
  const [prompt, setPrompt] = useState(
    'Есть ли признаки стрессов у растения на фото?'
  );
  const [visionResult, setVisionResult] = useState<string>('');

  let mediaRecorder: MediaRecorder;
  let audioChunks: Blob[] = [];

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (e) => {
      audioChunks.push(e.data);
    };

    mediaRecorder.onstop = async () => {
      setLoading(true);
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append('file', audioBlob);
      formData.append('model', 'whisper-1');

      const whisperRes = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });

      const whisperData = await whisperRes.json();
      setTranscript(whisperData.text);

      const parseRes = await fetch('/api/parse-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: whisperData.text }),
      });

      const structured: GrowLogEntry = await parseRes.json();
      if (uploadedUrl && structured?.plantId) {
        const plantId = structured.plantId;
        setPhotoLog((prev) => ({
          ...prev,
          [plantId]: [...(prev[plantId] || []), uploadedUrl],
        }));
      }

      setStructuredData(structured);

      await fetch('/api/save-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plantId: structured.plantId,
          data: structured,
          transcript: whisperData.text,
          photos: [...(photoLog[structured.plantId] || []), uploadedUrl].filter(
            Boolean
          ),
        }),
      });

      setUploadedUrl(null);
      setLoading(false);
    };

    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    setRecording(false);
  };

  const handleAnalyzeImage = async () => {
    if (!uploadedUrl) return;

    const res = await fetch('/api/analyze-image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: uploadedUrl, prompt }),
    });

    const data = await res.json();
    setVisionResult(data.result);
  };

  return (
    <div className='space-y-2 text-sm'>
      <h2 className='text-lg font-bold'>🌱 Запись Growlog</h2>

      {structuredData ? (
        <pre className='bg-muted p-2 rounded max-h-72 overflow-auto text-xs'>
          {JSON.stringify(structuredData, null, 2)}
        </pre>
      ) : (
        <p className='text-muted-foreground'>Нажмите REC и начните говорить.</p>
      )}

      <PhotoUploader onUpload={(url) => setUploadedUrl(url)} />

      {uploadedUrl && (
        <div className='space-y-2'>
          <img
            src={uploadedUrl}
            alt='Uploaded'
            className='mt-2 w-full rounded'
          />

          <input
            type='text'
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='Введите вопрос к AI...'
            className='w-full text-xs p-2 border rounded bg-white border-gray-300'
          />

          <Button
            variant='outline'
            className='w-full text-xs'
            onClick={handleAnalyzeImage}
          >
            🔍 Анализ фото AI
          </Button>

          {visionResult && (
            <div className='p-2 text-sm bg-gray-100 rounded text-gray-800'>
              🧠 <strong>AI ответ:</strong> {visionResult}
            </div>
          )}
        </div>
      )}

      {structuredData?.plantId && photoLog[structuredData.plantId] && (
        <div className='mt-4'>
          <h3 className='text-sm font-semibold mb-1'>
            📸 Фото для {structuredData.plantId}:
          </h3>
          <div className='grid grid-cols-2 gap-2'>
            {photoLog[structuredData.plantId].map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`plant ${index}`}
                className='w-full rounded'
              />
            ))}
          </div>
        </div>
      )}

      <div className='flex items-center justify-between mt-4'>
        <Button
          className='w-24 h-24 rounded-full text-white text-xl bg-red-600 hover:bg-red-700'
          onClick={recording ? stopRecording : startRecording}
        >
          {recording ? '■' : '●'}
        </Button>

        <span className='text-sm text-muted-foreground ml-2'>[REC]</span>
      </div>
    </div>
  );
}
