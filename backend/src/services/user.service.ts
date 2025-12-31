import supabase from '../config/supabase';
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
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, user_type, phone, phone_verified, email_verified, date_of_birth, profile_photo_url, bio, student_verified, id_verified, created_at, updated_at, last_login')
    .eq('id', userId)
    .single();

  if (findError || !user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * Update user profile
 */
export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
  const { data: user, error: updateError } = await supabase
    .from('users')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select('id, email, first_name, last_name, user_type, phone, phone_verified, email_verified, date_of_birth, profile_photo_url, bio, student_verified, id_verified, created_at, updated_at')
    .single();

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
    .single();

  if (userError || !user) {
    throw new NotFoundError('User not found');
  }

  // Get properties
  const { data: properties } = await supabase
    .from('properties')
    .select('id, title, city, country, monthly_price_cents')
    .eq('host_id', userId)
    .eq('status', 'active')
    .limit(6);

  // Get first photo for each property
  const propertiesWithPhotos = await Promise.all(
    (properties || []).map(async (property) => {
      const { data: photos } = await supabase
        .from('property_photos')
        .select('photo_url')
        .eq('property_id', property.id)
        .order('display_order', { ascending: true })
        .limit(1)
        .single();

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
    .eq('status', 'published');

  // Calculate average rating
  const avgRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + Number(r.overall_rating), 0) / reviews.length
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
    .maybeSingle();

  if (existing) {
    throw new BadRequestError('Student verification already submitted or approved');
  }

  const { data: verification, error: createError } = await supabase
    .from('student_verifications')
    .insert({
      user_id: userId,
      university_name: data.university_name,
      university_email: data.university_email,
      student_id_photo_url: data.student_id_photo_url,
      verification_status: 'pending',
    })
    .select()
    .single();

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
    .maybeSingle();

  if (existing) {
    throw new BadRequestError('ID verification already submitted or approved');
  }

  // Hash ID number for privacy (if provided, though not in current schema)
  const { data: verification, error: createError } = await supabase
    .from('identity_verifications')
    .insert({
      user_id: userId,
      id_type: data.id_type,
      id_front_photo_url: data.id_front_photo_url,
      id_back_photo_url: data.id_back_photo_url,
      verification_status: 'pending',
      provider: 'manual',
    })
    .select()
    .single();

  if (createError || !verification) {
    throw new Error(createError?.message || 'Failed to create identity verification');
  }

  return verification;
};

/**
 * Verify email (placeholder - will implement with email service)
 */
export const verifyEmail = async (userId: string, _token: string) => {
  // TODO: Implement token validation logic
  // For now, just mark as verified
  const { data: user, error: updateError } = await supabase
    .from('users')
    .update({ email_verified: true })
    .eq('id', userId)
    .select('id, email, email_verified')
    .single();

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
  const { data: user, error: updateError } = await supabase
    .from('users')
    .update({ phone_verified: true })
    .eq('id', userId)
    .select('id, phone, phone_verified')
    .single();

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
    .maybeSingle();

  // Create default settings if not exists
  if (!settings) {
    const { data: newSettings, error: createError } = await supabase
      .from('user_settings')
      .insert({ user_id: userId })
      .select()
      .single();

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
    .maybeSingle();

  if (existing) {
    // Update existing
    const { data: settings, error: updateError } = await supabase
      .from('user_settings')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (updateError || !settings) {
      throw new Error(updateError?.message || 'Failed to update user settings');
    }

    return settings;
  } else {
    // Create new
    const { data: settings, error: createError } = await supabase
      .from('user_settings')
      .insert({
        user_id: userId,
        ...data,
      })
      .select()
      .single();

    if (createError || !settings) {
      throw new Error(createError?.message || 'Failed to create user settings');
    }

    return settings;
  }
};
