import { body, param } from 'express-validator';
import { AnimalCategory, AnimalStatus } from '../constants/enums';

export const animalIdParam = [param('id').isMongoId()];
export const animalSlugParam = [param('slug').isSlug()];

export const createAnimalValidator = [
  body('name').trim().isLength({ min: 2, max: 160 }),
  body('category').isIn(Object.values(AnimalCategory)),
  body('breed').trim().notEmpty(),
  body('description').trim().isLength({ min: 10, max: 3000 }),
  body('price').isFloat({ min: 0 }),
  body('depositAmount').optional().isFloat({ min: 0 }),
  body('weightKg').isFloat({ min: 0 }),
  body('ageMonths').isInt({ min: 0 }),
  body('gender').isIn(['male', 'female']),
  body('size').isIn(['small', 'medium', 'large']),
  body('healthStatus').trim().notEmpty(),
  body('vaccinationStatus').trim().notEmpty(),
  body('images').optional().isArray(),
  body('quantity').optional().isInt({ min: 0 }),
  body('featured').optional().isBoolean(),
  body('sku').optional().trim().notEmpty(),
  body('status').optional().isIn(Object.values(AnimalStatus))
];
