import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as Blob;
  const buffer = Buffer.from(await file.arrayBuffer());

  const whisperRes = await fetch(
    'https://api.openai.com/v1/audio/transcriptions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: (() => {
        const fd = new FormData();
        fd.append(
          'file',
          new Blob([buffer], { type: 'audio/webm' }),
          'voice.webm'
        );
        fd.append('model', 'whisper-1');
        return fd;
      })(),
    }
  );

  const result = await whisperRes.json();
  return NextResponse.json(result);
}
