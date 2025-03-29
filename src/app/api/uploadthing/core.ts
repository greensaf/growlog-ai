import { createUploadthing, type FileRouter } from 'uploadthing/next';

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '8MB' } }).onUploadComplete(
    async ({ file }) => {
      console.log('Upload complete for file:', file);
    }
  ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
