import { Router } from 'express';
import { uploadAnimalMedia } from '../controllers/UploadController';
import { UserRole } from '../constants/enums';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

export const uploadRoutes = Router();

uploadRoutes.post('/animals/media', authenticate, authorize(UserRole.Admin, UserRole.Sales), upload.array('files', 10), uploadAnimalMedia);
