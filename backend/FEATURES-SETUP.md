# 🚀 ROOMA Additional Features Setup Guide

This guide will help you set up **File Upload**, **Email Service**, and **Payment Integration** for your ROOMA backend.

---

## 📦 Features Added

✅ **File Upload with Cloudinary**
- Profile photo upload
- Property photo upload (up to 20 images)
- Verification documents (ID, student ID)
- Automatic image optimization
- Secure cloud storage

✅ **Email Service with Nodemailer**
- Welcome emails
- Email verification
- Password reset
- Booking confirmations
- Custom HTML templates

✅ **Stripe Payment Integration**
- Payment intent creation
- Payment confirmation
- Refund processing
- Webhook handling
- Payout management

---

## 1️⃣ Cloudinary Setup (File Upload)

### Why Cloudinary?
- Free tier: 25GB storage, 25GB bandwidth
- Automatic image optimization
- CDN delivery
- Easy integration

### Setup Steps:

#### Step 1: Create Cloudinary Account
1. Go to https://cloudinary.com/users/register/free
2. Sign up (free account)
3. Verify your email

#### Step 2: Get Your Credentials
1. Go to Dashboard: https://console.cloudinary.com/
2. Copy these values:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

#### Step 3: Add to Environment Variables

Add to your `.env` file:

```bash
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

**Example:**
```bash
CLOUDINARY_CLOUD_NAME=rooma
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
```

#### Step 4: Test Upload

```bash
# Upload profile photo
curl -X POST http://localhost:3001/api/upload/profile-photo \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "photo=@/path/to/image.jpg"
```

✅ **Done!** Images are now stored in Cloudinary!

---

## 2️⃣ Email Service Setup

You have **two options**: Gmail (easiest) or SendGrid (production-ready)

### Option A: Gmail SMTP (Development)

#### Step 1: Enable 2-Factor Authentication
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification**

#### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select **Mail** and **Other** (custom name: "ROOMA")
3. Click **Generate**
4. Copy the 16-character password

#### Step 3: Add to Environment Variables

```bash
# Email Configuration - Gmail
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password

EMAIL_FROM=noreply@rooma.com
EMAIL_REPLY_TO=support@rooma.com
FRONTEND_URL=http://localhost:3000
```

**Example:**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=john@gmail.com
SMTP_PASS=abcd efgh ijkl mnop

EMAIL_FROM=noreply@rooma.com
EMAIL_REPLY_TO=support@rooma.com
FRONTEND_URL=http://localhost:3000
```

### Option B: SendGrid (Production)

#### Step 1: Create SendGrid Account
1. Go to https://signup.sendgrid.com/
2. Sign up (free tier: 100 emails/day)
3. Verify your email

#### Step 2: Create API Key
1. Go to https://app.sendgrid.com/settings/api_keys
2. Click **Create API Key**
3. Name: "ROOMA API"
4. Select **Full Access**
5. Copy the API key

#### Step 3: Verify Sender Identity
1. Go to https://app.sendgrid.com/settings/sender_auth
2. Click **Verify a Single Sender**
3. Fill in your details
4. Verify the confirmation email

#### Step 4: Add to Environment Variables

```bash
# Email Configuration - SendGrid
SENDGRID_API_KEY=SG.your_api_key_here

EMAIL_FROM=noreply@rooma.com
EMAIL_REPLY_TO=support@rooma.com
FRONTEND_URL=http://localhost:3000
```

#### Test Email

Your app automatically sends emails when:
- User registers → Welcome email
- Email verification → Verification link
- Password reset → Reset link
- Booking confirmed → Confirmation email

---

## 3️⃣ Stripe Payment Setup

### Why Stripe?
- Industry standard
- Excellent documentation
- Test mode for development
- Secure payment processing

### Setup Steps:

#### Step 1: Create Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Sign up (free account)
3. Stay in **Test Mode** for now

#### Step 2: Get API Keys
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy these values:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

#### Step 3: Set Up Webhooks (Important!)

1. Go to https://dashboard.stripe.com/test/webhooks
2. Click **Add endpoint**
3. Endpoint URL: `https://your-api-url.com/api/payments/webhook`
   - For local testing: Use ngrok (see below)
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)

#### Step 4: Add to Environment Variables

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
```

#### Step 5: Local Webhook Testing (Optional)

For local development, use **ngrok** to expose your local server:

```bash
# Install ngrok
brew install ngrok

# Start ngrok
ngrok http 3001

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
# Use this as your webhook URL in Stripe Dashboard
```

#### Test Payment

```bash
# Create payment intent
curl -X POST http://localhost:3001/api/payments/create-intent \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"booking_id":"BOOKING_ID","payment_method":"card"}'

# Test card numbers (Stripe test mode):
# Success: 4242 4242 4242 4242
# Decline: 4000 0000 0000 0002
# Use any future expiry date and any 3-digit CVC
```

---

## 🧪 Testing All Features

### 1. Test File Upload

```bash
# Get auth token
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@rooma.com","password":"Password123!"}' \
  | jq -r '.data.accessToken')

