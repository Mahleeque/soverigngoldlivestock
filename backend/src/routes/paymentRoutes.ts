import { Router } from 'express';
import { body } from 'express-validator';
import { initializeFlutterwave, initializePaystack, paymentWebhook } from '../controllers/PaymentController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';

const initializeValidator = [body('orderId').isMongoId(), body('email').optional().isEmail().normalizeEmail()];

export const paymentRoutes = Router();

paymentRoutes.post('/paystack/initialize', authenticate, initializeValidator, validate, initializePaystack);
paymentRoutes.post('/flutterwave/initialize', authenticate, initializeValidator, validate, initializeFlutterwave);
paymentRoutes.post('/paystack/webhook', paymentWebhook);
paymentRoutes.post('/flutterwave/webhook', paymentWebhook);
