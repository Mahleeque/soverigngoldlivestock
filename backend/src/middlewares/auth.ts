import { RequestHandler } from 'express';
import { User } from '../models/User';
import { UserRole } from '../constants/enums';
import { AppError } from '../utils/appError';
import { verifyAccessToken } from '../utils/token';

export const optionalAuthenticate: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) return next();

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findOne({ _id: payload.sub, isDeleted: false }).select('role tokenVersion isBlocked');
    if (user && user.tokenVersion === payload.tokenVersion && !user.isBlocked) {
      req.user = { id: user.id, role: user.role, tokenVersion: user.tokenVersion };
    }
  } catch {
    // Public endpoints can continue without a session.
  }
  return next();
};

export const authenticate: RequestHandler = async (req, _res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) return next(new AppError('Authentication required', 401));

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findOne({ _id: payload.sub, isDeleted: false }).select('role tokenVersion isBlocked');
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      return next(new AppError('Invalid or expired token', 401));
    }
    if (user.isBlocked) {
      return next(new AppError('This account has been blocked. Contact the farm administrator.', 403));
    }
    req.user = { id: user.id, role: user.role, tokenVersion: user.tokenVersion };
    return next();
  } catch {
    return next(new AppError('Invalid or expired token', 401));
  }
};

export const authorize =
  (...roles: UserRole[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(new AppError('Authentication required', 401));
    if (!roles.includes(req.user.role)) return next(new AppError('Insufficient permissions', 403));
    return next();
  };
