import { getEnvOrThrow } from '../shared/util';

export const isProduction = getEnvOrThrow('NODE_ENV') === 'production';
export const PORT = getEnvOrThrow('PORT');
export const JWT_SECRET = getEnvOrThrow('JWT_SECRET');
export const SESSION_SECRET = getEnvOrThrow('SESSION_SECRET');
