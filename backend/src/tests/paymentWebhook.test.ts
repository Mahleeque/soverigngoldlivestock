import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';
import { paymentWebhook } from '../controllers/PaymentController';

describe('payment webhooks', () => {
  const webhookSecret = 'test_paystack_webhook_secret';

  it('verifies Paystack signatures against the raw request body', async () => {
    env.paystackWebhookSecret = webhookSecret;
    const payload = { event: 'charge.pending', data: { reference: 'SGL-test-reference' } };
    const rawPayload = JSON.stringify(payload);
    const signature = crypto.createHmac('sha512', webhookSecret).update(rawPayload).digest('hex');
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const next = jest.fn() as NextFunction;

    paymentWebhook(
      {
        path: '/paystack/webhook',
        headers: { 'x-paystack-signature': signature },
        body: payload,
        rawBody: Buffer.from(rawPayload)
      } as unknown as Request,
      { status } as unknown as Response,
      next
    );
    await Promise.resolve();

    expect(status).toHaveBeenCalledWith(200);
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects Paystack webhooks with invalid signatures', async () => {
    env.paystackWebhookSecret = webhookSecret;
    const payload = { event: 'charge.pending', data: { reference: 'SGL-test-reference' } };
    const next = jest.fn() as NextFunction;

    paymentWebhook(
      {
        path: '/paystack/webhook',
        headers: { 'x-paystack-signature': 'invalid-signature' },
        body: payload,
        rawBody: Buffer.from(JSON.stringify(payload))
      } as unknown as Request,
      {} as Response,
      next
    );
    await Promise.resolve();

    expect(next).toHaveBeenCalledWith(expect.objectContaining({ statusCode: 401 }));
  });
});
