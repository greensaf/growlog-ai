import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import { createReadStream } from 'fs';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);


export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST')
    return res.status(405).json({ message: 'Only POST allowed' });

  const form = new formidable.IncomingForm({
    uploadDir: '/tmp',
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('❌ Ошибка загрузки файла:', err);
      return res.status(500).json({ message: 'Ошибка загрузки' });
    }

    const file = Array.isArray(files.audio) ? files.audio[0] : files.audio;
    const filePath = (file as any).filepath || (file as any).path;
    const fileStream = createReadStream(filePath);



    const language = fields.language?.[0] || 'en'; // получаем язык с клиента

    if (!file) return res.status(400).json({ message: 'Нет файла audio' });


    // --- Step 1: Whisper ---
    const formData = new FormData();
    formData.append('file', fileStream as any, 'voice.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', language);

    const whisperRes = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
        },
        body: formData as any,
      }
    );

    const whisperJson = await whisperRes.json();
    const text = whisperJson.text;

    if (!text) {
      return res
        .status(500)
        .json({ message: 'Whisper не вернул текст', whisperJson });
    }

    console.log('✅ Whisper распознанный текст:', text);

    // --- Step 2: ChatGPT function_call ---
    const functions = [
     {
  name: 'saveGrowData',
  description: 'Сохраняет замеры параметров выращивания растения',
  parameters: {
    type: 'object',
    properties: {
      date: { type: 'string', description: 'Дата (например, 2025-04-17)' },
      time: { type: 'string', description: 'Время (например, 14:20)' },
      location: { type: 'string', description: 'Локация или помещение' },
      plantId: { type: 'string', description: 'ID растения' },
      strain: { type: 'string', description: 'Сорт растения' },
      regime: { type: 'string', description: 'Режим освещения или график' },
      cycleId: { type: 'string', description: 'ID текущего цикла' },
      cycleName: { type: 'string', description: 'Название цикла' },
      start: { type: 'string', description: 'Дата начала цикла' },
      startForm: { type: 'string', description: 'Форма старта (clone, seed, etc)' },
      sourceId: { type: 'string', description: 'ID источника' },
      tAir: { type: 'number', description: 'Температура воздуха' },
      tSubstrate: { type: 'number', description: 'Температура субстрата' },
      tSolution: { type: 'number', description: 'Температура раствора' },
      tOutside: { type: 'number', description: 'Темп. наружного воздуха' },
      hInside: { type: 'number', description: 'Влажность внутри' },
      hOutside: { type: 'number', description: 'Влажность снаружи' },
      EC: { type: 'number', description: 'Электропроводность раствора' },
      PH: { type: 'number', description: 'pH раствора' },
      VPD: { type: 'number', description: 'Дефицит давления пара' },
      PPFD: { type: 'number', description: 'Световой поток PPFD' },
      CO2: { type: 'number', description: 'Уровень CO₂ (ppm)' },
      Irrigation: { type: 'string', description: 'Схема или тип полива' },
      Event: { type: 'string', description: 'Событие (watering, feeding и т.п.)' },
      Comment: { type: 'string', description: 'Комментарий или наблюдение' },
      imageUrl: { type: 'string', description: 'Ссылка на изображение (если было загружено)' }
    },
    required: ['location', 'plantId', 'tAir'],
        },
      },
    ];

    const chatResponse = await fetch(
      'https://api.openai.com/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content:
                'Ты помощник гровера. Преобразуй распознанную фразу в структурированные grow-данные.',
            },
            {
              role: 'user',
              content: text,
            },
          ],
          functions,
          function_call: 'auto',
        }),
      }
    );

    const chatJson = await chatResponse.json();

    const extractedData =
      chatJson.choices?.[0]?.message?.function_call?.arguments &&
      JSON.parse(chatJson.choices[0].message.function_call.arguments);

    console.log('✅ Структурированные данные:', extractedData);

    const userId = fields.user?.[0] || 'anonymous';
    const sessionId = fields.sessionId?.[0] || 'session-' + Date.now();

    const { error } = await supabase.from('grow_logs').insert([
      {
        user_id: userId,
        session_id: sessionId,
        cycle_id: extractedData.cycleId || null,
        cycle_name: extractedData.cycleName || null,
        data: extractedData,
      },
    ]);

    if (error) {
      console.error('❌ Supabase insert error:', error);
    } else {
      console.log('✅ Данные сохранены в Supabase');
    }


    return res.status(200).json({
      ok: true,
      text,
      data: extractedData,
    });
  });
}
