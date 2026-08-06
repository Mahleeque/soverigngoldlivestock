import { Router } from 'express';
import { createReview, listAnimalReviews, moderateReview } from '../controllers/ReviewController';
import { UserRole } from '../constants/enums';
import { authenticate, authorize } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  animalReviewParam,
  createReviewValidator,
  moderateReviewValidator,
  reviewIdParam
} from '../validators/reviewValidators';

export const reviewRoutes = Router();

reviewRoutes.get('/animals/:animalId', animalReviewParam, validate, listAnimalReviews);
reviewRoutes.post('/', authenticate, createReviewValidator, validate, createReview);
reviewRoutes.patch('/:id/moderate', authenticate, authorize(UserRole.Admin, UserRole.Sales), reviewIdParam, moderateReviewValidator, validate, moderateReview);
