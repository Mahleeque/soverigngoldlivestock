import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Express, RequestHandler } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { env } from '../config/env';

type Sanitizable = string | number | boolean | null | undefined | Sanitizable[] | { [key: string]: Sanitizable };

const SENSITIVE_FIELDS = new Set([
  'password',
  'newPassword',
  'currentPassword',
  'confirmPassword',
  'token',
  'refreshToken',
  'accessToken',
  'rawBody'
]);

const escapeHtml = (value: string): string =>
  value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return entities[char];
  });

const sanitizeValue = (value: Sanitizable, keyName?: string): Sanitizable => {
  if (typeof value === 'string') {
    if (keyName && SENSITIVE_FIELDS.has(keyName)) {
      return value.trim();
    }
    return escapeHtml(value).trim();
  }
  if (Array.isArray(value)) return value.map((item) => sanitizeValue(item, keyName));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, sanitizeValue(entry, key)])
    );
  }
  return value;
};

const stripOperators = (value: Sanitizable): Sanitizable => {
  if (Array.isArray(value)) return value.map((item) => stripOperators(item));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([key]) => !key.startsWith('$') && !key.includes('.'))
        .map(([key, entry]) => [key, stripOperators(entry)])
    );
  }
  return value;
};

const sanitizeInPlace = (target: Record<string, unknown>): void => {
  const sanitized = sanitizeValue(stripOperators(target as Sanitizable)) as Record<string, unknown>;
  for (const key of Object.keys(target)) delete target[key];
  Object.assign(target, sanitized);
};

const sanitizeRequestInput = (): RequestHandler => (req, _res, next) => {
  if (req.body && typeof req.body === 'object') sanitizeInPlace(req.body as Record<string, unknown>);
  if (req.query) sanitizeInPlace(req.query as Record<string, unknown>);
  if (req.params) sanitizeInPlace(req.params as Record<string, unknown>);
  next();
};

const isOriginAllowed = (origin: string | undefined): boolean => {
  if (!origin) return true;
  const normalizedOrigin = origin.replace(/\/+$/, '');

  if (env.clientOrigins.some((allowed) => allowed.replace(/\/+$/, '') === normalizedOrigin)) {
    return true;
  }

  // In development, automatically allow localhost and 127.0.0.1
  if (env.nodeEnv !== 'production') {
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
      return true;
    }
  }

  return false;
};

export const applySecurityMiddleware = (app: Express): void => {
  app.set('trust proxy', 1);
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (isOriginAllowed(origin)) {
          return callback(null, true);
        }
        return callback(null, false);
      },
      credentials: true
    })
  );
  app.use(
    rateLimit({
      windowMs: env.rateLimitWindowMs,
      limit: env.rateLimitMax,
      standardHeaders: true,
      legacyHeaders: false
    })
  );
  app.use(cookieParser());
  app.use(sanitizeRequestInput());
  app.use(hpp());
  app.use(compression());
  if (env.nodeEnv !== 'test') app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
};
