// Email Verification using Gmail SMTP (via Next.js API Route)
// Completely FREE - no external service needed!
// Uses Nodemailer + Gmail SMTP (500 emails/day free)
//
// To enable real email sending:
// 1. Get a Gmail account
// 2. Enable 2-factor authentication on your Gmail
// 3. Generate an "App Password" for Gmail
// 4. Add to .env.local:
//    GMAIL_USER=your-email@gmail.com
//    GMAIL_APP_PASSWORD=your-16-digit-app-password

interface VerificationCode {
  code: string;
  email: string;
  expiresAt: number;
  attempts: number;
}

const VERIFICATION_CODES_KEY = 'rooma_verification_codes';
const CODE_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;

// Generate a random 6-digit code
export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Store verification code in localStorage
function storeVerificationCode(email: string, code: string) {
  const verificationData: VerificationCode = {
    code,
    email,
    expiresAt: Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000,
    attempts: 0,
  };

  const allCodes = getAllVerificationCodes();
  // Remove any existing code for this email
  const filteredCodes = allCodes.filter(c => c.email !== email);
  filteredCodes.push(verificationData);

  localStorage.setItem(VERIFICATION_CODES_KEY, JSON.stringify(filteredCodes));
}

// Get all verification codes
function getAllVerificationCodes(): VerificationCode[] {
  try {
    const data = localStorage.getItem(VERIFICATION_CODES_KEY);
    if (!data) return [];

    const codes: VerificationCode[] = JSON.parse(data);
    // Filter out expired codes
    const now = Date.now();
    const validCodes = codes.filter(c => c.expiresAt > now);

    // Update storage if we filtered anything out
    if (validCodes.length !== codes.length) {
      localStorage.setItem(VERIFICATION_CODES_KEY, JSON.stringify(validCodes));
    }

    return validCodes;
  } catch (error) {
    console.error('Error loading verification codes:', error);
    return [];
  }
}

// Get verification code for a specific email
function getVerificationCode(email: string): VerificationCode | null {
  const allCodes = getAllVerificationCodes();
  return allCodes.find(c => c.email === email) || null;
}

// Update verification code attempts
function incrementAttempts(email: string): void {
  const allCodes = getAllVerificationCodes();
  const codeIndex = allCodes.findIndex(c => c.email === email);

  if (codeIndex !== -1) {
    allCodes[codeIndex].attempts += 1;
    localStorage.setItem(VERIFICATION_CODES_KEY, JSON.stringify(allCodes));
  }
}

// Remove verification code after successful verification
function removeVerificationCode(email: string): void {
  const allCodes = getAllVerificationCodes();
  const filteredCodes = allCodes.filter(c => c.email !== email);
  localStorage.setItem(VERIFICATION_CODES_KEY, JSON.stringify(filteredCodes));
}

// Send verification code via email using API route
export async function sendVerificationCode(
  email: string,
  firstName?: string
): Promise<{ success: boolean; message: string; code?: string }> {
  try {
    // Generate code
    const code = generateVerificationCode();

    // Store code
    storeVerificationCode(email, code);

    // Send email via API route (uses Nodemailer + Gmail SMTP)
    const response = await fetch('/api/send-verification-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        name: firstName || 'Student',
        code: code,
        expiryMinutes: CODE_EXPIRY_MINUTES,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send email');
    }

    // Return success with code in dev mode
    return {
      success: true,
      message: result.message,
      code: result.devMode ? code : undefined, // Only return code in dev mode
    };

  } catch (error: any) {
    console.error('Error sending verification code:', error);
    return {
      success: false,
      message: error.message || 'Failed to send verification code. Please try again.',
    };
  }
}

// Verify the code entered by user
export function verifyCode(
  email: string,
  enteredCode: string
): { success: boolean; message: string } {
  const verificationData = getVerificationCode(email);

  if (!verificationData) {
    return {
      success: false,
      message: 'No verification code found. Please request a new code.',
    };
  }

  // Check if expired
  if (Date.now() > verificationData.expiresAt) {
    removeVerificationCode(email);
    return {
      success: false,
      message: 'Verification code has expired. Please request a new code.',
    };
  }

  // Check attempts
  if (verificationData.attempts >= MAX_ATTEMPTS) {
    removeVerificationCode(email);
    return {
      success: false,
      message: 'Too many incorrect attempts. Please request a new code.',
    };
  }

  // Verify code
  if (verificationData.code !== enteredCode.trim()) {
    incrementAttempts(email);
    const remainingAttempts = MAX_ATTEMPTS - (verificationData.attempts + 1);
    return {
      success: false,
      message: `Incorrect code. ${remainingAttempts} attempts remaining.`,
    };
  }

  // Success - remove code
  removeVerificationCode(email);
  return {
    success: true,
    message: 'Email verified successfully!',
  };
}

// Resend verification code
export async function resendVerificationCode(
  email: string,
  firstName?: string
): Promise<{ success: boolean; message: string; code?: string }> {
  // Remove existing code
  removeVerificationCode(email);

  // Send new code
  return sendVerificationCode(email, firstName);
}

// Get time remaining for code expiry
export function getTimeRemaining(email: string): number | null {
  const verificationData = getVerificationCode(email);
  if (!verificationData) return null;

  const remaining = verificationData.expiresAt - Date.now();
  return remaining > 0 ? remaining : null;
}
