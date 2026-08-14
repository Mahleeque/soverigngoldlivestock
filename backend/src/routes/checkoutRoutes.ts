import { Router } from 'express';
import { body } from 'express-validator';
import { listActiveCoupons, listDeliveryZones, validateCoupon } from '../controllers/CheckoutController';
import { validate } from '../middlewares/validate';

export const checkoutRoutes = Router();

checkoutRoutes.get('/delivery-zones', listDeliveryZones);
checkoutRoutes.get('/coupons/active', listActiveCoupons);
checkoutRoutes.post('/coupons/validate', [body('code').trim().notEmpty(), body('subtotal').isFloat({ min: 0 })], validate, validateCoupon);
