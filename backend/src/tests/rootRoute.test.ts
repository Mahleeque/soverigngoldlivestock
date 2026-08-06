import request from 'supertest';
import { app } from '../app';
import { env } from '../config/env';

describe('root route', () => {
  it('returns API metadata for GET /', async () => {
    const response = await request(app).get('/').expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        success: true,
        message: 'Sovereign Gold Livestock API is running',
        data: {
          health: `/api/${env.apiVersion}/health`,
          docs: `/api/${env.apiVersion}/docs`
        }
      })
    );
  });

  it('accepts platform HEAD probes at /', async () => {
    await request(app).head('/').expect(200);
  });
});
