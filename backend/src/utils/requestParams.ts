import { Request } from 'express';
import { AppError } from './appError';

export const getRouteParam = (req: Request, name: string): string => {
  const value = req.params[name];
  if (typeof value !== 'string' || value.length === 0) {
    throw new AppError(`Missing required route parameter: ${name}`, 400);
  }
  return value;
};
