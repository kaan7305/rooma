import { transporter, emailConfig } from '../config/email';
// import handlebars from 'handlebars'; // Reserved for future template support

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
  verificationToken: string
): Promise<void> => {
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;

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
        .code { font-size: 24px; font-weight: bold; color: #4F46E5; letter-spacing: 2px; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Email</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Thanks for signing up! Please verify your email address to activate your NestQuarter account.</p>
          <p>Click the button below to verify:</p>
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
          <p style="margin-top: 20px;">Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; color: #4F46E5;">${verificationUrl}</p>
          <p style="margin-top: 20px; color: #666; font-size: 14px;">This link will expire in 24 hours.</p>
        </div>
        <div class="footer">
          <p>&copy; 2025 NestQuarter. All rights reserved.</p>
          <p>If you didn't create this account, please ignore this email.</p>
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
