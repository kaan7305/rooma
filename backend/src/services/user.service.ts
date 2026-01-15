import prisma from '../config/prisma';
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

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * Get public user profile
 */
export const getUserProfile = async (userId: string) => {
  // Get user data
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
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  // Get properties with first photo
  const properties = await prisma.property.findMany({
    where: {
      host_id: userId,
      status: 'active',
    },
    select: {
      id: true,
      title: true,
      city: true,
      country: true,
      monthly_price_cents: true,
      photos: {
        select: {
          photo_url: true,
        },
        orderBy: {
          display_order: 'asc',
        },
        take: 1,
      },
    },
    take: 6,
  });

  // Get reviews
  const reviews = await prisma.review.findMany({
    where: {
      reviewee_id: userId,
      status: 'published',
    },
    select: {
      overall_rating: true,
    },
  });

  // Calculate average rating
  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.overall_rating), 0) / reviews.length
      : null;

  return {
    ...user,
    properties: properties.map(prop => ({
      ...prop,
      photos: prop.photos,
    })),
    average_rating: avgRating,
    total_reviews: reviews.length,
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
      verification_status: {
        in: ['pending', 'approved'],
      },
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
      verification_status: {
        in: ['pending', 'approved'],
      },
    },
  });

  if (existing) {
    throw new BadRequestError('ID verification already submitted or approved');
  }

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
    select: {
      id: true,
      email: true,
      email_verified: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

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
    select: {
      id: true,
      phone: true,
      phone_verified: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

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
      data: { user_id: userId },
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
  // Upsert settings (create if not exists, update if exists)
  const settings = await prisma.userSettings.upsert({
    where: { user_id: userId },
    update: {
      ...data,
      updated_at: new Date(),
    },
    create: {
      user_id: userId,
      ...data,
    },
  });

  return settings;
};
