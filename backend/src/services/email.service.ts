import nodemailer from 'nodemailer';
import { transporter, emailConfig } from '../config/email';

/**
 * Send generic email
 */
const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  try {
    const mailOptions = {
      from: `${emailConfig.from.name} <${emailConfig.from.email}>`,
      to,
      subject,
      html,
      replyTo: emailConfig.replyTo,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);

    // In development, log preview URL
    if (process.env.NODE_ENV !== 'production') {
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
  } catch (error) {
    console.error('Email sending failed:', error);
    // Don't throw error - email failure shouldn't break the flow
  }
};

/**
 * Send welcome email
 */
export const sendWelcomeEmail = async (email: string, firstName: string): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to NestQuarter!</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Welcome to NestQuarter - your global student housing platform!</p>
          <p>We're excited to have you join our community of students finding their perfect home away from home.</p>
          <p>Here's what you can do:</p>
          <ul>
            <li>Browse thousands of student-friendly properties</li>
            <li>Connect with verified hosts</li>
            <li>Book your next stay with confidence</li>
            <li>Leave and read reviews from fellow students</li>
          </ul>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">Start Exploring</a>
        </div>
        <div class="footer">
          <p>&copy; 2025 NestQuarter. All rights reserved.</p>
          <p>If you didn't create this account, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, 'Welcome to NestQuarter!', html);
};

/**
 * Send email verification
 */
export const sendVerificationEmail = async (
  email: string,
  firstName: string,
  verificationToken: string,
  verificationCode: string
): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}&code=${verificationCode}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background: #fdf2f8; }
        .shell { background: radial-gradient(circle at 20% 20%, #ffe3f4 0, transparent 35%), radial-gradient(circle at 80% 0%, #e0f2fe 0, transparent 35%), #fff; padding: 32px 16px; }
        .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 18px; padding: 28px; box-shadow: 0 18px 50px rgba(255, 64, 129, 0.15); border: 1px solid #ffe4f3; }
        .logo { font-weight: 800; font-size: 22px; color: #ff0a6c; letter-spacing: -0.4px; }
        .hero-title { font-size: 28px; font-weight: 800; color: #111827; margin: 18px 0 10px; }
        .subtitle { font-size: 16px; color: #4b5563; margin: 0 0 24px; }
        .pill { display: inline-block; padding: 6px 14px; background: linear-gradient(90deg, #ff0062, #ff4dd2); color: #fff; border-radius: 999px; font-weight: 700; font-size: 13px; letter-spacing: 0.4px; }
        .code-box { margin: 20px 0; padding: 18px 20px; background: #fff5fb; border: 1px solid #ffd6eb; border-radius: 12px; text-align: center; }
        .code-label { font-size: 13px; letter-spacing: 0.4px; text-transform: uppercase; color: #9ca3af; margin-bottom: 6px; }
        .code { font-size: 26px; font-weight: 800; letter-spacing: 6px; color: #ff0062; }
        .button { display: inline-block; padding: 14px 22px; background: linear-gradient(90deg, #ff0062, #ff4dd2); color: white; text-decoration: none; border-radius: 12px; font-weight: 700; box-shadow: 0 10px 25px rgba(255, 0, 98, 0.25); }
        .card { background: #f9fafb; border-radius: 14px; padding: 16px; border: 1px solid #f3f4f6; margin-top: 18px; }
        .footer { text-align: center; padding: 16px; color: #6b7280; font-size: 12px; }
        .muted { color: #6b7280; font-size: 13px; }
      </style>
    </head>
    <body class="shell">
      <div class="container">
        <div class="logo">NestQuarter</div>
        <div class="pill">Verify your email</div>
        <h1 class="hero-title">Welcome, ${firstName}!</h1>
        <p class="subtitle">Use the code below or tap the button to confirm your email and start booking verified sublets.</p>
        <div class="code-box">
          <div class="code-label">Your verification code</div>
          <div class="code">${verificationCode}</div>
        </div>
        <a href="${verificationUrl}" class="button">Confirm Email</a>
        <div class="card">
          <p class="muted">Having trouble? Copy this link into your browser:</p>
          <p style="word-break: break-all; color: #ff0062; font-weight: 600; font-size: 13px;">${verificationUrl}</p>
          <p class="muted" style="margin-top: 6px;">This link expires in 24 hours.</p>
        </div>
        <div class="footer">
          <p>If you didn't create this account, you can safely ignore this email.</p>
          <p>&copy; ${new Date().getFullYear()} NestQuarter. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, 'Verify Your Email - NestQuarter', html);
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (
  email: string,
  firstName: string,
  resetToken: string
): Promise<void> => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>We received a request to reset your password for your NestQuarter account.</p>
          <p>Click the button below to reset your password:</p>
          <a href="${resetUrl}" class="button">Reset Password</a>
          <p style="margin-top: 20px;">Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #4F46E5;">${resetUrl}</p>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="margin-top: 20px; color: #d32f2f; font-weight: bold;">If you didn't request this, please ignore this email and your password will remain unchanged.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 NestQuarter. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, 'Password Reset Request - NestQuarter', html);
};

/**
 * Send booking confirmation email
 */
export const sendBookingConfirmationEmail = async (
  email: string,
  firstName: string,
  bookingDetails: {
    propertyTitle: string;
    checkIn: string;
    checkOut: string;
    totalPrice: number;
    bookingId: string;
  }
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .booking-details { background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✓ Booking Confirmed!</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Great news! Your booking has been confirmed.</p>
          <div class="booking-details">
            <h3>${bookingDetails.propertyTitle}</h3>
            <div class="detail-row">
              <span>Check-in:</span>
              <strong>${bookingDetails.checkIn}</strong>
            </div>
            <div class="detail-row">
              <span>Check-out:</span>
              <strong>${bookingDetails.checkOut}</strong>
            </div>
            <div class="detail-row">
              <span>Total Price:</span>
              <strong>$${(bookingDetails.totalPrice / 100).toFixed(2)}</strong>
            </div>
            <div class="detail-row">
              <span>Booking ID:</span>
              <strong>${bookingDetails.bookingId}</strong>
            </div>
          </div>
          <p>Your host will reach out to you soon with check-in details.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 NestQuarter. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail(email, 'Booking Confirmed - NestQuarter', html);
};

// Import nodemailer for test message URL
import nodemailer from 'nodemailer';
