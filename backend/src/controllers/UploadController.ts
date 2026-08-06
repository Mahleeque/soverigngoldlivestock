import { uploadService } from '../services/UploadService';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export const uploadAnimalMedia = catchAsync(async (req, res) => {
  const files = req.files as Express.Multer.File[] | undefined;
  if (!files?.length) throw new AppError('At least one file is required', 422);
  const urls = await Promise.all(files.map((file) => uploadService.uploadBuffer(file, 'sovereign-gold/animals')));
  return sendSuccess(res, 'Files uploaded', { urls }, 201);
});
