import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateTokens, verifyRefreshToken } from '../utils/jwt';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';

/**
 * Register a new user
 */
export const register = async (data: RegisterInput) => {
  const { email, password, first_name, last_name, user_type, phone, date_of_birth } = data;

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ConflictError('A user with this email already exists');
  }

  // Hash password
  const password_hash = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password_hash,
      first_name,
      last_name,
      user_type,
      phone,
      date_of_birth,
      email_verified: false,
      phone_verified: false,
    },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      user_type: true,
      phone: true,
      date_of_birth: true,
      email_verified: true,
      phone_verified: true,
      student_verified: true,
      id_verified: true,
      profile_photo_url: true,
      created_at: true,
    },
  });

  // Generate tokens
  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    user_type: user.user_type,
  });

  // TODO: Send verification email
  // This will be implemented when email service is added

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
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      password_hash: true,
      first_name: true,
      last_name: true,
      user_type: true,
      phone: true,
      date_of_birth: true,
      email_verified: true,
      phone_verified: true,
      student_verified: true,
      id_verified: true,
      profile_photo_url: true,
      created_at: true,
    },
  });

  if (!user) {
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
  await prisma.user.update({
    where: { id: user.id },
    data: { last_login: new Date() },
  });

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
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      user_type: true,
    },
  });

  if (!user) {
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
 * Logout (client-side token deletion, server can optionally blacklist)
 */
export const logout = async () => {
  // In a JWT-based auth system, logout is primarily handled client-side
  // by deleting the tokens. Optionally, you can implement token blacklisting
  // using Redis here for added security.

  return { message: 'Logged out successfully' };
};

// TODO: Implement these functions when email service is added
// - verifyEmail
// - resendVerificationEmail
// - forgotPassword
// - resetPassword
