import { env } from '../config/env';
import { authService } from '../services/AuthService';
import { sendSuccess } from '../utils/apiResponse';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax' as const,
  domain: env.cookieDomain,
  maxAge: 30 * 24 * 60 * 60 * 1000
};

export const register = catchAsync(async (req, res) => {
  const result = await authService.register(req.body);
  res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
  return sendSuccess(res, 'Registration successful', result, 201);
});

export const login = catchAsync(async (req, res) => {
  const result = await authService.login(req.body.email, req.body.password);
  res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
  return sendSuccess(res, 'Login successful', result);
});

export const refreshToken = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) throw new AppError('Refresh token required', 401);
  const result = await authService.refresh(token);
  res.cookie('refreshToken', result.refreshToken, refreshCookieOptions);
  return sendSuccess(res, 'Token refreshed', result);
});

export const logout = catchAsync(async (req, res) => {
  if (req.user) await authService.logout(req.user.id);
  res.clearCookie('refreshToken');
  return sendSuccess(res, 'Logout successful');
});

export const forgotPassword = catchAsync(async (req, res) => {
  const token = await authService.forgotPassword(req.body.email);
  return sendSuccess(res, 'Password reset instructions sent', env.nodeEnv === 'development' ? { token } : undefined);
});

export const changePassword = catchAsync(async (req, res) => {
  await authService.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword);
  return sendSuccess(res, 'Password changed successfully');
});

export const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.body.token, req.body.password);
  return sendSuccess(res, 'Password reset successful');
});
