import prisma from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
import type {
  UpdateProfileInput,
  UploadStudentIdInput,
  UploadGovernmentIdInput,
} from '../validators/user.validator';

/**
 * Get authenticated user's own profile
 */
export const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      user_type: true,
      phone: true,
      phone_verified: true,
      email_verified: true,
      date_of_birth: true,
      profile_photo_url: true,
      bio: true,
      student_verified: true,
      id_verified: true,
      created_at: true,
      updated_at: true,
      last_login: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * Update user profile
 */
export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
      updated_at: new Date(),
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      user_type: true,
      phone: true,
      phone_verified: true,
      email_verified: true,
      date_of_birth: true,
      profile_photo_url: true,
      bio: true,
      student_verified: true,
      id_verified: true,
      created_at: true,
      updated_at: true,
    },
  });

  return user;
};

/**
 * Get public user profile
 */
export const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      profile_photo_url: true,
      bio: true,
      user_type: true,
      student_verified: true,
      id_verified: true,
      created_at: true,
      // Include aggregated data
      properties: {
        where: { status: 'active' },
        select: {
          id: true,
          title: true,
          city: true,
          country: true,
          monthly_price_cents: true,
          photos: {
            take: 1,
            orderBy: { display_order: 'asc' },
            select: { photo_url: true },
          },
        },
        take: 6,
      },
      reviews_received: {
        where: { status: 'published' },
        select: {
          overall_rating: true,
        },
      },
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Calculate average rating
  const avgRating =
    user.reviews_received.length > 0
      ? user.reviews_received.reduce((sum, r) => sum + Number(r.overall_rating), 0) /
        user.reviews_received.length
      : null;

  const { reviews_received, ...userData } = user;

  return {
    ...userData,
    average_rating: avgRating,
    total_reviews: reviews_received.length,
  };
};

/**
 * Upload student ID for verification
 */
export const uploadStudentId = async (userId: string, data: UploadStudentIdInput) => {
  // Check if user already has pending or approved verification
  const existing = await prisma.studentVerification.findFirst({
    where: {
      user_id: userId,
      verification_status: { in: ['pending', 'approved'] },
    },
  });

  if (existing) {
    throw new BadRequestError('Student verification already submitted or approved');
  }

  const verification = await prisma.studentVerification.create({
    data: {
      user_id: userId,
      university_name: data.university_name,
      university_email: data.university_email,
      student_id_photo_url: data.student_id_photo_url,
      verification_status: 'pending',
    },
  });

  return verification;
};

/**
 * Upload government ID for verification
 */
export const uploadGovernmentId = async (userId: string, data: UploadGovernmentIdInput) => {
  // Check if user already has pending or approved verification
  const existing = await prisma.identityVerification.findFirst({
    where: {
      user_id: userId,
      verification_status: { in: ['pending', 'approved'] },
    },
  });

  if (existing) {
    throw new BadRequestError('ID verification already submitted or approved');
  }

  // Hash ID number for privacy (if provided, though not in current schema)
  const verification = await prisma.identityVerification.create({
    data: {
      user_id: userId,
      id_type: data.id_type,
      id_front_photo_url: data.id_front_photo_url,
      id_back_photo_url: data.id_back_photo_url,
      verification_status: 'pending',
      provider: 'manual',
    },
  });

  return verification;
};

/**
 * Verify email (placeholder - will implement with email service)
 */
export const verifyEmail = async (userId: string, _token: string) => {
  // TODO: Implement token validation logic
  // For now, just mark as verified
  const user = await prisma.user.update({
    where: { id: userId },
    data: { email_verified: true },
    select: { id: true, email: true, email_verified: true },
  });

  return user;
};

/**
 * Verify phone (placeholder - will implement with SMS service)
 */
export const verifyPhone = async (userId: string, _code: string) => {
  // TODO: Implement code validation logic with Twilio
  // For now, just mark as verified
  const user = await prisma.user.update({
    where: { id: userId },
    data: { phone_verified: true },
    select: { id: true, phone: true, phone_verified: true },
  });

  return user;
};

/**
 * Get user settings
 */
export const getUserSettings = async (userId: string) => {
  let settings = await prisma.userSettings.findUnique({
    where: { user_id: userId },
  });

  // Create default settings if not exists
  if (!settings) {
    settings = await prisma.userSettings.create({
      data: {
        user_id: userId,
      },
    });
  }

  return settings;
};

/**
 * Update user settings
 */
export const updateUserSettings = async (
  userId: string,
  data: {
    language?: string;
    currency?: string;
    timezone?: string;
    email_notifications?: boolean;
    sms_notifications?: boolean;
    push_notifications?: boolean;
    marketing_emails?: boolean;
    booking_updates?: boolean;
    message_notifications?: boolean;
    profile_visibility?: string;
    show_email?: boolean;
    show_phone?: boolean;
    activity_status?: boolean;
    two_factor_enabled?: boolean;
  }
) => {
  const settings = await prisma.userSettings.upsert({
    where: { user_id: userId },
    create: {
      user_id: userId,
      ...data,
    },
    update: {
      ...data,
      updated_at: new Date(),
    },
  });

  return settings;
};
