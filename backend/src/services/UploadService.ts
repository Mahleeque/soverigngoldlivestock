import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../config/cloudinary';
import { AppError } from '../utils/appError';

export class UploadService {
  async uploadBuffer(file: Express.Multer.File, folder: string): Promise<string> {
    if (!cloudinary.config().cloud_name) throw new AppError('Cloudinary is not configured', 503);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: file.mimetype.startsWith('video/') ? 'video' : file.mimetype === 'application/pdf' ? 'raw' : 'image',
          secure: true
        },
        (error, uploaded) => {
          if (error || !uploaded) reject(error || new Error('Upload failed'));
          else resolve(uploaded);
        }
      );
      stream.end(file.buffer);
    });

    return result.secure_url;
  }
}

export const uploadService = new UploadService();
