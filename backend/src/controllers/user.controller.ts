import { Request, Response, NextFunction } from 'express';
import * as userService from '../services/user.service';
import { UnauthorizedError } from '../utils/errors';
import type {
  UpdateProfileInput,
  VerifyEmailInput,
  VerifyPhoneInput,
  UploadStudentIdInput,
  UploadGovernmentIdInput,
} from '../validators/user.validator';

// Helper to get authenticated user ID
const getAuthUserId = (req: Request): string => {
  const userId = (req as any).userId as string | undefined;
  if (!userId) {
    throw new UnauthorizedError('Authentication required');
  }
  return userId;
};

/**
 * GET /api/users/me
 * Get current user profile
 */
export const getMyProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const user = await userService.getMyProfile(userId);

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/me
 * Update current user profile
 */
export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const data: UpdateProfileInput = req.body;

    const user = await userService.updateProfile(userId, data);

    res.status(200).json({
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/:id/profile
 * Get public user profile
 */
export const getUserProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = req.params.id as string;
    const profile = await userService.getUserProfile(id);

    res.status(200).json({
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/upload-student-id
 * Upload student ID for verification
 */
export const uploadStudentId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const data: UploadStudentIdInput = req.body;

    const verification = await userService.uploadStudentId(userId, data);

    res.status(201).json({
      message: 'Student ID uploaded successfully. Verification pending.',
      data: verification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/upload-government-id
 * Upload government ID for verification
 */
export const uploadGovernmentId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const data: UploadGovernmentIdInput = req.body;

    const verification = await userService.uploadGovernmentId(userId, data);

    res.status(201).json({
      message: 'Government ID uploaded successfully. Verification pending.',
      data: verification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/verify-email
 * Verify email address
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const { token, code }: VerifyEmailInput = req.body;

    const user = await userService.verifyEmail(userId, token, code);

    res.status(200).json({
      message: 'Email verified successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/users/verify-phone
 * Verify phone number
 */
export const verifyPhone = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const { code }: VerifyPhoneInput = req.body;

    const user = await userService.verifyPhone(userId, code);

    res.status(200).json({
      message: 'Phone verified successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/users/settings
 * Get user settings
 */
export const getUserSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const settings = await userService.getUserSettings(userId);

    res.status(200).json({
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /api/users/settings
 * Update user settings
 */
export const updateUserSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId: string = getAuthUserId(req);
    const settings = await userService.updateUserSettings(userId, req.body);

    res.status(200).json({
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (error) {
    next(error);
  }
};
