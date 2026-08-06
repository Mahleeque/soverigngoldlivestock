import { env } from '../config/env';
import { AppError } from '../utils/appError';

export class SmsService {
  async sendSms(to: string, message: string): Promise<void> {
    if (!env.termiiApiKey) {
      console.info(`SMS skipped: ${to} ${message}`);
      return;
    }

    const response = await fetch('https://api.ng.termii.com/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: env.termiiApiKey,
        to,
        from: env.termiiSenderId,
        sms: message,
        type: 'plain',
        channel: 'generic'
      })
    });

    if (!response.ok) throw new AppError('Unable to send SMS', 502);
  }

  orderConfirmation(to: string, orderNumber: string) {
    return this.sendSms(to, `Your Sovereign Gold order ${orderNumber} has been received.`);
  }

  paymentSuccess(to: string, orderNumber: string) {
    return this.sendSms(to, `Payment confirmed for Sovereign Gold order ${orderNumber}.`);
  }
}

export const smsService = new SmsService();
