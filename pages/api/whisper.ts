import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false, // важно: т.к. мы работаем с FormData
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const chunks: Uint8Array[] = [];

  // собираем поток вручную, т.к. нет bodyParser
  req.on('data', (chunk) => {
    chunks.push(chunk);
  });

  req.on('end', () => {
    console.log('Аудио пришло! Размер:', Buffer.concat(chunks).length);
    res.status(200).json({ ok: true, message: 'Аудио получено' });
  });
}
