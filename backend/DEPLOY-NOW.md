# 🚀 Deploy NestQuarter API - Step by Step

Follow these steps **exactly** to deploy your backend to production.

---

## ✅ Step 1: Create GitHub Repository

1. **Open your browser** and go to: https://github.com/new

2. **Fill in the form:**
   - Repository name: `nestquarter-backend`
   - Description: `NestQuarter API - Student housing platform backend`
   - **Make it PRIVATE** ✓
   - **DO NOT** check "Add README" (we already have one)

3. **Click "Create repository"**

4. **Keep this page open** - you'll need the commands in Step 2

---

## ✅ Step 2: Push Your Code to GitHub

**Important:** You need your GitHub username for this step.

### Find Your GitHub Username:
- Look at the top-right corner of GitHub
- Or check the URL: `https://github.com/YOUR_USERNAME`

### Run These Commands:

Open Terminal and run:

```bash
cd "/Users/kaaneroltu/Desktop/Sublet Project/backend"

# Replace YOUR_USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR_USERNAME/nestquarter-backend.git

# Push your code
git push -u origin main
```

**Enter your GitHub credentials when prompted.**

### Verify Upload:
- Refresh your GitHub repository page
- You should see all your code uploaded! ✓

---

## ✅ Step 3: Deploy to Railway

### 3.1 Go to Railway

1. Open: https://railway.app
2. **Sign in** (use your GitHub account for easy connection)

### 3.2 Create New Project

1. Click the **"New Project"** button (top right)
2. Select **"Deploy from GitHub repo"**
3. If asked to authorize Railway → Click **"Authorize"**

### 3.3 Select Your Repository

1. Find and click: **nestquarter-backend**
2. Railway will start deploying automatically! 🎉

### 3.4 Monitor Deployment

You'll see:
- ✓ Building...
- ✓ Deploying...
- ✓ Running!

**Wait for deployment to complete** (2-3 minutes)

---

## ✅ Step 4: Set Environment Variables

### 4.1 Open Variables Tab

In your Railway project:
1. Click on your deployed service
2. Click the **"Variables"** tab

### 4.2 Add Variables

**IMPORTANT:** Copy these **exactly** from `.env.production.template` file:

Click **"Add Variable"** for each:

#### Required Variables:

```
SUPABASE_URL
Value: https://your-project.supabase.co
```

```
SUPABASE_SERVICE_ROLE_KEY
Value: your_supabase_service_role_key
```

```
EMAIL_VERIFICATION_SECRET
Value: your_email_verification_secret (optional)
```

```
NODE_ENV
Value: production
```

```
PORT
Value: 3000
```

```
JWT_SECRET
Value: 0482b6546a0308b210a0c6684ebd644bcec9c096180620354ac412aed7d918c8f58ad5a55b056a8e1ef8c37b03a16cad79021c599b749fbc96b188c8890122c5
```

```
JWT_REFRESH_SECRET
Value: b38dd71eb2f943c188939f5887e89ef7a1919348bcada4b61828b4e049268ea55b6f73c41aa4816c5f2ded0d043f38fa956a068b18a30724caf82b785db34477
```

```
JWT_EXPIRES_IN
Value: 15m
```

```
JWT_REFRESH_EXPIRES_IN
Value: 7d
```

```
CORS_ORIGIN
Value: *
(Change this to your frontend URL later)
```

#### Optional Variables (add later if needed):

```
STRIPE_SECRET_KEY
Value: sk_test_your_key_here
```

### 4.3 Save and Redeploy

After adding all variables:
1. Railway will **automatically redeploy**
2. Wait for it to finish (1-2 minutes)

---

## ✅ Step 5: Configure Supabase

1. Create a Supabase project
2. Copy `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
3. Add them to your Railway variables

---

## ✅ Step 6: Get Your API URL

1. In Railway, click on your service
2. Go to **"Settings"** tab
3. Scroll to **"Domains"**
4. You'll see a URL like:
   ```
   https://nestquarter-backend-production.up.railway.app
   ```
5. **Copy this URL** - this is your production API!

### Generate Public Domain (Recommended):

1. Click **"Generate Domain"**
2. Railway creates a public URL
3. Copy it - use this for your frontend

---

## ✅ Step 7: Test Your API!

Replace `YOUR_APP_URL` with your Railway URL:

### Test 1: Health Check

Open browser or run:
```bash
curl https://YOUR_APP_URL/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-18T...",
  "environment": "production"
}
```

### Test 2: Welcome Page

```bash
curl https://YOUR_APP_URL/
```

**Expected Response:**
```json
{
  "message": "Welcome to NestQuarter API",
  "version": "1.0.0",
  ...
}
```

### Test 3: Login Endpoint

```bash
curl -X POST https://YOUR_APP_URL/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@nestquarter.com","password":"Password123!"}'
```

**Expected Response:**
```json
{
  "message": "Login successful",
  "data": {
    "user": {...},
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

---

## 🎉 SUCCESS!

If all tests pass, your API is **LIVE** in production!

### Your Production URLs:

- **API Base**: `https://YOUR_APP_URL`
- **Health Check**: `https://YOUR_APP_URL/health`
- **API Endpoints**: `https://YOUR_APP_URL/api/*`

---

## 📋 Next Steps

### 1. Seed Production Data (Optional)

If you want test data in production, use the Supabase SQL editor or your own scripts
against the Supabase project. No Prisma seed is required.

### 2. Update Postman Collection

1. Open `NestQuarter-API.postman_collection.json` in Postman
2. Update `baseUrl` variable to your production URL
3. Test all endpoints!

### 3. Set Up Custom Domain (Optional)

In Railway:
1. Settings → Custom Domain
2. Add your domain (e.g., `api.nestquarter.com`)
3. Update DNS records as instructed

### 4. Monitor Your API

- **Logs**: Railway Dashboard → Deploy Logs
- **Metrics**: Railway Dashboard → Metrics tab
- **Database**: Use the Supabase dashboard (SQL editor, table editor)

### 5. Update CORS_ORIGIN

When you deploy your frontend:
1. Go to Railway Variables
2. Update `CORS_ORIGIN` to your frontend URL
3. Example: `https://nestquarter.com`

---

## 🐛 Troubleshooting

### Deployment Failed?

**Check Build Logs:**
1. Railway Dashboard → Deploy Logs
2. Look for error messages
3. Common issues:
   - Missing environment variable
   - TypeScript compilation error
   - Invalid Supabase credentials

### Database Connection Failed?

1. Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
2. Confirm the Supabase project is running
3. Check your API logs for auth/permission errors

### API Returns 500 Errors?

1. Check Deploy Logs for errors
2. Verify all environment variables are set
3. Verify Supabase credentials and schema

### Cannot Access API?

1. Verify deployment status is "Running"
2. Check domain is generated
3. Try health endpoint first: `/health`

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Or ask me! 😊

---

## ✅ Deployment Checklist

- [ ] Created GitHub repository
- [ ] Pushed code to GitHub
- [ ] Created Railway project
- [ ] Deployed from GitHub
- [ ] Added all environment variables
- [ ] Linked PostgreSQL database
- [ ] Generated public domain
- [ ] Tested health endpoint
- [ ] Tested API endpoints
- [ ] Updated Postman collection
- [ ] (Optional) Seeded database
- [ ] (Optional) Set up custom domain

---

**You're all set!** 🚀

Your NestQuarter API is now running in production!
