import axios from 'axios';
import { cloudinaryConfig } from './config';

export interface UploadProgress {
  progress: number;
  downloadURL?: string;
  error?: string;
}

export async function uploadVideo(
  file: File,
  path: string,
  onProgress: (progress: number) => void
): Promise<{ downloadURL: string; cloudinaryPath: string; publicId: string }> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'video_upload_preset');
  formData.append('public_id', path);
  formData.append('resource_type', 'video');

  const url = `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/video/upload`;

  onProgress(0);

  const response = await axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  onProgress(100);

  const downloadURL = response.data.secure_url;
  const cloudinaryPath = response.data.public_id;
  const publicId = response.data.public_id;

  return { downloadURL, cloudinaryPath, publicId };
}

export async function deleteVideo(publicId: string): Promise<void> {
  // Deletion requires server-side API
  throw new Error('Deletion must be done via server-side API');
}

export function generateVideoPath(creatorId: string, fileName: string): string {
  const timestamp = Date.now();
  const sanitized = fileName.replace(/[^a-zA-Z0-9.]/g, '_');
  return `videos/${creatorId}/${timestamp}_${sanitized}`;
}