import { body, param } from 'express-validator';
import { DeliveryStatus, OrderStatus, PaymentStatus } from '../constants/enums';

export const createOrderValidator = [
  body('items').isArray({ min: 1 }),
  body('items.*.animal').isMongoId(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('deliveryAddress.fullName').trim().notEmpty(),
  body('deliveryAddress.phone').trim().notEmpty(),
  body('deliveryAddress.addressLine').trim().notEmpty(),
  body('deliveryAddress.city').trim().notEmpty(),
  body('deliveryAddress.state').trim().notEmpty(),
  body('deliveryFee').optional().isFloat({ min: 0 }),
  body('couponCode').optional().trim().isLength({ min: 2, max: 40 })
];

export const orderIdParam = [param('id').isMongoId()];

export const updateOrderStatusValidator = [
  body('status').optional().isIn(Object.values(OrderStatus)),
  body('paymentStatus').optional().isIn(Object.values(PaymentStatus)),
  body('deliveryStatus').optional().isIn(Object.values(DeliveryStatus)),
  body('note').optional().trim().isLength({ max: 500 })
];

export const reserveAnimalValidator = [body('animalId').isMongoId()];
