import supabase from '../config/supabase';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import {
  generateTokens,
  verifyRefreshToken,
  generateEmailVerificationToken,
  generatePasswordResetToken,
  verifyPasswordResetToken,
} from '../utils/jwt';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from '../validators/auth.validator';
import { sendVerificationEmail, sendPasswordResetEmail } from './email.service';
import type { UserInsert, UserRow, UserUpdate } from '../types/supabase-helpers';
import {
  createLocalUser,
  findLocalUserByEmail,
  findLocalUserById,
  updateLocalUser,
  type LocalAuthUser,
} from './local-auth-store';

const shouldUseLocalAuthFallback = () => {
  return (
    process.env.AUTH_LOCAL_FALLBACK === 'true' ||
    !process.env.SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  );
};

const isSupabaseFetchFailure = (error: unknown): boolean => {
  const message = typeof (error as { message?: unknown })?.message === 'string'
    ? ((error as { message: string }).message || '')
    : '';

  if (/fetch failed|ENOTFOUND|ECONNREFUSED|network/i.test(message)) {
    return true;
  }

  return error instanceof TypeError && /fetch/i.test(error.message);
};

const sanitizeLocalUser = (user: LocalAuthUser) => {
  const { password_hash, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

const registerWithLocalStore = async (data: RegisterInput) => {
  const { email, password, first_name, last_name, user_type, phone, date_of_birth } = data;
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const existingUser = await findLocalUserByEmail(email);
  if (existingUser) {
    throw new ConflictError('A user with this email already exists');
  }

  const password_hash = await hashPassword(password);
  const user = await createLocalUser({
    email,
    password_hash,
    first_name,
    last_name,
    user_type,
    phone: phone || null,
    date_of_birth: date_of_birth ? date_of_birth.toISOString() : null,
  });

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    user_type: user.user_type,
  });

  const verificationToken = generateEmailVerificationToken({
    userId: user.id,
    email: user.email,
    code: verificationCode,
  });
  void sendVerificationEmail(user.email, user.first_name || 'there', verificationToken);

  return {
    user: sanitizeLocalUser(user),
    ...tokens,
  };
};

const loginWithLocalStore = async (data: LoginInput) => {
  const { email, password } = data;

  const user = await findLocalUserByEmail(email);
  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const updatedUser = await updateLocalUser(user.id, { last_login: new Date().toISOString() });
  const effectiveUser = updatedUser || user;

  const tokens = generateTokens({
    userId: effectiveUser.id,
    email: effectiveUser.email,
    user_type: effectiveUser.user_type,
  });

  return {
    user: sanitizeLocalUser(effectiveUser),
    ...tokens,
  };
};

const refreshAccessTokenWithLocalStore = async (refreshToken: string) => {
  const decoded = verifyRefreshToken(refreshToken);
  const user = await findLocalUserById(decoded.userId);

  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  return generateTokens({
    userId: user.id,
    email: user.email,
    user_type: user.user_type,
  });
};

const getCurrentUserWithLocalStore = async (userId: string) => {
  const user = await findLocalUserById(userId);
  if (!user) {
    throw new NotFoundError('User not found');
  }

  return sanitizeLocalUser(user);
};

const forgotPasswordWithLocalStore = async (data: ForgotPasswordInput) => {
  const { email } = data;
  const user = await findLocalUserByEmail(email);

  if (!user) {
    if (process.env.NODE_ENV !== 'production') {
      return {
        message: 'If an account exists for this email, a reset link has been sent.',
        devHint: 'No user found with this email in backend database.',
      };
    }

    return {
      message: 'If an account exists for this email, a reset link has been sent.',
    };
  }

  const resetToken = generatePasswordResetToken({
    userId: user.id,
    email: user.email,
  });
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

  void sendPasswordResetEmail(user.email, user.first_name || 'there', resetToken);

  if (process.env.NODE_ENV !== 'production') {
    return {
      message: 'Reset link generated for local development.',
      resetUrl,
    };
  }

  return {
    message: 'If an account exists for this email, a reset link has been sent.',
  };
};

