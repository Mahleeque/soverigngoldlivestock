import crypto from 'crypto';
import { Request } from 'express';
import { env } from '../config/env';
import { PaymentProvider } from '../constants/enums';
import { paymentService } from '../services/PaymentService';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export const initializePaystack = catchAsync(async (req, res) => {
  const payment = await paymentService.initialize(req.body.orderId, PaymentProvider.Paystack, req.body.email);
  return sendSuccess(res, 'Paystack payment initialized', payment, 201);
});

export const initializeFlutterwave = catchAsync(async (req, res) => {
  const payment = await paymentService.initialize(req.body.orderId, PaymentProvider.Flutterwave, req.body.email);
  return sendSuccess(res, 'Flutterwave payment initialized', payment, 201);
});

export const paymentWebhook = catchAsync(async (req, res) => {
  const provider = req.path.includes('paystack') ? PaymentProvider.Paystack : PaymentProvider.Flutterwave;
  verifyWebhookSignature(provider, req);
  const reference = req.body.reference || req.body.data?.reference || req.body.tx_ref || req.body.data?.tx_ref;
  const providerReference = req.body.id || req.body.data?.id || req.body.flw_ref || req.body.data?.flw_ref;
  const status = req.body.status || req.body.data?.status || req.body.event;
  if (reference && ['success', 'successful', 'charge.success'].includes(String(status).toLowerCase())) {
    await paymentService.markSuccessful(reference, providerReference, req.body);
  } else if (reference && ['failed', 'charge.failed'].includes(String(status).toLowerCase())) {
    await paymentService.markFailed(reference, providerReference, req.body);
  }
  return sendSuccess(res, 'Webhook received');
});

const verifyWebhookSignature = (provider: PaymentProvider, req: Request): void => {
  if (provider === PaymentProvider.Paystack && env.paystackWebhookSecret) {
    const signature = req.headers['x-paystack-signature'];
    if (!req.rawBody) throw new AppError('Missing Paystack webhook payload', 400);
    const hash = crypto.createHmac('sha512', env.paystackWebhookSecret).update(req.rawBody).digest('hex');
    if (signature !== hash) throw new AppError('Invalid Paystack webhook signature', 401);
  }

  if (provider === PaymentProvider.Flutterwave && env.flutterwaveWebhookSecret) {
    const signature = req.headers['verif-hash'];
    if (signature !== env.flutterwaveWebhookSecret) throw new AppError('Invalid Flutterwave webhook signature', 401);
  }
};
