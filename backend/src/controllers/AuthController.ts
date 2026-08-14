import { env } from '../config/env';
import { authService } from '../services/AuthService';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { sendSuccess } from '../utils/apiResponse';

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: (env.nodeEnv === 'production' ? 'strict' : 'lax') as 'strict' | 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000,
  domain: env.cookieDomain
});

export const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  res.cookie('refreshToken', result.refreshToken, getRefreshCookieOptions());
  return sendSuccess(res, 'Account created successfully', result, 201);
});

export const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  res.cookie('refreshToken', result.refreshToken, getRefreshCookieOptions());
  return sendSuccess(res, 'Login successful', result);
});

export const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) throw new AppError('Refresh token required', 401);
  const result = await authService.refresh(token);
  res.cookie('refreshToken', result.refreshToken, getRefreshCookieOptions());
  return sendSuccess(res, 'Token refreshed', result);
});

export const logout = catchAsync(async (req, res) => {
  if (req.user) await authService.logout(req.user.id);
  res.clearCookie('refreshToken', getRefreshCookieOptions());
  return sendSuccess(res, 'Logout successful');
});

export const forgotPassword = catchAsync(async (req, res) => {
  const result = await authService.forgotPassword(req.body.email);
  return sendSuccess(res, '6-digit verification code sent to your email', result);
});

export const verifyOtp = catchAsync(async (req, res) => {
  const result = await authService.verifyOtp(req.body.email, req.body.otp);
  return sendSuccess(res, 'OTP verified successfully', result);
});

export const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword);
  return sendSuccess(res, 'Password changed successfully');
});

export const resetPassword = catchAsync(async (req, res) => {
  const tokenOrOtp = req.body.otp || req.body.token;
  const result = await authService.resetPassword(tokenOrOtp, req.body.password, req.body.email);
  if (result.refreshToken) {
    res.cookie('refreshToken', result.refreshToken, getRefreshCookieOptions());
  }
  return sendSuccess(res, 'Password reset successful', result);
});
