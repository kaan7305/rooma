import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcryptjs';

function getJwtSecret(): string {
  return process.env.JWT_SECRET || 'dev-jwt-secret-local-only';
}
function getJwtRefreshSecret(): string {
  return process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-local-only';
}

export interface JWTPayload {
  userId: string;
  email: string;
  userType: string;
}

export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '15m' });
}

export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, getJwtRefreshSecret(), { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJwtSecret()) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, getJwtRefreshSecret()) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
