import supabase from '../config/supabase';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateTokens, verifyRefreshToken, generateEmailVerificationToken } from '../utils/jwt';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';
import type { UserInsert, UserUpdate, UserRow } from '../types/supabase-helpers';
import { sendVerificationEmail } from './email.service';

/**
 * Register a new user
 */
export const register = async (data: RegisterInput) => {
  const { email, password, first_name, last_name, user_type, phone, date_of_birth } = data;
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existingUser) {
    throw new ConflictError('A user with this email already exists');
  }

  // Hash password
  const password_hash = await hashPassword(password);

  // Create user
  const insertData: UserInsert = {
    email,
    password_hash,
    first_name,
    last_name,
    user_type,
    phone: phone || null,
    date_of_birth: date_of_birth ? date_of_birth.toISOString().split('T')[0] : null,
    email_verified: false,
    phone_verified: false,
  };

  const { data: user, error: createError } = await supabase
    .from('users')
    .insert(insertData as any)
    .select('id, email, first_name, last_name, user_type, phone, date_of_birth, email_verified, phone_verified, student_verified, id_verified, profile_photo_url, created_at')
    .single() as { data: UserRow | null; error: any };

  if (createError || !user) {
    throw new Error(createError?.message || 'Failed to create user');
  }

  // Generate tokens
  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    user_type: user.user_type,
  });

  // Send verification email (non-blocking)
  const verificationToken = generateEmailVerificationToken({
    userId: user.id,
    email: user.email,
    code: verificationCode,
  });
  void sendVerificationEmail(user.email, user.first_name || 'there', verificationToken, verificationCode);

  return {
    user,
    ...tokens,
  };
};

/**
 * Login user
 */
export const login = async (data: LoginInput) => {
  const { email, password } = data;

  // Find user by email
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id, email, password_hash, first_name, last_name, user_type, phone, date_of_birth, email_verified, phone_verified, student_verified, id_verified, profile_photo_url, created_at')
    .eq('email', email)
    .single() as { data: UserRow | null; error: any };

  if (findError || !user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Check if password_hash exists (OAuth users won't have one)
  if (!user.password_hash) {
    throw new UnauthorizedError('Please sign in using your social account');
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.password_hash);

  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  // Update last login
  const updateData: UserUpdate = {
    last_login: new Date().toISOString(),
  };
  await (supabase
    .from('users')
    // @ts-expect-error - Supabase type inference issue with update()
    .update(updateData as any) as any)
    .eq('id', user.id || '');

  // Generate tokens
  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    user_type: user.user_type,
  });

  // Remove password_hash from response
  const { password_hash, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    ...tokens,
  };
};

/**
 * Refresh access token using refresh token
 */
export const refreshAccessToken = async (refreshToken: string) => {
  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Verify user still exists
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id, email, user_type')
    .eq('id', decoded.userId)
    .single() as { data: Pick<UserRow, 'id' | 'email' | 'user_type'> | null; error: any };

  if (findError || !user) {
    throw new UnauthorizedError('User not found');
  }

  // Generate new tokens
  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    user_type: user.user_type,
  });

  return tokens;
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (userId: string) => {
  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, user_type, phone, phone_verified, email_verified, date_of_birth, profile_photo_url, bio, student_verified, id_verified, created_at, updated_at, last_login')
    .eq('id', userId)
    .single() as { data: UserRow | null; error: any };

  if (findError || !user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * Logout (client-side token deletion, server can optionally blacklist)
 */
export const logout = async () => {
  // In a JWT-based auth system, logout is primarily handled client-side
  // by deleting the tokens. Optionally, you can implement token blacklisting
  // using Redis here for added security.

  return { message: 'Logged out successfully' };
};

// TODO: Implement these functions
// - resendVerificationEmail
// - forgotPassword
// - resetPassword
