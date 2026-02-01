import { z } from 'zod';

/**
 * Update user profile schema
 */
export const updateProfileSchema = z.object({
  first_name: z.string().min(1).max(100).trim().optional(),
  last_name: z.string().min(1).max(100).trim().optional(),
  phone: z.string().max(20).optional(),
  bio: z.string().max(500).optional(),
  date_of_birth: z
    .string()
    .datetime()
    .or(z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  profile_photo_url: z.string().url().optional(),
});

/**
 * Verify email schema
 */
export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

/**
 * Verify phone schema
 */
export const verifyPhoneSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

/**
 * Upload student ID schema
 */
export const uploadStudentIdSchema = z.object({
  university_name: z.string().min(1, 'University name is required'),
  university_email: z.string().email('Invalid university email'),
  student_id_photo_url: z.string().url('Invalid photo URL'),
});

/**
 * Upload government ID schema
 */
export const uploadGovernmentIdSchema = z.object({
  id_type: z.enum(['passport', 'drivers_license', 'national_id']),
  id_front_photo_url: z.string().url('Invalid photo URL'),
  id_back_photo_url: z.string().url('Invalid photo URL').optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>;
export type UploadStudentIdInput = z.infer<typeof uploadStudentIdSchema>;
export type UploadGovernmentIdInput = z.infer<typeof uploadGovernmentIdSchema>;
