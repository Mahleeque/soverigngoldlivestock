import { ErrorRequestHandler } from 'express';
import { AppError } from '../utils/appError';
import { env } from '../config/env';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode = 500;
  let message = 'Internal server error';
  let errors: unknown = undefined;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errors = error.errors;
  } else if (error instanceof SyntaxError && 'body' in error) {
    statusCode = 400;
    message = 'Invalid JSON request body';
  } else if (error.name === 'ValidationError' && error.errors) {
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.values(error.errors).map((e: any) => ({
      field: e.path,
      msg: e.message
    }));
  } else if (error.code === 11000) {
    statusCode = 409;
    const field = Object.keys(error.keyValue || {})[0] || 'field';
    message = `A record with this ${field} already exists`;
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for ${error.path}`;
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token expired';
  } else if (error.name === 'MongooseServerSelectionError' || error.name === 'MongoNetworkError') {
    statusCode = 503;
    message = 'Database connection temporarily unavailable. Please try again in a moment.';
  }

  if (env.nodeEnv !== 'test') {
    console.error(`[ErrorHandler] [${statusCode}]`, error);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors !== undefined ? { errors } : {})
  });
};
