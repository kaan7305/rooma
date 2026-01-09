import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../utils/errors';
import supabase from '../config/supabase';
import { USER_TYPES } from '../utils/constants';
import type { UserRow } from '../types/supabase-helpers';

/**
 * Middleware to require authentication
 * Verifies JWT token and attaches user info to request
 */
export const requireAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('No token provided');
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Attach user info to request
    (req as any).userId = decoded.userId;
    (req as any).user = {
      id: decoded.userId,
      email: decoded.email,
      user_type: decoded.user_type as 'guest' | 'host' | 'both',
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        next(new UnauthorizedError('Token has expired'));
      } else if (error.message.includes('invalid') || error.message.includes('malformed')) {
        next(new UnauthorizedError('Invalid token'));
      } else {
        next(new UnauthorizedError(error.message));
      }
    } else {
      next(new UnauthorizedError('Authentication failed'));
    }
  }
};

/**
 * Middleware to require host privileges
 * Must be used after requireAuth
 */
export const requireHost = (req: Request, _res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  const { user_type } = user;

  if (user_type !== USER_TYPES.HOST && user_type !== USER_TYPES.BOTH) {
    return next(new ForbiddenError('Host privileges required'));
  }

  next();
};

/**
 * Middleware to require guest privileges
 * Must be used after requireAuth
 */
export const requireGuest = (req: Request, _res: Response, next: NextFunction) => {
  const user = (req as any).user;

  if (!user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  const { user_type } = user;

  if (user_type !== USER_TYPES.GUEST && user_type !== USER_TYPES.BOTH) {
    return next(new ForbiddenError('Guest privileges required'));
  }

  next();
};

/**
 * Middleware to optionally authenticate
 * Does not throw error if no token, but attaches user if token is valid
 */
export const optionalAuth = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      if (token) {
        const decoded = verifyAccessToken(token);
        (req as any).userId = decoded.userId;
        (req as any).user = {
          id: decoded.userId,
          email: decoded.email,
          user_type: decoded.user_type as 'guest' | 'host' | 'both',
        };
      }
    }

    next();
  } catch (error) {
    // Don't throw error, just continue without auth
    next();
  }
};

/**
 * Middleware to verify email is verified
 * Must be used after requireAuth
 */
export const requireEmailVerified = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const { data: user, error: findError } = await supabase
      .from('users')
      .select('email_verified')
      .eq('id', userId)
      .single() as { data: Pick<UserRow, 'email_verified'> | null; error: any };

    if (findError || !user) {
      return next(new UnauthorizedError('User not found'));
    }

    if (!user.email_verified) {
      return next(new ForbiddenError('Email verification required'));
    }

    next();
  } catch (error) {
    next(error);
  }
};
