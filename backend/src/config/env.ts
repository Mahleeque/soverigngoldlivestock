import dotenv from 'dotenv';

dotenv.config();

const productionRequired = [
  'MONGO_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
  'CLIENT_ORIGINS'
];

const placeholderPattern = /replace_with|change_me|example\.com/i;

for (const key of productionRequired) {
  const value = process.env[key];
  if (process.env.NODE_ENV === 'production' && (!value || placeholderPattern.test(value))) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

if (process.env.NODE_ENV === 'production') {
  console.info('[env] Production mode enabled');
  console.info(`[env] MONGO_URI configured: ${Boolean(process.env.MONGO_URI)}`);
  console.info(`[env] JWT_ACCESS_SECRET configured: ${Boolean(process.env.JWT_ACCESS_SECRET)}`);
  console.info(`[env] JWT_REFRESH_SECRET configured: ${Boolean(process.env.JWT_REFRESH_SECRET)}`);
  console.info(`[env] CLIENT_ORIGINS configured: ${Boolean(process.env.CLIENT_ORIGINS)}`);
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 8081),
  apiVersion: process.env.API_VERSION || 'v1',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/sovereign_gold_livestock',
  mongoDnsServers: (process.env.MONGO_DNS_SERVERS || '')
    .split(',')
    .map((server) => server.trim())
    .filter(Boolean),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'development_access_secret_change_me',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'development_refresh_secret_change_me',
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  cookieDomain: process.env.COOKIE_DOMAIN?.trim() || undefined,
  clientOrigins: (process.env.CLIENT_ORIGINS || 'http://localhost:3000,http://localhost:5173,http://127.0.0.1:5173')
    .split(',')
    .map((origin) => origin.trim().replace(/\/+$/, ''))
    .filter(Boolean),
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS || 12),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 300),
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,
  paystackWebhookSecret: process.env.PAYSTACK_WEBHOOK_SECRET || process.env.PAYSTACK_SECRET_KEY,
  flutterwaveSecretKey: process.env.FLUTTERWAVE_SECRET_KEY,
  flutterwaveWebhookSecret: process.env.FLUTTERWAVE_WEBHOOK_SECRET,
  termiiApiKey: process.env.TERMII_API_KEY,
  termiiSenderId: process.env.TERMII_SENDER_ID || 'SGLivestock',
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM || 'Sovereign Gold Livestock <no-reply@example.com>'
  }
};
