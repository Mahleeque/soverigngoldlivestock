import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { env } from '../config/env';
import { UserRole } from '../constants/enums';

export interface TokenPayload {
  sub: string;
  role: UserRole;
  tokenVersion: number;
}

const sign = (payload: TokenPayload, secret: string, expiresIn: string): string =>
  jwt.sign(payload, secret as Secret, { expiresIn } as SignOptions);

export const signAccessToken = (
  userId: Types.ObjectId | string,
  role: UserRole,
  tokenVersion: number
): string => sign({ sub: userId.toString(), role, tokenVersion }, env.jwtAccessSecret, env.jwtAccessExpiresIn);

export const signRefreshToken = (
  userId: Types.ObjectId | string,
  role: UserRole,
  tokenVersion: number
): string =>
  sign({ sub: userId.toString(), role, tokenVersion }, env.jwtRefreshSecret, env.jwtRefreshExpiresIn);

export const verifyAccessToken = (token: string): TokenPayload =>
  jwt.verify(token, env.jwtAccessSecret) as TokenPayload;

export const verifyRefreshToken = (token: string): TokenPayload =>
  jwt.verify(token, env.jwtRefreshSecret) as TokenPayload;
