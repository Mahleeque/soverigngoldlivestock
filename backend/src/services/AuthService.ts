import crypto from 'crypto';
import { env } from '../config/env';
import { UserRole } from '../constants/enums';
import { IUser, User } from '../models/User';
import { AppError } from '../utils/appError';
import { signAccessToken, signRefreshToken } from '../utils/token';
import { emailService } from './EmailService';

export class AuthService {
  async register(payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    const existing = await User.findOne({
      $or: [{ email: payload.email.toLowerCase() }, { phone: payload.phone }],
      isDeleted: false
    });

    if (existing) {
      if (existing.email.toLowerCase() === payload.email.toLowerCase()) {
        throw new AppError('An account with this email address already exists', 409);
      }
      throw new AppError('An account with this phone number already exists', 409);
    }

    const user = await User.create({
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email.toLowerCase(),
      phone: payload.phone,
      password: payload.password,
      role: UserRole.Customer
    });

    void emailService.welcome(user.email, user.firstName);

    return this.issueTokens(user);
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase(), isDeleted: false }).select('+password');
    if (!user) throw new AppError('Invalid email address or password', 401);
    if (user.isBlocked) throw new AppError('This account has been blocked', 403);
    const valid = await user.comparePassword(password);
    if (!valid) throw new AppError('Invalid email address or password', 401);

    user.lastLoginAt = new Date();
    await user.save();
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    const user = await User.findOne({ isDeleted: false });
    if (!user) throw new AppError('User not found', 404);
    if (user.isBlocked) throw new AppError('This account has been blocked', 403);
    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email: email.toLowerCase(), isDeleted: false });
    if (!user) {
      throw new AppError('No account found with this email address', 404);
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const raw = crypto.randomBytes(32).toString('hex');

    user.passwordResetOtp = crypto.createHash('sha256').update(otp).digest('hex');
    user.passwordResetOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    user.passwordResetToken = crypto.createHash('sha256').update(raw).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 60 mins
    await user.save();

    const origin =
      env.clientOrigins.find((o: string) => !o.includes('localhost') && !o.includes('127.0.0.1')) ||
      env.clientOrigins[0] ||
      'https://soverigngoldlivestock.vercel.app';
    const resetUrl = `${origin}/reset-password?token=${raw}&email=${encodeURIComponent(user.email)}&otp=${otp}`;

    console.info(`🔑 [AuthService] Password Reset Code for: ${user.email} => [ ${otp} ]`);
    console.info(`🔗 [AuthService] Direct Reset Link: ${resetUrl}`);

    // Deliver 6-digit OTP code to user's email inbox
    const delivered = await emailService.sendOtp(user.email, otp, 'reset', user.firstName);

    return {
      email: user.email,
      firstName: user.firstName,
      message: '6-digit verification code sent to your email inbox',
      emailDelivered: delivered,
      token: raw,
      otp: env.nodeEnv !== 'production' ? otp : undefined
    };
  }

  async verifyOtp(email: string, otp: string) {
    const hashed = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    const user = await User.findOne({
      email: email.toLowerCase(),
      passwordResetOtp: hashed,
      passwordResetOtpExpires: { $gt: new Date() },
      isDeleted: false
    }).select('+passwordResetOtp +passwordResetOtpExpires');

    if (!user) {
      throw new AppError('Invalid or expired 6-digit verification code', 400);
    }

    return { valid: true, email: user.email };
  }

  async resetPassword(tokenOrOtp: string, password: string, email?: string) {
    const isSixDigitOtp = /^\d{6}$/.test(tokenOrOtp.trim());
    const hashed = crypto.createHash('sha256').update(tokenOrOtp.trim()).digest('hex');

    let user: IUser | null = null;

    if (isSixDigitOtp && email) {
      user = await User.findOne({
        email: email.toLowerCase(),
        passwordResetOtp: hashed,
        passwordResetOtpExpires: { $gt: new Date() },
        isDeleted: false
      }).select('+passwordResetOtp +passwordResetOtpExpires +passwordResetToken +passwordResetExpires');
    } else {
      user = await User.findOne({
        $or: [
          { passwordResetToken: hashed, passwordResetExpires: { $gt: new Date() } },
          { passwordResetOtp: hashed, passwordResetOtpExpires: { $gt: new Date() } }
        ],
        isDeleted: false
      }).select('+passwordResetOtp +passwordResetOtpExpires +passwordResetToken +passwordResetExpires');
    }

    if (!user) {
      throw new AppError('Invalid or expired verification code / reset token', 400);
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetOtp = undefined;
    user.passwordResetOtpExpires = undefined;
    user.tokenVersion += 1;
    await user.save();

    return this.issueTokens(user);
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findOne({ _id: userId, isDeleted: false }).select('+password');
    if (!user) throw new AppError('User not found', 404);
    if (!(await user.comparePassword(currentPassword))) {
      throw new AppError('Your current password is incorrect', 400);
    }
    if (await user.comparePassword(newPassword)) {
      throw new AppError('Your new password must be different from the current one', 400);
    }
    user.password = newPassword;
    await user.save();
  }

  private issueTokens(user: IUser) {
    const accessToken = signAccessToken(user.id, user.role, user.tokenVersion);
    const refreshToken = signRefreshToken(user.id, user.role, user.tokenVersion);
    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatarUrl: user.avatarUrl,
      emailVerified: user.emailVerified
    };
    return { user: safeUser, accessToken, refreshToken };
  }
}

export const authService = new AuthService();
