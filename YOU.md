# YOU.md - What You Need to Set Up

> Everything the developer needs to provide, configure, or sign up for externally.
> The codebase is ready — these are the missing pieces that require **your** accounts, keys, and decisions.

---

## 1. Supabase (Database & Auth Backend)

**Status:** Required — the app won't function without it.

### What to do:

1. Go to [supabase.com](https://supabase.com) and create a project
2. Once created, go to **Settings > API** and copy:
   - **Project URL** → `SUPABASE_URL`
   - **Service Role Key** (under "Project API keys") → `SUPABASE_SERVICE_ROLE_KEY`
3. Go to **Settings > Database** and copy the connection string → `DATABASE_URL`

### Where to put them:

DONE — Already configured in `backend/.env`. Do not commit credentials to this file.

### Database migration:

After setting the DATABASE_URL, run from the `backend/` directory:

```bash
npx prisma db push
```

This creates all tables defined in the Prisma schema. Verify in the Supabase Dashboard under **Table Editor** that tables like `User`, `Property`, `Booking`, `Review`, `Conversation`, `Message`, etc. exist.

### Important notes:

- Use the **service role key**, not the anon key — the backend needs full DB access
- The anon key is only needed if you add Supabase Auth on the frontend (currently not used — app uses custom JWT auth)
- For production, enable **Row Level Security (RLS)** on tables and add appropriate policies

---

## 2. Stripe (Payments)

**Status:** Required for payments, bookings with payment, and host payouts. App runs without it but payment features will fail.

### What to do:

1. Sign up at [dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Get **test mode** keys from [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys):
   - **Publishable key** (starts with `pk_test_`) → `STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (starts with `sk_test_`) → `STRIPE_SECRET_KEY`

3. Set up a **webhook endpoint** for local testing:
   ```bash
   # Install Stripe CLI: https://stripe.com/docs/stripe-cli
   brew install stripe/stripe-cli/stripe

   # Login
   stripe login

   # Forward events to your local backend
   stripe listen --forward-to localhost:5001/api/payments/webhook
   ```
   The CLI will print a webhook signing secret (starts with `whsec_`) → `STRIPE_WEBHOOK_SECRET`

4. **(Optional)** For host payouts via Stripe Connect:
   - Go to [dashboard.stripe.com/settings/connect](https://dashboard.stripe.com/settings/connect)
   - Enable Stripe Connect
   - Copy the **Connect Client ID** (starts with `ca_`) → `STRIPE_CONNECT_CLIENT_ID`

### Where to put them:

```env
# backend/.env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_CLIENT_ID=ca_...   # only if using Connect for host payouts
```

### Test cards:

- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Requires authentication: `4000 0025 0000 3155`

---

## 3. Cloudinary (Image/File Uploads)

**Status:** Required for property photos, profile photos, and verification document uploads. Without it, upload endpoints will silently fail.

### What to do:

1. Sign up at [cloudinary.com/users/register_free](https://cloudinary.com/users/register_free) (free tier: 25GB storage, 25GB bandwidth/month)
2. After signup, go to your **Dashboard** and copy:
   - **Cloud Name** → `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

### Where to put them:

```env
# backend/.env
CLOUDINARY_CLOUD_NAME=dxxxxxxxxx
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijk...
```

### Recommended setup:

- Create upload presets for different use cases (property photos, profile photos, documents) in the Cloudinary dashboard under **Settings > Upload > Upload presets**
- Set max file size limit (the backend defaults to 10MB via `MAX_FILE_SIZE_MB`)

---

## 4. Email Service (Transactional Emails)

**Status:** Required for password reset, booking confirmations, and notification emails. App runs without it but emails won't be delivered (logs a warning and uses Ethereal test mode).

### Option A: Gmail SMTP (Easiest for Development)

1. Use a Gmail account
2. Enable 2-Factor Authentication on the Google account
3. Generate an App Password at [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
4. Use the 16-character password:

```env
# backend/.env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
EMAIL_FROM=your-email@gmail.com
```

### Option B: Resend (Already Partially Set Up on Frontend)

The frontend already has a Resend API key in `frontend/.env.local` for email verification. If you want to use Resend for the backend too:

1. Go to [resend.com](https://resend.com) (3,000 emails/month free)
2. Verify your domain at [resend.com/domains](https://resend.com/domains)
3. You'd need to swap the backend's nodemailer transport to use Resend's SMTP or API

```env
# If using Resend SMTP with nodemailer:
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=resend
SMTP_PASS=re_your_api_key_here
```

### Option C: SendGrid (Production Recommended)

1. Sign up at [signup.sendgrid.com](https://signup.sendgrid.com)
2. Create an API key in **Settings > API Keys**
3. The backend auto-detects SendGrid in production mode:

```env
# backend/.env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxx
```

---

## 5. Redis (Caching Layer)

**Status:** Optional — the app degrades gracefully without it. Caching simply won't work and every request hits the database directly.

### Option A: Local Redis (Development)

```bash
# macOS
brew install redis
brew services start redis

# Verify
redis-cli ping   # Should return "PONG"
```

No env changes needed — the defaults (`localhost:6379`, no password) work.

### Option B: Cloud Redis (Production)

Providers:
- **Upstash** ([upstash.com](https://upstash.com)) — Free tier, serverless, recommended
- **Redis Cloud** ([redis.com/try-free](https://redis.com/try-free/)) — 30MB free
- **Railway** — Add Redis plugin to your Railway project

```env
# backend/.env
REDIS_HOST=your-redis-host.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
```

---

## 6. Twilio (SMS Verification)

**Status:** Optional — phone verification currently works in dev mode by logging codes to the console. Only needed when you want real SMS delivery.

### What to do:

1. Sign up at [twilio.com/try-twilio](https://www.twilio.com/try-twilio) (free trial includes $15 credit)
2. Get a phone number from the Twilio console
3. Copy your credentials from the console dashboard:

```env
# backend/.env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

### Code change needed:

In `backend/src/services/user.service.ts`, the `requestPhoneCode` function currently has:
```typescript
console.log(`[DEV] Phone verification code for user ${userId}: ${code}`);
```
Replace with a Twilio SMS call:
```typescript
import twilio from 'twilio';
const client = twilio(config.twilio.accountSid, config.twilio.authToken);
await client.messages.create({
  body: `Your ROOMA verification code is: ${code}`,
  from: config.twilio.phoneNumber,
  to: user.phone,
});
```

---

## 7. SheerID (Student Verification)

**Status:** Optional — the button currently shows "not yet available". Only needed if you want automated student status verification.

### What to do:

1. Apply for a SheerID account at [sheerid.com](https://www.sheerid.com/)
2. Create a verification program for student discounts
3. Get your Program ID and access token

```env
# frontend/.env.local
SHEERID_PROGRAM_ID=your_program_id
SHEERID_ACCESS_TOKEN=your_access_token
SHEERID_BASE_URL=https://services.sheerid.com/rest/v2
```

### Code change needed:

In `frontend/app/student-verification/page.tsx`, replace the "not yet available" handler with the actual SheerID API integration using their JavaScript SDK or REST API.

---

## 8. JWT Secrets (Security)

**Status:** Required for production. Dev defaults are set but MUST be changed before deploying.

### What to do:

Generate two secure random strings (64+ characters each):

```bash
# Generate secrets
openssl rand -hex 64
openssl rand -hex 64
```

```env
# backend/.env
JWT_SECRET=<first generated string>
JWT_REFRESH_SECRET=<second generated string>
```

The production template at `backend/.env.production.template` already has pre-generated secrets — verify they haven't been committed to a public repo. If they have, regenerate them.

---

## 9. Domain & Deployment

**Status:** Required for going live. Not needed for local development.

### Frontend (Next.js)

Recommended: **Vercel**
1. Push your repo to GitHub
2. Go to [vercel.com](https://vercel.com), import the repo
3. Set root directory to `frontend`
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com/api
   BACKEND_API_URL=https://your-backend-domain.com/api
   RESEND_API_KEY=re_...
   ```
5. Connect your custom domain in Vercel settings

### Backend (Express.js)

Recommended: **Railway**
1. Go to [railway.app](https://railway.app), create a new project
2. Add a **PostgreSQL** plugin (or use your Supabase DB URL)
3. Deploy from GitHub, set root directory to `backend`
4. Add all environment variables from `backend/.env.production.template`
5. Update `CORS_ORIGIN` to your Vercel frontend URL

### DNS / Custom Domain

1. Buy a domain (Namecheap, Google Domains, Cloudflare)
2. Point frontend domain → Vercel
3. Point `api.yourdomain.com` → Railway (or wherever backend is hosted)
4. Update `CORS_ORIGIN` and `FRONTEND_URL` to match

---

## 10. Cloudflare Turnstile (Bot Protection)

**Status:** Optional — test keys are currently used in development. Needed for production to prevent bot signups.

### What to do:

1. Sign up at [dash.cloudflare.com](https://dash.cloudflare.com)
2. Go to **Turnstile** and add a site
3. Copy the **Site Key** and **Secret Key**

```env
# frontend/.env.local
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA...
```

---

## 11. Google OAuth (Optional)

**Status:** Optional — for "Sign in with Google" functionality.

### What to do:

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project, enable the Google+ API
3. Go to **Credentials > Create OAuth 2.0 Client ID**
4. Set authorized redirect URI to `http://localhost:5001/api/auth/google/callback` (dev) and your production URL

```env
# backend/.env
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-...
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
```

---

## 12. Error Tracking (Optional)

**Status:** Optional — recommended for production to catch errors.

### Sentry

1. Sign up at [sentry.io](https://sentry.io) (free tier: 5K events/month)
2. Create a Node.js project and a Next.js project
3. Copy the DSN values

```env
# backend/.env
SENTRY_DSN=https://xxxxx@o00000.ingest.sentry.io/00000
```

---

## Quick Reference: All Environment Variables

### backend/.env — Required

| Variable | Where to Get | Needed For |
|----------|-------------|------------|
| `DATABASE_URL` | Supabase Dashboard > Settings > Database | Everything |
| `SUPABASE_URL` | Supabase Dashboard > Settings > API | Database queries |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Dashboard > Settings > API | Database queries |
| `JWT_SECRET` | Generate with `openssl rand -hex 64` | Authentication |
| `JWT_REFRESH_SECRET` | Generate with `openssl rand -hex 64` | Token refresh |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Dashboard | File uploads |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard | File uploads |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard | File uploads |
| `STRIPE_SECRET_KEY` | Stripe Dashboard > API keys | Payments |
| `STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard > API keys | Payments |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI or Dashboard > Webhooks | Payment webhooks |

### backend/.env — Optional

| Variable | Where to Get | Needed For |
|----------|-------------|------------|
| `SMTP_HOST/USER/PASS` | Gmail App Password or email provider | Sending emails |
| `SENDGRID_API_KEY` | SendGrid Dashboard | Production emails |
| `TWILIO_ACCOUNT_SID` | Twilio Console | SMS verification |
| `TWILIO_AUTH_TOKEN` | Twilio Console | SMS verification |
| `TWILIO_PHONE_NUMBER` | Twilio Console | SMS verification |
| `REDIS_HOST/PORT/PASSWORD` | Local install or cloud provider | Caching |
| `STRIPE_CONNECT_CLIENT_ID` | Stripe Connect settings | Host payouts |
| `GOOGLE_CLIENT_ID/SECRET` | Google Cloud Console | OAuth login |
| `SENTRY_DSN` | Sentry Dashboard | Error tracking |

### frontend/.env.local — Required

| Variable | Where to Get | Needed For |
|----------|-------------|------------|
| `NEXT_PUBLIC_API_BASE_URL` | Your backend URL | API calls |
| `BACKEND_API_URL` | Your backend URL | Server-side API calls |
| `RESEND_API_KEY` | Resend Dashboard | Email verification |

### frontend/.env.local — Optional

| Variable | Where to Get | Needed For |
|----------|-------------|------------|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Dashboard | Bot protection |
| `SHEERID_PROGRAM_ID` | SheerID account | Student verification |

---

## Recommended Order of Setup

1. **Supabase** — nothing works without the database
2. **Run `npx prisma db push`** — creates all tables
3. **Cloudinary** — needed for any image upload flow
4. **Email (Gmail SMTP)** — needed for password reset, verification
5. **Stripe (test keys)** — needed for booking/payment flows
6. **JWT secrets** — regenerate before any public deployment
7. **Redis** — install locally for caching (optional, app works without it)
8. Everything else — set up as you need it
