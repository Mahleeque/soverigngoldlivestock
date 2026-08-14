import { body, param } from 'express-validator';
import { UserRole } from '../constants/enums';

export const resourceParam = [param('resource').isIn(['deliveryZones', 'coupons', 'settings', 'orders', 'payments'])];
export const resourceIdParam = [param('id').isMongoId()];

export const userIdParam = [param('id').isMongoId()];

export const userRoleValidator = [body('role').isIn(Object.values(UserRole))];

export const userBlockedValidator = [body('blocked').isBoolean()];

export const deliveryZoneValidator = [
  body('name').optional().trim().notEmpty(),
  body('states').optional().isArray({ min: 1 }),
  body('baseFee').optional().isFloat({ min: 0 }),
  body('estimatedDaysMin').optional().isInt({ min: 0 }),
  body('estimatedDaysMax').optional().isInt({ min: 0 }),
  body('active').optional().isBoolean()
];
