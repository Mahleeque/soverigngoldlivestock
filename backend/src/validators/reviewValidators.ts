import { body, param } from 'express-validator';

export const createReviewValidator = [
  body('animal').isMongoId(),
  body('order').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').trim().isLength({ min: 5, max: 1200 })
];

export const reviewIdParam = [param('id').isMongoId()];
export const animalReviewParam = [param('animalId').isMongoId()];
export const moderateReviewValidator = [body('status').isIn(['approved', 'rejected'])];
