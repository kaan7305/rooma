# 🚀 NestQuarter API Deployment Guide

This guide will help you deploy your NestQuarter API to production using Railway (recommended) or other platforms.

## 📋 Pre-Deployment Checklist

- [x] Git repository initialized
- [x] Code committed to git
- [x] Build scripts configured
- [x] Railway configuration file created
- [x] Database migrations ready
- [ ] Push code to GitHub
- [ ] Deploy to Railway
- [ ] Configure environment variables
- [ ] Run database migrations
- [ ] Test production endpoints

---

## 🚂 Option 1: Deploy to Railway (Recommended)

Railway is the easiest option since you already have your PostgreSQL database there.

### Step 1: Push Code to GitHub

1. **Create a new repository on GitHub:**
   - Go to https://github.com/new
   - Name it: `nestquarter-backend`
   - Make it private
   - Don't initialize with README (we already have one)

2. **Push your code:**
   ```bash
   cd "/Users/kaaneroltu/Desktop/Sublet Project/backend"

   # Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
   git remote add origin https://github.com/YOUR_USERNAME/nestquarter-backend.git

   # Push code
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Railway

1. **Go to Railway:**
   - Visit https://railway.app
   - Log in with GitHub

2. **Create New Project:**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `nestquarter-backend` repository

3. **Railway will automatically:**
   - Detect Node.js project
   - Run `npm run build`
   - Start with `npm run deploy`

### Step 3: Configure Environment Variables

In Railway dashboard, go to **Variables** tab and add:

```bash
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# Optional: override JWT secret for email verification tokens
EMAIL_VERIFICATION_SECRET=your_email_verification_secret

# Server
NODE_ENV=production
PORT=3000

# JWT Secrets (Generate strong random strings)
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-min-32-chars

# JWT Expiration
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS (Your frontend URL)
CORS_ORIGIN=https://your-frontend-domain.com

# Stripe (Get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Email Service (if using)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Optional: SMS Service (if using Twilio)
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 4: Connect Database

This backend uses Supabase directly. Set these environment variables in your host:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- (Optional) `EMAIL_VERIFICATION_SECRET`

### Step 5: Deploy!

1. **Railway will auto-deploy** when you push to GitHub
2. **Check deployment logs** in Railway dashboard
3. **Get your URL**: Railway provides a URL like `nestquarter-api.railway.app`

### Step 6: Verify Supabase Credentials

No Prisma migrations are required. Ensure your Supabase project is provisioned and the
environment variables above are set before starting the server.

### Step 7: Test Production API

```bash
# Health check
curl https://your-app.railway.app/health

# Welcome endpoint
curl https://your-app.railway.app/

# Test login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@nestquarter.com","password":"Password123!"}'
```

---

## 🌐 Option 2: Deploy to Render

### Step 1: Push to GitHub (same as Railway)

### Step 2: Create Render Account
- Visit https://render.com
- Sign up with GitHub

### Step 3: Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `nestquarter-api`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run deploy`
   - **Instance Type**: Free or Starter

### Step 4: Add Environment Variables
Same as Railway (see above)

### Step 5: Configure Supabase
1. Create a Supabase project
2. Copy `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
3. Add them to your web service environment variables

---

## 🐳 Option 3: Deploy to Heroku

### Step 1: Install Heroku CLI
```bash
brew install heroku/brew/heroku
heroku login
```

### Step 2: Create Heroku App
```bash
cd "/Users/kaaneroltu/Desktop/Sublet Project/backend"

heroku create nestquarter-api
heroku addons:create heroku-postgresql:essential-0
```

### Step 3: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret-key
heroku config:set JWT_REFRESH_SECRET=your-refresh-secret
heroku config:set CORS_ORIGIN=https://your-frontend.com
# ... add other variables
```

### Step 4: Deploy
```bash
git push heroku main
heroku run npm run start
```

### Step 5: Open App
```bash
heroku open
heroku logs --tail
```

---

## 🔐 Security Checklist for Production

- [ ] Use strong JWT secrets (32+ random characters)
- [ ] Enable HTTPS only (handled by Railway/Render/Heroku)
- [ ] Set proper CORS_ORIGIN (not `*`)
- [ ] Use production Stripe keys
- [ ] Enable rate limiting (already configured)
- [ ] Review error messages (don't expose sensitive info)
- [ ] Set up monitoring/logging
- [ ] Enable database backups
- [ ] Use environment variables for ALL secrets

---

## 🔄 Continuous Deployment

### Automatic Deployment on Git Push

Railway and Render automatically deploy when you push to `main` branch:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Railway/Render auto-deploys!
```

### Manual Deployment

Railway:
- Click "Deploy" in dashboard

Render:
- Go to "Manual Deploy" → "Deploy latest commit"

Heroku:
```bash
git push heroku main
```

---

## 📊 Post-Deployment

### 1. Seed Production Data (Optional)

Use the Supabase SQL editor or scripts against your Supabase project if you need
starter data. No Prisma seed is required.

### 2. Monitor Your API

- **Health Check**: `https://your-api.com/health`
- **Logs**: Check Railway/Render/Heroku dashboard
- **Database**: Use the Supabase dashboard (SQL editor, table editor)

### 3. Set Up Custom Domain (Optional)

Railway:
- Settings → Domains → Add custom domain

Render:
- Settings → Custom Domain → Add

### 4. Update Frontend

Update your frontend `.env` to point to production API:
```bash
NEXT_PUBLIC_API_URL=https://your-api.railway.app
# or
REACT_APP_API_URL=https://your-api.railway.app
```

---

## 🐛 Troubleshooting

### Build Fails

**Check logs** for specific error:
- Missing dependencies? `npm install` the package
- TypeScript errors? Fix in code and push again
- Supabase errors? Verify credentials and project status

### Database Connection Fails

1. Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
2. Ensure the Supabase project is active
3. Verify service role key permissions

### App Crashes on Start

1. Check environment variables are set
2. Review startup logs
3. Ensure Supabase credentials are available at startup
4. Check Node.js version compatibility

### Cannot Access API

1. Check deployment status (is it running?)
2. Verify URL is correct
3. Check health endpoint: `/health`
4. Review CORS settings

---

## 📝 Next Steps

After successful deployment:

1. ✅ Test all endpoints with production URL
2. ✅ Update Postman collection with production URL
3. ✅ Connect frontend to production API
4. ✅ Set up monitoring (Railway/Render have built-in metrics)
5. ✅ Enable database backups
6. ✅ Set up error tracking (Sentry, Rollbar)
7. ✅ Configure logging service
8. ✅ Add rate limiting per endpoint (if needed)

---

## 🎉 Success!

Your NestQuarter API is now live! 🚀

**Production URL**: `https://your-app.railway.app`

Need help? Check:
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Heroku Docs](https://devcenter.heroku.com)
