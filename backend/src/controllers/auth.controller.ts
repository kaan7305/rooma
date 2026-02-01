import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import * as userService from '../services/user.service';
import type { RegisterInput, LoginInput, RefreshTokenInput, VerifyEmailInput } from '../validators/auth.validator';

/**
 * POST /api/auth/register
 * Register a new user
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: RegisterInput = req.body;
    const result = await authService.register(data);

    res.status(201).json({
      message: 'User registered successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Login user
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: LoginInput = req.body;
    const result = await authService.login(data);

    res.status(200).json({
      message: 'Login successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/refresh-token
 * Refresh access token
 */
export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken }: RefreshTokenInput = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);

    res.status(200).json({
      message: 'Token refreshed successfully',
      data: tokens,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/logout
 * Logout user
 */
export const logout = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await authService.logout();

    res.status(200).json({
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/auth/me
 * Get current user profile
 * Requires authentication
 */
export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const user = await authService.getCurrentUser(userId);

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/verify-email
 * Verify email using token + code (no auth required)
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, code }: VerifyEmailInput = req.body;
    const user = await userService.verifyEmail(null, token, code);

    res.status(200).json({
      message: 'Email verified successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
