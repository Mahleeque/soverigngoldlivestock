import { Router } from 'express';
import { body } from 'express-validator';
import { listDeliveryZones, validateCoupon } from '../controllers/CheckoutController';
import { validate } from '../middlewares/validate';

export const checkoutRoutes = Router();

checkoutRoutes.get('/delivery-zones', listDeliveryZones);
checkoutRoutes.post('/coupons/validate', [body('code').trim().notEmpty(), body('subtotal').isFloat({ min: 0 })], validate, validateCoupon);
