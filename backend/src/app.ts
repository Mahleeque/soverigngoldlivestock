import express, { Request } from 'express';
import swaggerUi from 'swagger-ui-express';
import { applySecurityMiddleware } from './middlewares/security';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { apiRouter } from './routes';
import { swaggerSpec } from './docs/swagger';
import { env } from './config/env';
import { sendSuccess } from './utils/apiResponse';

export const app = express();

applySecurityMiddleware(app);
app.use(
  express.json({
    limit: '1mb',
    verify: (req, _res, buf) => {
      (req as Request).rawBody = Buffer.from(buf);
    }
  })
);
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.get('/', (_req, res) =>
  sendSuccess(res, 'Sovereign Gold Livestock API is running', {
    health: `/api/${env.apiVersion}/health`,
    docs: `/api/${env.apiVersion}/docs`
  })
);
app.use(`/api/${env.apiVersion}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(`/api/${env.apiVersion}`, apiRouter);

app.use(notFound);
app.use(errorHandler);
