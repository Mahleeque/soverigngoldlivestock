import { NextFunction, Request, Response } from 'express';
import { healthCheck } from '../controllers/MiscController';

describe('health endpoint', () => {
  it('returns the API health envelope', async () => {
    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });
    const res = { status } as unknown as Response;
    const next = jest.fn() as NextFunction;

    healthCheck({} as Request, res, next);
    await Promise.resolve();

    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'API healthy'
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