const resetPasswordWithLocalStore = async (data: ResetPasswordInput) => {
  const { token, password } = data;
  const payload = verifyPasswordResetToken(token);

  const user = await findLocalUserById(payload.userId);
  if (!user || user.email !== payload.email) {
    throw new NotFoundError('User not found');
  }

  const password_hash = await hashPassword(password);
  await updateLocalUser(user.id, { password_hash });

  return { message: 'Password reset successful' };
};

/**
 * Register a new user
 */
export const register = async (data: RegisterInput) => {
  if (shouldUseLocalAuthFallback()) {
    return registerWithLocalStore(data);
  }

  const { email, password, first_name, last_name, user_type, phone, date_of_birth } = data;
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const { data: existingUser, error: existingUserError } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle() as { data: Pick<UserRow, 'id'> | null; error: any };

  if (existingUserError) {
    if (isSupabaseFetchFailure(existingUserError)) {
      return registerWithLocalStore(data);
    }
    throw new Error(existingUserError.message);
  }

  if (existingUser) {
    throw new ConflictError('A user with this email already exists');
  }

  const password_hash = await hashPassword(password);

  const userData: UserInsert = {
    email,
    password_hash,
    first_name,
    last_name,
    user_type,
    phone: phone || null,
    date_of_birth: date_of_birth ? date_of_birth.toISOString() : null,
    email_verified: false,
    phone_verified: false,
  };

  const { data: user, error: createUserError } = await supabase
    .from('users')
    .insert(userData as any)
    .select('id, email, first_name, last_name, user_type, phone, date_of_birth, email_verified, phone_verified, student_verified, id_verified, profile_photo_url, created_at')
    .single() as {
    data: Pick<UserRow, 'id' | 'email' | 'first_name' | 'last_name' | 'user_type' | 'phone' | 'date_of_birth' | 'email_verified' | 'phone_verified' | 'student_verified' | 'id_verified' | 'profile_photo_url' | 'created_at'> | null;
    error: any;
  };

  if (createUserError || !user) {
    if (isSupabaseFetchFailure(createUserError)) {
      return registerWithLocalStore(data);
    }
    throw new Error(createUserError?.message || 'Failed to create user');
  }

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    user_type: user.user_type,
  });

  const verificationToken = generateEmailVerificationToken({
    userId: user.id,
    email: user.email,
    code: verificationCode,
  });
  void sendVerificationEmail(user.email, user.first_name || 'there', verificationToken);

  return {
    user,
    ...tokens,
  };
};

/**
 * Login user
 */
