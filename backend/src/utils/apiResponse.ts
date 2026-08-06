import { Response } from 'express';
import { ApiMeta, ApiResponseBody } from '../interfaces/api';

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200,
  meta?: ApiMeta
): Response<ApiResponseBody<T>> =>
  res.status(statusCode).json({
    success: true,
    message,
    data,
    meta
  });
