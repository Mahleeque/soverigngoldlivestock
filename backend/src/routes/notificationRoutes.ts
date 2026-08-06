import { Router } from 'express';
import { param } from 'express-validator';
import { markNotificationRead } from '../controllers/NotificationController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';

export const notificationRoutes = Router();

notificationRoutes.use(authenticate);
notificationRoutes.patch('/:id/read', param('id').isMongoId(), validate, markNotificationRead);
