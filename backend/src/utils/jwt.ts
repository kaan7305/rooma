import jwt from 'jsonwebtoken';
import config from '../config/env';
import { JWT_ACCESS_TOKEN_EXPIRES, JWT_REFRESH_TOKEN_EXPIRES } from './constants';

interface TokenPayload {
  userId: string;
  email: string;
  user_type: string;
}

interface EmailVerificationPayload {
  userId: string;
  email: string;
  code: string;
}

interface PasswordResetPayload {
  userId: string;
  email: string;
}

/**
 * Generate access token (short-lived, 15 minutes)
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.secret, {
    expiresIn: JWT_ACCESS_TOKEN_EXPIRES,
  });
};

/**
 * Generate refresh token (long-lived, 7 days)
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: JWT_REFRESH_TOKEN_EXPIRES,
  });
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    }
    throw new Error('Token verification failed');
  }
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    }
    throw new Error('Token verification failed');
  }
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokens = (payload: TokenPayload) => {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
};

/**
 * Derive a purpose-specific secret from the main JWT secret.
 * Ensures email verification and password reset tokens cannot be
 * used as access tokens (or vice versa), even without dedicated env vars.
 */
function deriveSecret(envVar: string, purpose: string): string {
  const explicit = process.env[envVar];
  if (explicit) return explicit;
  return `${config.jwt.secret}:${purpose}`;
}

/**
 * Generate email verification token (24h)
 */
export const generateEmailVerificationToken = (payload: EmailVerificationPayload) => {
  const secret = deriveSecret('EMAIL_VERIFICATION_SECRET', 'email-verify');
  return jwt.sign(payload, secret, { expiresIn: '24h' });
};

/**
 * Verify email verification token
 */
export const verifyEmailVerificationToken = (token: string): EmailVerificationPayload => {
  const secret = deriveSecret('EMAIL_VERIFICATION_SECRET', 'email-verify');
  try {
    return jwt.verify(token, secret) as EmailVerificationPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Verification link has expired');
    }
    throw new Error('Invalid verification token');
  }
};

/**
 * Generate password reset token (1h)
 */
export const generatePasswordResetToken = (payload: PasswordResetPayload) => {
  const secret = deriveSecret('PASSWORD_RESET_SECRET', 'password-reset');
  return jwt.sign(payload, secret, { expiresIn: '1h' });
};

/**
 * Verify password reset token
 */
export const verifyPasswordResetToken = (token: string): PasswordResetPayload => {
  const secret = deriveSecret('PASSWORD_RESET_SECRET', 'password-reset');
  try {
    return jwt.verify(token, secret) as PasswordResetPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Password reset link has expired');
    }
    throw new Error('Invalid password reset token');
  }
};
