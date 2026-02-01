import supabase from '../config/supabase';
import { NotFoundError, BadRequestError } from '../utils/errors';
import { verifyEmailVerificationToken } from '../utils/jwt';
import type {
  UpdateProfileInput,
  UploadStudentIdInput,
  UploadGovernmentIdInput,
} from '../validators/user.validator';
import type {
  UserRow,
  UserUpdate,
  PropertyRow,
  PropertyPhotoRow,
  ReviewRow,
  StudentVerificationRow,
  StudentVerificationInsert,
  IdentityVerificationRow,
  IdentityVerificationInsert,
  UserSettingsRow,
  UserSettingsInsert,
  UserSettingsUpdate,
} from '../types/supabase-helpers';

/**
 * Get authenticated user's own profile
 */
export const getMyProfile = async (userId: string) => {
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, user_type, phone, phone_verified, email_verified, date_of_birth, profile_photo_url, bio, student_verified, id_verified, created_at, updated_at, last_login')
    .eq('id', userId)
    .single() as { data: Pick<UserRow, 'id' | 'email' | 'first_name' | 'last_name' | 'user_type' | 'phone' | 'phone_verified' | 'email_verified' | 'date_of_birth' | 'profile_photo_url' | 'bio' | 'student_verified' | 'id_verified' | 'created_at' | 'updated_at' | 'last_login'> | null; error: any };

  if (findError || !user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * Update user profile
 */
export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
  const updateData: UserUpdate = {
    ...data,
    updated_at: new Date().toISOString(),
  } as UserUpdate;
  if (data.date_of_birth) {
    updateData.date_of_birth = data.date_of_birth instanceof Date ? data.date_of_birth.toISOString() : data.date_of_birth;
  }

  const { data: user, error: updateError } = await supabase
    .from('users')
    // @ts-expect-error - Supabase type inference issue with update()
    .update(updateData as any)
    .eq('id', userId)
    .select('id, email, first_name, last_name, user_type, phone, phone_verified, email_verified, date_of_birth, profile_photo_url, bio, student_verified, id_verified, created_at, updated_at')
    .single() as { data: Pick<UserRow, 'id' | 'email' | 'first_name' | 'last_name' | 'user_type' | 'phone' | 'phone_verified' | 'email_verified' | 'date_of_birth' | 'profile_photo_url' | 'bio' | 'student_verified' | 'id_verified' | 'created_at' | 'updated_at'> | null; error: any };

  if (updateError || !user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * Get public user profile
 */
export const getUserProfile = async (userId: string) => {
  // Get user data
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, first_name, last_name, profile_photo_url, bio, user_type, student_verified, id_verified, created_at')
    .eq('id', userId)
    .single() as { data: Pick<UserRow, 'id' | 'first_name' | 'last_name' | 'profile_photo_url' | 'bio' | 'user_type' | 'student_verified' | 'id_verified' | 'created_at'> | null; error: any };

  if (userError || !user) {
    throw new NotFoundError('User not found');
  }

  // Get properties
  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, city, country, monthly_price_cents')
    .eq('host_id', userId)
    .eq('status', 'active')
    .limit(6) as { data: Array<Pick<PropertyRow, 'id' | 'title' | 'city' | 'country' | 'monthly_price_cents'>> | null; error: any };

  // Get first photo for each property
  const propertiesWithPhotos = await Promise.all(
    (properties || []).map(async (property) => {
      const { data: photos } = await supabase
        .from('property_photos')
        .select('photo_url')
        .eq('property_id', property.id || '')
        .order('display_order', { ascending: true })
        .limit(1)
        .maybeSingle() as { data: Pick<PropertyPhotoRow, 'photo_url'> | null; error: any };

      return {
        ...property,
        photos: photos ? [{ photo_url: photos.photo_url }] : [],
      };
    })
  );

  // Get reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select('overall_rating')
    .eq('reviewee_id', userId)
    .eq('status', 'published') as { data: Array<Pick<ReviewRow, 'overall_rating'>> | null; error: any };

  // Calculate average rating
  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.overall_rating || 0), 0) / reviews.length
      : null;

  return {
    ...user,
    properties: propertiesWithPhotos,
    average_rating: avgRating,
    total_reviews: reviews?.length || 0,
  };
};

/**
 * Upload student ID for verification
 */
export const uploadStudentId = async (userId: string, data: UploadStudentIdInput) => {
  // Check if user already has pending or approved verification
  const { data: existing } = await supabase
    .from('student_verifications')
    .select('id')
    .eq('user_id', userId)
    .in('verification_status', ['pending', 'approved'])
    .maybeSingle() as { data: Pick<StudentVerificationRow, 'id'> | null; error: any };

  if (existing) {
    throw new BadRequestError('Student verification already submitted or approved');
  }

  const verificationData: StudentVerificationInsert = {
    user_id: userId,
    university_name: data.university_name,
    university_email: data.university_email,
    student_id_photo_url: data.student_id_photo_url,
    verification_status: 'pending',
  };

  const { data: verification, error: createError } = await supabase
    .from('student_verifications')
    .insert(verificationData as any)
    .select()
    .single() as { data: StudentVerificationRow | null; error: any };

  if (createError || !verification) {
    throw new Error(createError?.message || 'Failed to create student verification');
  }

  return verification;
};

/**
 * Upload government ID for verification
 */
export const uploadGovernmentId = async (userId: string, data: UploadGovernmentIdInput) => {
  // Check if user already has pending or approved verification
  const { data: existing } = await supabase
    .from('identity_verifications')
    .select('id')
    .eq('user_id', userId)
    .in('verification_status', ['pending', 'approved'])
    .maybeSingle() as { data: Pick<IdentityVerificationRow, 'id'> | null; error: any };

  if (existing) {
    throw new BadRequestError('ID verification already submitted or approved');
  }

  // Hash ID number for privacy (if provided, though not in current schema)
  const verificationData: IdentityVerificationInsert = {
    user_id: userId,
    id_type: data.id_type,
    id_front_photo_url: data.id_front_photo_url,
    id_back_photo_url: data.id_back_photo_url || null,
    verification_status: 'pending',
    provider: 'manual',
  };

  const { data: verification, error: createError } = await supabase
    .from('identity_verifications')
    .insert(verificationData as any)
    .select()
    .single() as { data: IdentityVerificationRow | null; error: any };

  if (createError || !verification) {
    throw new Error(createError?.message || 'Failed to create identity verification');
  }

  return verification;
};

/**
 * Verify email
 * If requestedUserId is provided, it must match the token payload.
 */
export const verifyEmail = async (requestedUserId: string | null, token: string, code: string) => {
  const payload = verifyEmailVerificationToken(token);

  if (requestedUserId && payload.userId !== requestedUserId) {
    throw new NotFoundError('User not found');
  }

  if (payload.code !== code) {
    throw new BadRequestError('Verification code is invalid');
  }

  const updateData: UserUpdate = { email_verified: true };
  const { data: user, error: updateError } = await supabase
    .from('users')
    // @ts-expect-error - Supabase type inference issue with update()
    .update(updateData as any)
    .eq('id', payload.userId)
    .select('id, email, email_verified')
    .single() as { data: Pick<UserRow, 'id' | 'email' | 'email_verified'> | null; error: any };

  if (updateError || !user) {
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
  const updateData: UserUpdate = { phone_verified: true };
  const { data: user, error: updateError } = await supabase
    .from('users')
    // @ts-expect-error - Supabase type inference issue with update()
    .update(updateData as any)
    .eq('id', userId)
    .select('id, phone, phone_verified')
    .single() as { data: Pick<UserRow, 'id' | 'phone' | 'phone_verified'> | null; error: any };

  if (updateError || !user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * Get user settings
 */
export const getUserSettings = async (userId: string) => {
  const { data: settings } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle() as { data: UserSettingsRow | null; error: any };

  // Create default settings if not exists
  if (!settings) {
    const settingsData: UserSettingsInsert = { user_id: userId };
    const { data: newSettings, error: createError } = await supabase
      .from('user_settings')
      .insert(settingsData as any)
      .select()
      .single() as { data: UserSettingsRow | null; error: any };

    if (createError || !newSettings) {
      throw new Error(createError?.message || 'Failed to create user settings');
    }

    return newSettings;
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
  // Check if settings exist
  const { data: existing } = await supabase
    .from('user_settings')
    .select('user_id')
    .eq('user_id', userId)
    .maybeSingle() as { data: Pick<UserSettingsRow, 'user_id'> | null; error: any };

  if (existing) {
    // Update existing
    const updateData: UserSettingsUpdate = {
      ...data,
      updated_at: new Date().toISOString(),
    };
    const { data: settings, error: updateError } = await supabase
      .from('user_settings')
      // @ts-expect-error - Supabase type inference issue with update()
      .update(updateData as any)
      .eq('user_id', userId)
      .select()
      .single() as { data: UserSettingsRow | null; error: any };

    if (updateError || !settings) {
      throw new Error(updateError?.message || 'Failed to update user settings');
    }

    return settings;
  } else {
    // Create new
    const settingsData: UserSettingsInsert = {
      user_id: userId,
      ...data,
    } as UserSettingsInsert;
    const { data: settings, error: createError } = await supabase
      .from('user_settings')
      .insert(settingsData as any)
      .select()
      .single() as { data: UserSettingsRow | null; error: any };

    if (createError || !settings) {
      throw new Error(createError?.message || 'Failed to create user settings');
    }

  return settings;
  }
};
