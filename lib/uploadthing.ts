// lib/uploadthing.ts

import { createUploadthing, type FileRouter } from 'uploadthing/server';
import type { NextRequest } from 'next/server';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      // Можно добавить авторизацию или привязку к юзеру
      return { userId: 'anonymous' }; // заменить на userId если есть
    })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log('Upload complete:', file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