# Upload profile photo
curl -X POST http://localhost:3001/api/upload/profile-photo \
  -H "Authorization: Bearer $TOKEN" \
  -F "photo=@./test-image.jpg"
```

### 2. Test Email (Check Console)

```bash
# Register new user (triggers welcome email)
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"newuser@test.com",
    "password":"Password123!",
    "first_name":"Test",
    "last_name":"User",
    "user_type":"guest",
    "phone":"+1234567890",
    "date_of_birth":"1995-01-01"
  }'

# Check server logs for email preview URL
```

### 3. Test Payments

```bash
# Create a booking first, then:
curl -X POST http://localhost:3001/api/payments/create-intent \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"booking_id":"your-booking-id","payment_method":"card"}'
```

---

## 📊 New API Endpoints

### Upload Endpoints

```
POST   /api/upload/profile-photo          - Upload profile photo
POST   /api/upload/property-photos        - Upload property photos
POST   /api/upload/verification-document  - Upload ID/student ID
DELETE /api/upload/property-photo/:id     - Delete property photo
```

### Email (Automatic)

Emails are sent automatically on these events:
- User registration
- Email verification request
- Password reset request
- Booking confirmation

### Payments (Already Implemented)

```
POST   /api/payments/create-intent    - Create payment intent
POST   /api/payments/confirm           - Confirm payment
POST   /api/payments/refund            - Refund payment
POST   /api/payments/webhook           - Stripe webhook handler
```

---

## 🔐 Environment Variables Checklist

Make sure you have all of these in your `.env` file:

```bash
# Cloudinary (File Upload)
✓ CLOUDINARY_CLOUD_NAME
✓ CLOUDINARY_API_KEY
✓ CLOUDINARY_API_SECRET

# Email (Choose one)
✓ SMTP_HOST (if using Gmail/SMTP)
✓ SMTP_PORT
✓ SMTP_USER
✓ SMTP_PASS
# OR
✓ SENDGRID_API_KEY (if using SendGrid)

✓ EMAIL_FROM
✓ EMAIL_REPLY_TO
✓ FRONTEND_URL

# Stripe (Payments)
✓ STRIPE_SECRET_KEY
✓ STRIPE_PUBLISHABLE_KEY
✓ STRIPE_WEBHOOK_SECRET
```

---

## 🚀 Quick Start (All Features)

1. **Copy environment template:**
   ```bash
   cp .env.example .env
   ```

2. **Fill in credentials:**
   - Add Cloudinary credentials
   - Add email credentials (Gmail or SendGrid)
   - Add Stripe test keys

3. **Restart server:**
   ```bash
   npm run dev
   ```

4. **Test uploads:**
   - Upload a profile photo
   - Check Cloudinary dashboard

5. **Test emails:**
   - Register a new user
   - Check server logs for preview URL

6. **Test payments:**
   - Create a booking
   - Create payment intent
   - Check Stripe dashboard

---

## 💡 Production Checklist

Before deploying to production:

- [ ] Switch Cloudinary to paid plan (if needed)
- [ ] Use SendGrid instead of Gmail
- [ ] Switch Stripe to **Live Mode**
  - Get live API keys (starts with `pk_live_` and `sk_live_`)
  - Update webhook endpoint to production URL
  - Use live webhook secret
- [ ] Update `FRONTEND_URL` to production domain
- [ ] Enable Stripe webhook signatures
- [ ] Set up proper error monitoring
- [ ] Configure email rate limiting
- [ ] Add file size limits

---

## 🐛 Troubleshooting

### File Upload Not Working?

**Check:**
1. Cloudinary credentials are correct
2. File size is under limit (5MB for images)
3. File type is allowed (JPEG, PNG, GIF, WebP)
4. Server has internet connection

**Common errors:**
- "Invalid signature" → Wrong API secret
- "Resource not found" → Wrong cloud name
- "Upload failed" → File too large or wrong format

### Emails Not Sending?

**Check:**
1. SMTP credentials are correct
2. Gmail app password (not your regular password)
3. `EMAIL_FROM` is set
4. Server logs for error messages

**Common errors:**
- "Invalid login" → Wrong username/password
- "Connection timeout" → Wrong SMTP host/port
- "Email not sent" → Check server logs

### Payments Not Working?

**Check:**
1. Using test API keys (starts with `sk_test_`)
2. Webhook secret is correct
3. Booking exists and is valid
4. User is the booking guest

**Common errors:**
- "Invalid API key" → Wrong secret key
- "Webhook signature invalid" → Wrong webhook secret
- "Booking not found" → Wrong booking ID

---

## 📖 Learn More

- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Nodemailer Docs**: https://nodemailer.com/
- **SendGrid Docs**: https://docs.sendgrid.com/
- **Stripe Docs**: https://stripe.com/docs
- **Multer Docs**: https://github.com/expressjs/multer

---

## ✅ You're All Set!

Your ROOMA backend now has:
- ✅ File upload with Cloudinary
- ✅ Email service with beautiful templates
- ✅ Stripe payment integration
- ✅ All 50+ API endpoints working
- ✅ Production-ready deployment configuration

**Happy coding!** 🎉
