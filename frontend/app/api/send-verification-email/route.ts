import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Email sending via Resend
// FREE tier: 3,000 emails/month + 100 emails/day
// Much simpler than Gmail SMTP and works perfectly with Next.js!
// Sign up at: https://resend.com

interface EmailRequest {
  to: string;
  name: string;
  code: string;
  expiryMinutes: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequest = await request.json();
    const { to, name, code, expiryMinutes } = body;

    // Validate required fields
    if (!to || !name || !code) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      // Development mode - not configured
      console.log('='.repeat(60));
      console.log('📧 EMAIL VERIFICATION CODE (Development Mode - Resend Not Configured)');
      console.log('='.repeat(60));
      console.log(`To: ${to}`);
      console.log(`Name: ${name}`);
      console.log(`Code: ${code}`);
      console.log(`Expires in: ${expiryMinutes} minutes`);
      console.log('='.repeat(60));

      return NextResponse.json({
        success: true,
        message: 'Development mode: Code logged to console',
        code: code, // Return code in dev mode for easier testing
        devMode: true,
      });
    }

    // Production mode - send real email via Resend
    const resend = new Resend(resendApiKey);

    // Beautiful HTML email template
    const htmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #f43f5e 0%, #ec4899 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 32px;
            font-weight: bold;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 16px;
            opacity: 0.9;
        }
        .content {
            padding: 40px 30px;
            background-color: #ffffff;
        }
        .greeting {
            font-size: 18px;
            color: #333;
            margin-bottom: 20px;
        }
        .message {
            font-size: 16px;
            color: #666;
            margin-bottom: 30px;
            line-height: 1.8;
        }
        .code-container {
            background: linear-gradient(135deg, #fef3f4 0%, #fce7f3 100%);
            border: 3px solid #f43f5e;
            border-radius: 12px;
            padding: 30px;
            text-align: center;
            margin: 30px 0;
        }
        .code-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .code {
            font-size: 42px;
            font-weight: bold;
            color: #f43f5e;
            letter-spacing: 10px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
        }
        .expiry {
            font-size: 14px;
            color: #666;
            margin-top: 15px;
            background-color: #fff7ed;
            border: 1px solid #fed7aa;
            border-radius: 6px;
            padding: 12px;
            display: inline-block;
        }
        .expiry strong {
            color: #ea580c;
        }
        .warning {
            background-color: #fef3f4;
            border-left: 4px solid #f43f5e;
            padding: 15px;
            margin: 25px 0;
            border-radius: 4px;
        }
        .warning p {
            margin: 0;
            font-size: 14px;
            color: #666;
        }
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        .footer p {
            margin: 5px 0;
            font-size: 13px;
            color: #9ca3af;
        }
        .signature {
            margin-top: 30px;
            font-size: 16px;
            color: #666;
        }
        @media only screen and (max-width: 600px) {
            .header {
                padding: 30px 20px;
            }
            .header h1 {
                font-size: 24px;
            }
            .content {
                padding: 30px 20px;
            }
            .code {
                font-size: 32px;
                letter-spacing: 6px;
            }
        }
    </style>
</head>
<body>
    <div class="email-wrapper">
        <div class="header">
            <h1>🏠 ROOMA</h1>
            <p>Student Housing Platform</p>
        </div>

        <div class="content">
            <div class="greeting">
                Hi ${name},
            </div>

            <div class="message">
                Thank you for signing up with ROOMA! We're excited to help you find your perfect student housing.
                <br><br>
                To complete your registration and verify your email address, please use the verification code below:
            </div>

            <div class="code-container">
                <div class="code-label">Your Verification Code</div>
                <div class="code">${code}</div>
                <div class="expiry">
                    ⏱️ This code will expire in <strong>${expiryMinutes} minutes</strong>
                </div>
            </div>

            <div class="warning">
                <p>
                    <strong>🔒 Security Note:</strong> If you didn't request this verification code, please ignore this email.
                    Your account security is important to us.
                </p>
            </div>

            <div class="signature">
                Best regards,<br>
                <strong>The ROOMA Team</strong>
            </div>
        </div>

        <div class="footer">
            <p><strong>© 2025 ROOMA. All rights reserved.</strong></p>
            <p>This is an automated email. Please do not reply to this message.</p>
            <p style="margin-top: 15px; color: #d1d5db;">
                If you have any questions, contact us at support@rooma.com
            </p>
        </div>
    </div>
</body>
</html>
    `.trim();

    const textVersion = `
Hi ${name},

Thank you for signing up with ROOMA!

Your verification code is: ${code}

This code will expire in ${expiryMinutes} minutes.

If you didn't request this code, please ignore this email.

Best regards,
The ROOMA Team

---
© 2025 ROOMA. All rights reserved.
This is an automated email. Please do not reply.
    `.trim();

    const data = await resend.emails.send({
      from: 'ROOMA <onboarding@resend.dev>', // Using Resend test domain
      to: [to],
      subject: '🔐 Your ROOMA Verification Code',
      text: textVersion,
      html: htmlTemplate,
    });

    console.log(`✅ Verification email sent to ${to}`);
    console.log('📧 Resend Response:', JSON.stringify(data, null, 2));

    return NextResponse.json({
      success: true,
      message: `Verification code sent to ${to}`,
      devMode: false,
      emailId: data && typeof data === 'object' && 'id' in data ? data.id : undefined,
    });

  } catch (error: any) {
    console.error('❌ Error sending email:', error);

    return NextResponse.json(
      {
        error: 'Failed to send email',
        message: error.message || 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
