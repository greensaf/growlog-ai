'use client';

import { UploadDropzone } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';

export default function PhotoUploader({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  return (
    <UploadDropzone<OurFileRouter, 'imageUploader'>
      endpoint='imageUploader'
      onClientUploadComplete={(res) => {
        if (res && res[0]?.url) {
          onUpload(res[0].url);
        }
      }}
      onUploadError={(error: Error) => {
        alert(`Ошибка загрузки: ${error.message}`);
      }}
      appearance={{
        button: 'hidden',
        container:
          'flex flex-col items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-md w-full bg-gray-50 hover:bg-gray-100 cursor-pointer transition',
        label: 'text-sm text-muted-foreground',
      }}
      content={{
        label: (
          <div className='flex flex-col items-center text-muted-foreground'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-8 w-8 text-gray-400 mb-1'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
              strokeWidth={1.5}
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M3 16.5V14a4.5 4.5 0 014.5-4.5h1.55a4.5 4.5 0 013.9 2.25M19.5 13.5V12a4.5 4.5 0 00-4.5-4.5h-.379a4.5 4.5 0 00-3.878 2.086'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M16.5 16.5L12 12m0 0l-4.5 4.5M12 12v9'
              />
            </svg>
            <span>Перетащи фото сюда или кликни</span>
          </div>
        ),
      }}
    />
  );
}
