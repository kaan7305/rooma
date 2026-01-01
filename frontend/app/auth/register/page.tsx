'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/lib/toast-context';
import TurnstileCaptcha from '@/components/TurnstileCaptcha';
import { sendVerificationCode, verifyCode, resendVerificationCode, getTimeRemaining } from '@/lib/email-verification';
import { Mail, ArrowRight, Check, Clock, RefreshCw } from 'lucide-react';

// Step 1: Email validation schema
const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Step 3: Full registration schema
const registerSchema = z
  .object({
    first_name: z.string().min(2, 'First name must be at least 2 characters'),
    last_name: z.string().min(2, 'Last name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirm_password: z.string(),
    phone_number: z.string().optional(),
    is_student: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords don't match",
    path: ['confirm_password'],
  });

type EmailForm = z.infer<typeof emailSchema>;
type RegisterForm = z.infer<typeof registerSchema>;

type Step = 1 | 2 | 3;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading, error } = useAuthStore();
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [devCode, setDevCode] = useState(''); // For development mode
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [codeError, setCodeError] = useState('');
  const [codeSuccess, setCodeSuccess] = useState('');
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [canResend, setCanResend] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  const {
    register: registerEmailField,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  // Timer for code expiry
  useEffect(() => {
    if (currentStep === 2 && email) {
      const interval = setInterval(() => {
        const remaining = getTimeRemaining(email);
        if (remaining !== null) {
          setTimeRemaining(remaining);
          setCanResend(false);
        } else {
          setTimeRemaining(null);
          setCanResend(true);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStep, email]);

  const onEmailSubmit = async (data: EmailForm) => {
    setIsSendingCode(true);
    setCodeError('');
    setCodeSuccess('');

    try {
      const result = await sendVerificationCode(data.email);

      if (result.success) {
        setEmail(data.email);
        setCodeSuccess(result.message);
        setCurrentStep(2);

        // In development mode, show the code
        if (result.code) {
          setDevCode(result.code);
          toast.info(`DEVELOPMENT MODE: Your verification code is: ${result.code} (In production, this will be sent to your email)`);
        }
      } else {
        setCodeError(result.message);
      }
    } catch (error) {
      setCodeError('Failed to send verification code. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setCodeError('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifyingCode(true);
    setCodeError('');

    try {
      const result = verifyCode(email, verificationCode);

      if (result.success) {
        setIsEmailVerified(true);
        setCodeSuccess(result.message);
        // Pre-fill email in the registration form
        setValue('email', email);
        setTimeout(() => {
          setCurrentStep(3);
        }, 1000);
      } else {
        setCodeError(result.message);
      }
    } catch (error) {
      setCodeError('Failed to verify code. Please try again.');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleResendCode = async () => {
    setIsSendingCode(true);
    setCodeError('');
    setCodeSuccess('');
    setVerificationCode('');

    try {
      const result = await resendVerificationCode(email);

      if (result.success) {
        setCodeSuccess(result.message);

        // In development mode, show the code
        if (result.code) {
          setDevCode(result.code);
          toast.info(`DEVELOPMENT MODE: Your NEW verification code is: ${result.code} (In production, this will be sent to your email)`);
        }
      } else {
        setCodeError(result.message);
      }
    } catch (error) {
      setCodeError('Failed to resend code. Please try again.');
    } finally {
      setIsSendingCode(false);
    }
  };

  const onSubmit = async (data: RegisterForm) => {
    if (!isEmailVerified) {
      toast.warning('Please verify your email first');
      return;
    }

    try {
      // Transform form data to match RegisterData interface
      await registerUser({
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        password: data.password,
        phone: data.phone_number,
        userType: data.is_student ? 'student' : 'guest',
      });
      router.push('/');
    } catch (err) {
      // Error is handled by the store
    }
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">NestQuarter</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Create your account and find your perfect home.</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= 1 ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {currentStep > 1 ? <Check className="w-5 h-5" /> : '1'}
              </div>
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">Email</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= 2 ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                {currentStep > 2 ? <Check className="w-5 h-5" /> : '2'}
              </div>
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">Verify</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-gradient-to-r from-rose-500 to-pink-500' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                currentStep >= 3 ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
              }`}>
                3
              </div>
              <span className="text-xs mt-1 text-gray-600 dark:text-gray-300">Details</span>
            </div>
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Step 1: Email Entry */}
          {currentStep === 1 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Mail className="w-6 h-6 text-rose-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Enter Your Student Email</h2>
              </div>

              {codeError && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{codeError}</p>
                </div>
              )}

              <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    {...registerEmailField('email')}
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                    placeholder="you@email.com"
                  />
                  {emailErrors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{emailErrors.email.message}</p>}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    📧 We'll send a verification code to your email address to confirm it's yours.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSendingCode}
                  className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSendingCode ? (
                    <>Sending Code...</>
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {/* Step 2: Code Verification */}
          {currentStep === 2 && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <Check className="w-6 h-6 text-rose-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Verify Your Email</h2>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg p-4 mb-6">
                <p className="text-sm text-emerald-800 dark:text-emerald-300">
                  ✉️ We sent a verification code to <strong>{email}</strong>
                </p>
              </div>

              {codeError && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{codeError}</p>
                </div>
              )}

              {codeSuccess && (
                <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">{codeSuccess}</p>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={verificationCode}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setVerificationCode(value);
                      setCodeError('');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 text-center text-2xl font-bold tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                  />
                  {timeRemaining !== null && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="w-4 h-4" />
                      <span>Code expires in {formatTime(timeRemaining)}</span>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isVerifyingCode || verificationCode.length !== 6 || isEmailVerified}
                  className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifyingCode ? 'Verifying...' : isEmailVerified ? 'Verified!' : 'Verify Code'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isSendingCode || !canResend}
                    className="text-sm text-rose-600 hover:text-rose-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                  >
                    <RefreshCw className="w-4 h-4" />
                    {isSendingCode ? 'Sending...' : 'Resend Code'}
                  </button>
                  {!canResend && timeRemaining && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Available after code expires</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(1);
                    setVerificationCode('');
                    setCodeError('');
                    setCodeSuccess('');
                  }}
                  className="w-full text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 text-sm"
                >
                  ← Change Email Address
                </button>
              </div>
            </>
          )}

          {/* Step 3: Complete Registration */}
          {currentStep === 3 && (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Complete Your Profile</h2>

              {error && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      First Name
                    </label>
                    <input
                      {...register('first_name')}
                      type="text"
                      id="first_name"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                      placeholder="John"
                    />
                    {errors.first_name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.first_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Last Name
                    </label>
                    <input
                      {...register('last_name')}
                      type="text"
                      id="last_name"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                      placeholder="Doe"
                    />
                    {errors.last_name && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.last_name.message}</p>
                    )}
                  </div>
                </div>

                {/* Email Field (Read-only, already verified) */}
                <div>
                  <label htmlFor="email_confirmed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address (Verified)
                  </label>
                  <div className="relative">
                    <input
                      {...register('email')}
                      type="email"
                      id="email_confirmed"
                      readOnly
                      className="w-full px-4 py-3 border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg outline-none text-gray-900 dark:text-gray-100"
                    />
                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>

                {/* Phone Number Field */}
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    {...register('phone_number')}
                    type="tel"
                    id="phone_number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                        placeholder="Min. 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        {showPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirm_password"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        {...register('confirm_password')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirm_password"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition placeholder:text-gray-500 dark:placeholder:text-gray-400 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                        placeholder="Confirm password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                    {errors.confirm_password && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirm_password.message}</p>
                    )}
                  </div>
                </div>

                {/* Student Checkbox */}
                <div className="flex items-center">
                  <input
                    {...register('is_student')}
                    type="checkbox"
                    id="is_student"
                    defaultChecked
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 dark:border-gray-700 rounded"
                  />
                  <label htmlFor="is_student" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    I am a student
                  </label>
                </div>

                {/* Captcha */}
                <TurnstileCaptcha onVerify={setIsCaptchaVerified} isVerified={isCaptchaVerified} />

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading || !isCaptchaVerified}
                  className="w-full bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>
            </>
          )}

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
            <span className="px-4 text-sm text-gray-500 dark:text-gray-400">Or</span>
            <div className="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
          </div>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-rose-600 dark:text-rose-400 font-medium hover:text-rose-700 dark:hover:text-rose-300">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
