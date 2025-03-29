import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { parseGrowerLogFunction } from '@/lib/parseGrowerLogFunction';
import type { GrowLogEntry } from '@/types/GrowLogEntry';
import { PrismaClient } from '@prisma/client';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { transcript } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4-1106-preview',
    messages: [
      {
        role: 'system',
        content: 'Ты агроном-аналитик. Извлекай данные из текстового growlog.',
      },
      {
        role: 'user',
        content: transcript,
      },
    ],
    functions: [parseGrowerLogFunction],
    function_call: { name: 'parseGrowerLogEntry' },
  });

  const rawArgs = response.choices[0].message.function_call?.arguments;
  if (!rawArgs) {
    return NextResponse.json(
      { error: 'No structured data returned' },
      { status: 400 }
    );
  }

  const structured: GrowLogEntry = JSON.parse(rawArgs);

  // Сохраняем лог в базу данных
  await prisma.growLog.create({
    data: {
      plantId: structured.plantId,
      data: structured,
      transcript,
      photos: [], // можно добавить позже в отдельном шаге
    },
  });

  return NextResponse.json(structured);
}
