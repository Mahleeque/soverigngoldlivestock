import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../utils/appError';

export const validate: RequestHandler = (req, _res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return next(new AppError('Validation failed', 422, result.array()));
  }
  return next();
};
