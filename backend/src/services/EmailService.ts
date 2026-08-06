import nodemailer from 'nodemailer';
import { env } from '../config/env';

export class EmailService {
  private transporter() {
    if (!env.smtp.host || !env.smtp.user || !env.smtp.pass) return null;
    return nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass }
    });
  }

  async send(to: string, subject: string, html: string): Promise<void> {
    const transporter = this.transporter();
    if (!transporter) {
      console.info(`Email skipped: ${subject} -> ${to}`);
      return;
    }
    await transporter.sendMail({ from: env.smtp.from, to, subject, html });
  }

  welcome(to: string, name: string) {
    return this.send(to, 'Welcome to Sovereign Gold Livestock', `<p>Hello ${name}, welcome to Sovereign Gold Livestock.</p>`);
  }

  passwordReset(to: string, token: string) {
    return this.send(to, 'Reset your password', `<p>Use this reset token: <strong>${token}</strong></p>`);
  }

  orderConfirmation(to: string, orderNumber: string) {
    return this.send(to, 'Order confirmation', `<p>Your order ${orderNumber} has been received.</p>`);
  }
}

export const emailService = new EmailService();
