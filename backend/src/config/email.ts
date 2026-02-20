// eslint-disable-next-line @typescript-eslint/no-var-requires
const nodemailer = require('nodemailer');

// Create reusable transporter
export const createEmailTransporter = () => {
  if (process.env.NODE_ENV === 'production' && process.env.SENDGRID_API_KEY) {
    // Use SendGrid in production
    return nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587,
      auth: {
        user: 'apikey',
        pass: process.env.SENDGRID_API_KEY,
      },
    });
  } else if (process.env.SMTP_HOST) {
    // Use custom SMTP (e.g., Gmail)
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // For development - use Ethereal (test email service)
    console.warn('⚠️  No email configuration found. Using test mode (emails won\'t be sent).');
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'ethereal.user@ethereal.email',
        pass: 'ethereal.pass',
      },
    });
  }
};

export const transporter = createEmailTransporter();

// Email configuration
export const emailConfig = {
  from: {
    name: 'ROOMA',
    email: process.env.EMAIL_FROM || 'noreply@rooma.com',
  },
  replyTo: process.env.EMAIL_REPLY_TO || 'support@rooma.com',
};
