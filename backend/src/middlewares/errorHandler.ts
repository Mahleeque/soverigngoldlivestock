import { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/appError';
import { env } from '../config/env';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = error instanceof AppError ? error.statusCode : 500;
  const message = error instanceof AppError ? error.message : 'Internal server error';
  const errors = error instanceof AppError && error.errors ? error.errors : undefined;

  if (env.nodeEnv !== 'test') {
    console.error(error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors
  });
};
