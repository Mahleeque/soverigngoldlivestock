import { body, param } from 'express-validator';

export const updateProfileValidator = [
  body('firstName').optional().trim().isLength({ min: 2, max: 80 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 80 }),
  body('phone').optional().trim().isLength({ min: 7, max: 20 }),
  body('avatarUrl').optional().isURL()
];

export const addressValidator = [
  body('label').trim().notEmpty(),
  body('addressLine').trim().notEmpty(),
  body('city').trim().notEmpty(),
  body('state').trim().notEmpty(),
  body('phone').optional().trim().isLength({ min: 7, max: 20 }),
  body('isDefault').optional().isBoolean()
];

export const animalIdParam = [param('animalId').isMongoId()];
