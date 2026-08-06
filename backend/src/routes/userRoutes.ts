import { Router } from 'express';
import {
  addAddress,
  getProfile,
  myNotifications,
  myReservations,
  toggleWishlist,
  updateProfile
} from '../controllers/UserController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import { addressValidator, animalIdParam, updateProfileValidator } from '../validators/userValidators';

export const userRoutes = Router();

userRoutes.use(authenticate);
userRoutes.get('/me', getProfile);
userRoutes.patch('/me', updateProfileValidator, validate, updateProfile);
userRoutes.post('/me/addresses', addressValidator, validate, addAddress);
userRoutes.post('/me/wishlist/:animalId', animalIdParam, validate, toggleWishlist);
userRoutes.get('/me/reservations', myReservations);
userRoutes.get('/me/notifications', myNotifications);
