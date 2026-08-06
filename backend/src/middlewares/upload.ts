import multer from 'multer';
import { AppError } from '../utils/appError';

const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf']);

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) => {
    if (!allowed.has(file.mimetype)) return cb(new AppError('Unsupported file type', 415));
    return cb(null, true);
  }
});
