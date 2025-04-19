import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { createReadStream } from 'fs';
import { createClient, PostgrestError } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('⛔️ NEXT_PUBLIC_SUPABASE_ANON_KEY is undefined at runtime');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('⛔️ NEXT_PUBLIC_SUPABASE_URL is undefined at runtime');
}


export const config = { api: { bodyParser: false } };

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
    if (err) return res.status(500).json({ message: 'Upload error', err });

    const file = Array.isArray(files.audio) ? files.audio[0] : files.audio;
    if (!file) return res.status(400).json({ message: 'Нет файла audio' });

    const fileStream = createReadStream(
      (file as any).filepath || (file as any).path
    );
    const language = fields.language?.[0] || 'en';

    /* ---------- Whisper ----------- */
    const fd = new FormData();
    fd.append('file', fileStream as any, 'voice.webm');
    fd.append('model', 'whisper-1');
    fd.append('language', language);

    const whisperJson = await fetch(
      'https://api.openai.com/v1/audio/transcriptions',
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY!}` },
        body: fd as any,
      }
    ).then((r) => r.json());

    const text = whisperJson.text as string | undefined;
    if (!text)
      return res.status(500).json({ message: 'Whisper empty', whisperJson });

    // --- Step 2: ChatGPT function_call ---
    const functions = [
      {
        name: 'saveGrowData',
        description: 'Сохраняет замеры параметров выращивания растения',
        parameters: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              description: 'Дата (например, 2025-04-17)',
            },
            time: { type: 'string', description: 'Время (например, 14:20)' },
            location: { type: 'string', description: 'Локация или помещение' },
            plantId: { type: 'string', description: 'ID растения' },
            strain: { type: 'string', description: 'Сорт растения' },
            regime: {
              type: 'string',
              description: 'Режим освещения или график',
            },
            cycleId: { type: 'string', description: 'ID текущего цикла' },
            cycleName: { type: 'string', description: 'Название цикла' },
            start: { type: 'string', description: 'Дата начала цикла' },
            startForm: {
              type: 'string',
              description: 'Форма старта (clone, seed, etc)',
            },
            sourceId: { type: 'string', description: 'ID источника' },
            tAir: { type: 'number', description: 'Температура воздуха' },
            tSubstrate: {
              type: 'number',
              description: 'Температура субстрата',
            },
            tSolution: { type: 'number', description: 'Температура раствора' },
            tOutside: {
              type: 'number',
              description: 'Темп. наружного воздуха',
            },
            hInside: { type: 'number', description: 'Влажность внутри' },
            hOutside: { type: 'number', description: 'Влажность снаружи' },
            EC: { type: 'number', description: 'Электропроводность раствора' },
            PH: { type: 'number', description: 'pH раствора' },
            VPD: { type: 'number', description: 'Дефицит давления пара' },
            PPFD: { type: 'number', description: 'Световой поток PPFD' },
            CO2: { type: 'number', description: 'Уровень CO₂ (ppm)' },
            Irrigation: { type: 'string', description: 'Схема или тип полива' },
            Event: {
              type: 'string',
              description: 'Событие (watering, feeding и т.п.)',
            },
            Comment: {
              type: 'string',
              description: 'Комментарий или наблюдение',
            },
            imageUrl: {
              type: 'string',
              description: 'Ссылка на изображение (если было загружено)',
            },
          },
          required: ['location', 'plantId', 'tAir'],
        },
      },
    ];

    const chatJson = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: 'Ты помощник гровера...' },
          { role: 'user', content: text },
        ],
        functions,
        function_call: 'auto',
      }),
    }).then((r) => r.json());

    const extracted = JSON.parse(
      chatJson.choices?.[0]?.message?.function_call?.arguments || '{}'
    ); // GrowData

    /* ---------- собираем строку для табличных колонок ----------- */
    const row = {
      user_id: fields.user?.[0] || 'anonymous',
      session_id: fields.sessionId?.[0] || `session-${Date.now()}`,

      cycle_id: extracted.cycleId ?? null,
      cycle_name: extracted.cycleName ?? null,

      date: extracted.date ?? null,
      time: extracted.time ?? null,
      location: extracted.location ?? null,
      regime: extracted.regime ?? null,
      plant_id: extracted.plantId ?? null,
      strain: extracted.strain ?? null,
      start: extracted.start ?? null,
      start_form: extracted.startForm ?? null,
      source_id: extracted.sourceId ?? null,

      t_outside: extracted.tOutside ?? null,
      t_air: extracted.tAir ?? null,
      t_solution: extracted.tSolution ?? null,
      t_substrate: extracted.tSubstrate ?? null,
      h_inside: extracted.hInside ?? null,
      h_outside: extracted.hOutside ?? null,
      co2: extracted.CO2 ?? null,
      vpd: extracted.VPD ?? null,
      ppfd: extracted.PPFD ?? null,
      ec: extracted.EC ?? null,
      ph: extracted.PH ?? null,

      irrigation: extracted.Irrigation ?? null,
      event: extracted.Event ?? null,
      comment: extracted.Comment ?? null,
      image_url: extracted.imageUrl ?? null,
    };

    const { error: insertError, data } = await supabase
      .from('grow_logs')
      .insert([row])
      .select();
    if (insertError) {
      console.error('❌ Supabase insert error', insertError);
      return res.status(500).json({ message: 'DB insert failed', insertError });
    }

    return res.status(200).json({ ok: true, text, data: data?.[0] });
  });
}
