import crypto from 'crypto';
import { UserRole } from '../constants/enums';
import { IUser, User } from '../models/User';
import { AppError } from '../utils/appError';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/token';

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
    if (existing) throw new AppError('A user with this email or phone already exists', 409);
    const user = await User.create({
      ...payload,
      email: payload.email.toLowerCase().trim(),
      role: UserRole.Customer
    });
    return this.issueTokens(user);
  }

  async login(email: string, password: string) {
    const user = await User.findOne({ email: email.toLowerCase(), isDeleted: false }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }
    if (user.isBlocked) {
      throw new AppError('This account has been blocked. Contact the farm administrator.', 403);
    }
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false });
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findOne({ _id: payload.sub, isDeleted: false });
    if (!user || user.tokenVersion !== payload.tokenVersion) throw new AppError('Invalid refresh token', 401);
    if (user.isBlocked) throw new AppError('This account has been blocked', 403);
    return this.issueTokens(user);
  }

  async logout(userId: string) {
    await User.findByIdAndUpdate(userId, { $inc: { tokenVersion: 1 } });
  }

  async forgotPassword(email: string) {
    const user = await User.findOne({ email: email.toLowerCase(), isDeleted: false });
    if (!user) return;
    const raw = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(raw).digest('hex');
    user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
    await user.save();
    return raw;
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

  async resetPassword(token: string, password: string) {
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: new Date() },
      isDeleted: false
    }).select('+passwordResetToken +passwordResetExpires');
    if (!user) throw new AppError('Invalid or expired reset token', 400);
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.tokenVersion += 1;
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