export const login = async (data: LoginInput) => {
  if (shouldUseLocalAuthFallback()) {
    return loginWithLocalStore(data);
  }

  const { email, password } = data;

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, password_hash, first_name, last_name, user_type, phone, date_of_birth, email_verified, phone_verified, student_verified, id_verified, profile_photo_url, created_at')
    .eq('email', email)
    .single() as {
    data: Pick<UserRow, 'id' | 'email' | 'password_hash' | 'first_name' | 'last_name' | 'user_type' | 'phone' | 'date_of_birth' | 'email_verified' | 'phone_verified' | 'student_verified' | 'id_verified' | 'profile_photo_url' | 'created_at'> | null;
    error: any;
  };

  if (userError || !user) {
    if (isSupabaseFetchFailure(userError)) {
      return loginWithLocalStore(data);
    }
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.password_hash) {
    throw new UnauthorizedError('Please sign in using your social account');
  }

  const isPasswordValid = await comparePassword(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const updateData: UserUpdate = { last_login: new Date().toISOString() };
  await supabase
    .from('users')
    .update(updateData as any)
    .eq('id', user.id);

  const tokens = generateTokens({
    userId: user.id,
    email: user.email,
    user_type: user.user_type,
  });

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
  if (shouldUseLocalAuthFallback()) {
    return refreshAccessTokenWithLocalStore(refreshToken);
  }

  const decoded = verifyRefreshToken(refreshToken);

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, user_type')
    .eq('id', decoded.userId)
    .single() as {
    data: Pick<UserRow, 'id' | 'email' | 'user_type'> | null;
    error: any;
  };

  if (userError || !user) {
    if (isSupabaseFetchFailure(userError)) {
      return refreshAccessTokenWithLocalStore(refreshToken);
    }
    throw new UnauthorizedError('User not found');
  }

  return generateTokens({
    userId: user.id,
    email: user.email,
    user_type: user.user_type,
  });
};

/**
 * Get current user profile
 */
export const getCurrentUser = async (userId: string) => {
  if (shouldUseLocalAuthFallback()) {
    return getCurrentUserWithLocalStore(userId);
  }

  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, user_type, phone, phone_verified, email_verified, date_of_birth, profile_photo_url, bio, student_verified, id_verified, created_at, updated_at, last_login')
    .eq('id', userId)
    .single() as {
    data: Pick<UserRow, 'id' | 'email' | 'first_name' | 'last_name' | 'user_type' | 'phone' | 'phone_verified' | 'email_verified' | 'date_of_birth' | 'profile_photo_url' | 'bio' | 'student_verified' | 'id_verified' | 'created_at' | 'updated_at' | 'last_login'> | null;
    error: any;
  };

  if (userError || !user) {
    if (isSupabaseFetchFailure(userError)) {
      return getCurrentUserWithLocalStore(userId);
    }
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * Logout (client-side token deletion, server can optionally blacklist)
 */
export const logout = async () => {
  return { message: 'Logged out successfully' };
};

/**
 * Start forgot-password flow
 */
export const forgotPassword = async (data: ForgotPasswordInput) => {
  if (shouldUseLocalAuthFallback()) {
    return forgotPasswordWithLocalStore(data);
  }

  const { email } = data;

  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id, email, first_name')
    .eq('email', email)
    .maybeSingle() as {
    data: Pick<UserRow, 'id' | 'email' | 'first_name'> | null;
    error: any;
  };

  if (findError && isSupabaseFetchFailure(findError)) {
    return forgotPasswordWithLocalStore(data);
  }

  if (!user) {
    if (process.env.NODE_ENV !== 'production') {
      return {
        message: 'If an account exists for this email, a reset link has been sent.',
        devHint: 'No user found with this email in backend database.',
      };
    }

    return {
      message: 'If an account exists for this email, a reset link has been sent.',
    };
  }

  const resetToken = generatePasswordResetToken({
    userId: user.id,
    email: user.email,
  });
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}`;

  void sendPasswordResetEmail(user.email, user.first_name || 'there', resetToken);

  if (process.env.NODE_ENV !== 'production') {
    return {
      message: 'Reset link generated for local development.',
      resetUrl,
    };
  }

  return {
    message: 'If an account exists for this email, a reset link has been sent.',
  };
};

/**
 * Complete reset-password flow
 */
export const resetPassword = async (data: ResetPasswordInput) => {
  if (shouldUseLocalAuthFallback()) {
    return resetPasswordWithLocalStore(data);
  }

  const { token, password } = data;
  const payload = verifyPasswordResetToken(token);

  const { data: user, error: findError } = await supabase
    .from('users')
    .select('id')
    .eq('id', payload.userId)
    .eq('email', payload.email)
    .maybeSingle() as { data: Pick<UserRow, 'id'> | null; error: any };

  if (findError && isSupabaseFetchFailure(findError)) {
    return resetPasswordWithLocalStore(data);
  }

  if (findError || !user) {
    throw new NotFoundError('User not found');
  }

  const password_hash = await hashPassword(password);
  const updateData: UserUpdate = { password_hash, updated_at: new Date().toISOString() };

  const { error: updateError } = await supabase
    .from('users')
    .update(updateData as any)
    .eq('id', user.id);

  if (updateError) {
    if (isSupabaseFetchFailure(updateError)) {
      return resetPasswordWithLocalStore(data);
    }
    throw new Error(updateError.message || 'Failed to reset password');
  }

  return { message: 'Password reset successful' };
};
