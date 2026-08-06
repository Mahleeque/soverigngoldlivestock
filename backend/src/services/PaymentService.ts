import crypto from 'crypto';
import { env } from '../config/env';
import { OrderStatus, PaymentProvider, PaymentStatus } from '../constants/enums';
import { Order } from '../models/Order';
import { Payment } from '../models/Payment';
import { AppError } from '../utils/appError';

export class PaymentService {
  async initialize(orderId: string, provider: PaymentProvider, email?: string) {
    const order = await Order.findOne({ _id: orderId, isDeleted: false });
    if (!order) throw new AppError('Order not found', 404);
    const reference = `SGL-${provider}-${crypto.randomUUID()}`;
    const authorizationUrl = await this.createProviderCheckout(provider, {
      amount: order.total,
      reference,
      email: email || 'payments@sovereigngoldlivestock.com',
      orderNumber: order.orderNumber
    });

    const payment = await Payment.create({
      order: order._id,
      customer: order.customer,
      provider,
      amount: order.total,
      reference,
      authorizationUrl,
      metadata: { orderNumber: order.orderNumber }
    });
    return payment;
  }

  async markSuccessful(reference: string, providerReference?: string, metadata?: Record<string, unknown>) {
    const payment = await Payment.findOneAndUpdate(
      { reference, isDeleted: false },
      { status: PaymentStatus.Successful, providerReference, paidAt: new Date(), metadata },
      { new: true }
    );
    if (!payment) throw new AppError('Payment not found', 404);
    await Order.findByIdAndUpdate(payment.order, {
      paymentStatus: PaymentStatus.Successful,
      status: OrderStatus.Confirmed,
      $push: { statusHistory: { status: OrderStatus.Confirmed, note: 'Payment confirmed', changedAt: new Date() } }
    });
    return payment;
  }

  async markFailed(reference: string, providerReference?: string, metadata?: Record<string, unknown>) {
    const payment = await Payment.findOneAndUpdate(
      { reference, isDeleted: false },
      { status: PaymentStatus.Failed, providerReference, metadata },
      { new: true }
    );
    if (!payment) throw new AppError('Payment not found', 404);
    return payment;
  }

  private async createProviderCheckout(
    provider: PaymentProvider,
    payload: { amount: number; reference: string; email: string; orderNumber: string }
  ): Promise<string> {
    if (provider === PaymentProvider.Paystack) {
      if (!env.paystackSecretKey) throw new AppError('Paystack is not configured', 503);
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.paystackSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: payload.email,
          amount: payload.amount * 100,
          reference: payload.reference,
          metadata: { orderNumber: payload.orderNumber }
        })
      });
      const result = (await response.json()) as { status?: boolean; data?: { authorization_url?: string }; message?: string };
      if (!response.ok || !result.status || !result.data?.authorization_url) {
        throw new AppError(result.message || 'Unable to initialize Paystack payment', 502);
      }
      return result.data.authorization_url;
    }

    if (provider === PaymentProvider.Flutterwave) {
      if (!env.flutterwaveSecretKey) throw new AppError('Flutterwave is not configured', 503);
      const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.flutterwaveSecretKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tx_ref: payload.reference,
          amount: payload.amount,
          currency: 'NGN',
          customer: { email: payload.email },
          customizations: {
            title: 'Sovereign Gold Livestock',
            description: `Payment for ${payload.orderNumber}`
          }
        })
      });
      const result = (await response.json()) as { status?: string; data?: { link?: string }; message?: string };
      if (!response.ok || result.status !== 'success' || !result.data?.link) {
        throw new AppError(result.message || 'Unable to initialize Flutterwave payment', 502);
      }
      return result.data.link;
    }

    throw new AppError('Unsupported payment provider', 400);
  }
}

export const paymentService = new PaymentService();
