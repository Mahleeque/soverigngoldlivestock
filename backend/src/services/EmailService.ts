import nodemailer from 'nodemailer';
import { env } from '../config/env';

export class EmailService {
  private transporter() {
    if (!env.smtp.user || !env.smtp.pass) return null;

    const isGmail = env.smtp.host?.includes('gmail') || env.smtp.user?.includes('@gmail.com');

    if (isGmail) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: { user: env.smtp.user, pass: env.smtp.pass },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000
      });
    }

    return nodemailer.createTransport({
      host: env.smtp.host || 'smtp.gmail.com',
      port: Number(env.smtp.port) || 587,
      secure: Number(env.smtp.port) === 465,
      auth: { user: env.smtp.user, pass: env.smtp.pass },
      tls: {
        rejectUnauthorized: false
      },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000
    });
  }

  async send(to: string, subject: string, html: string): Promise<boolean> {
    const transporter = this.transporter();
    if (!transporter) {
      console.warn(`[EmailService] SMTP credentials not set. Skipped sending "${subject}" to ${to}`);
      return false;
    }
    try {
      await transporter.sendMail({
        from: env.smtp.from || `Sovereign Gold Livestock <${env.smtp.user}>`,
        to,
        subject,
        html
      });
      console.info(`[EmailService] ✓ Successfully delivered "${subject}" to ${to}`);
      return true;
    } catch (error: any) {
      console.error(`[EmailService] ✗ SMTP Delivery Error to ${to}:`, error?.message || error);
      return false;
    }
  }

  welcome(to: string, name: string) {
    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
        <div style="background: #0f172a; padding: 28px; text-align: center;">
          <h1 style="color: #f59e0b; margin: 0; font-size: 22px; letter-spacing: 0.05em;">SOVEREIGN GOLD LIVESTOCK</h1>
        </div>
        <div style="padding: 32px 24px; color: #1e293b; line-height: 1.6;">
          <h2 style="margin-top: 0; font-size: 20px; color: #0f172a;">Welcome, ${name}!</h2>
          <p>Thank you for joining Sovereign Gold Livestock. You can now browse verified livestock breeds, reserve animals, and track farm deliveries across Nigeria.</p>
        </div>
      </div>
    `;
    return this.send(to, 'Welcome to Sovereign Gold Livestock', html);
  }

  sendOtp(to: string, otp: string, purpose: 'reset' | 'verify' | 'login' = 'reset', name: string = 'Valued Customer') {
    const isReset = purpose === 'reset';
    const title = isReset ? 'Password Reset Code' : 'Verification Code';
    const message = isReset
      ? 'Use this 6-digit verification code to reset your Sovereign Gold account password:'
      : 'Use this 6-digit verification code to confirm your Sovereign Gold account:';

    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="background: #1c3829; padding: 28px 24px; text-align: center;">
          <h1 style="color: #fbbf24; margin: 0; font-size: 20px; letter-spacing: 0.1em; text-transform: uppercase;">SOVEREIGN GOLD LIVESTOCK</h1>
        </div>
        <div style="padding: 36px 28px; color: #1e293b; line-height: 1.6;">
          <h2 style="margin-top: 0; font-size: 20px; color: #1c3829;">${title}</h2>
          <p>Hello ${name},</p>
          <p>${message}</p>
          <div style="margin: 28px 0; text-align: center;">
            <div style="display: inline-block; background: #f0fdf4; border: 2px dashed #166534; border-radius: 16px; padding: 18px 36px;">
              <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 10px; color: #14532d; display: block;">${otp}</span>
            </div>
          </div>
          <p style="font-size: 13px; color: #64748b; text-align: center;">This code will expire in <strong>15 minutes</strong>. Never share this code with anyone.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; margin: 0;">If you did not request this verification code, please ignore this email or contact our support team.</p>
        </div>
      </div>
    `;
    return this.send(to, `${title}: ${otp} - Sovereign Gold Livestock`, html);
  }

  passwordReset(to: string, resetUrl: string, name: string = 'Valued Customer') {

    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <div style="background: #1c3829; padding: 28px; text-align: center;">
          <h1 style="color: #fbbf24; margin: 0; font-size: 20px; letter-spacing: 0.08em; text-transform: uppercase;">SOVEREIGN GOLD LIVESTOCK</h1>
        </div>
        <div style="padding: 36px 28px; color: #1e293b; line-height: 1.6;">
          <h2 style="margin-top: 0; font-size: 20px; color: #1c3829;">Reset Your Password</h2>
          <p>Hello ${name},</p>
          <p>We received a request to reset your password for your Sovereign Gold Livestock account. Click the button below to choose a new password:</p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background: #1c3829; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">Reset Password</a>
          </div>
          <p style="font-size: 13px; color: #64748b;">This password reset link will expire in 60 minutes. If you did not make this request, you can safely ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #94a3b8; word-break: break-all;">If the button doesn't work, copy and paste this link into your browser:<br/><a href="${resetUrl}" style="color: #1c3829;">${resetUrl}</a></p>
        </div>
      </div>
    `;
    return this.send(to, 'Reset Your Password - Sovereign Gold Livestock', html);
  }

  orderConfirmation(to: string, orderNumber: string, total: string, name: string = 'Valued Customer') {
    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px; overflow: hidden;">
        <div style="background: #1c3829; padding: 28px; text-align: center;">
          <h1 style="color: #fbbf24; margin: 0; font-size: 20px; letter-spacing: 0.08em; text-transform: uppercase;">SOVEREIGN GOLD LIVESTOCK</h1>
        </div>
        <div style="padding: 36px 28px; color: #1e293b; line-height: 1.6;">
          <h2 style="margin-top: 0; font-size: 20px; color: #1c3829;">Order Confirmed: ${orderNumber}</h2>
          <p>Hello ${name},</p>
          <p>Thank you for your order. We have received your order <strong>${orderNumber}</strong> for <strong>${total}</strong>.</p>
          <p>Our sales desk is preparing your livestock for dispatch. You can log into your account anytime to view live delivery updates.</p>
        </div>
      </div>
    `;
    return this.send(to, `Order Confirmation - ${orderNumber}`, html);
  }
}

export const emailService = new EmailService();
