import { put, del } from '@vercel/blob';

export class BlobError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message);
    this.name = 'BlobError';
  }
}

export async function uploadImage(file: File, filename: string): Promise<string> {
  try {
    const blob = await put(filename, file, {
      access: 'public',
    });
    
    return blob.url;
  } catch (error) {
    throw new BlobError('Failed to upload image', error);
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    throw new BlobError('Failed to delete image', error);
  }
}

export function generateFilename(originalName: string, category: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop() || 'jpg';
  
  return `images/${category}/${timestamp}-${randomString}.${extension}`;
}
