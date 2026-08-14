import { Router } from 'express';
import {
  changePassword,
  forgotPassword,
  login,
  logout,
  refreshToken,
  register,
  resetPassword,
  verifyLoginOtp,
  verifyOtp
} from '../controllers/AuthController';
import { authenticate } from '../middlewares/auth';
import { validate } from '../middlewares/validate';
import {
  changePasswordValidator,
  loginValidator,
  registerValidator,
  resetPasswordValidator,
  verifyOtpValidator
} from '../validators/authValidators';

export const authRoutes = Router();

authRoutes.post('/register', registerValidator, validate, register);
authRoutes.post('/login', loginValidator, validate, login);
authRoutes.post('/verify-login-otp', verifyOtpValidator, validate, verifyLoginOtp);
authRoutes.post('/refresh-token', refreshToken);

authRoutes.post('/logout', authenticate, logout);
authRoutes.post('/forgot-password', loginValidator.slice(0, 1), validate, forgotPassword);
authRoutes.post('/verify-otp', verifyOtpValidator, validate, verifyOtp);
authRoutes.post('/reset-password', resetPasswordValidator, validate, resetPassword);
authRoutes.post('/change-password', authenticate, changePasswordValidator, validate, changePassword);
