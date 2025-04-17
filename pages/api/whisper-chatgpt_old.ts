import type { NextApiRequest, NextApiResponse } from "next";
import { OpenAI } from "openai";
import formidable from "formidable";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const form = new formidable.IncomingForm({ uploadDir: "/tmp", keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err || !files.audio) {
      console.error("File parsing error:", err);
      return res.status(400).json({ error: "Audio file missing or broken" });
    }

    const audio = Array.isArray(files.audio) ? files.audio[0] : files.audio;
    const audioPath = audio.filepath;

    try {
      const transcript = await openai.audio.transcriptions.create({
        file: fs.createReadStream(audioPath),
        model: "whisper-1",
        language: "ru",
      });

      const text = transcript.text;

      const response = await openai.chat.completions.create({
        model: "gpt-4-1106-preview",
        messages: [
          { role: "system", content: "Ты агроном-ассистент. Преобразуй речь гровера в JSON-объект с параметрами для журнала." },
          { role: "user", content: text }
        ],
        functions: [{
          name: "saveGrowData",
          parameters: {
            type: "object",
            properties: {
              date: { type: "string" },
              time: { type: "string" },
              plantId: { type: "string" },
              tAir: { type: "number" },
              PH: { type: "number" },
              Event: { type: "string" },
              Comment: { type: "string" }
            }
          }
        }],
        function_call: { name: "saveGrowData" }
      });

      const functionCall = response.choices[0].message.function_call;
      const parsed = functionCall?.arguments ? JSON.parse(functionCall.arguments) : {};

      await supabase.from("grow_data").insert([parsed]);

      return res.status(200).json({
        data: parsed,
        analysis: `✅ Сохранено в базу. Получено: ${Object.keys(parsed).join(", ") || "ничего"}`
      });
    } catch (err) {
      console.error("API error:", err);
      return res.status(500).json({ error: "Internal error" });
    } finally {
      fs.unlink(audioPath, () => {});
    }
  });
}