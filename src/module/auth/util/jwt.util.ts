import jwt, { SignOptions, JwtPayload } from 'jsonwebtoken';
import { getEnvOrThrow } from '../../../shared/util';

const JWT_SECRET = getEnvOrThrow('JWT_SECRET');

export const generateJWT = (payload: Record<string, any>): string => {
  const options: SignOptions = { expiresIn: '1h' };
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyJWT = (token: string): JwtPayload | string => {
  return jwt.verify(token, JWT_SECRET);
};
