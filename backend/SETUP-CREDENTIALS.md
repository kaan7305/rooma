# 🔑 Quick Setup Guide - External Services

**Your `.env` file is ready!** You just need to add your credentials.

---

## ⚠️ **REMINDER: Update your `.env` file with credentials!**

Open: `/Users/kaaneroltu/Desktop/Sublet Project/backend/.env`

You need to replace the placeholder values for these three services:

---

## 🔷 **1. Cloudinary Setup** (5 minutes)

### Steps:
1. **Sign up:** https://cloudinary.com/users/register_free
2. **After signup**, you'll see your Dashboard
3. **Copy these 3 values:**
   - Cloud Name (e.g., `dxxxxxxxxxxxx`)
   - API Key (e.g., `123456789012345`)
   - API Secret (click "Reveal" button to see it)

### Update in `.env`:
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name_here    # ← Replace this
CLOUDINARY_API_KEY=your_api_key_here          # ← Replace this
CLOUDINARY_API_SECRET=your_api_secret_here    # ← Replace this
```

---

## 📧 **2. Email Service Setup** (10 minutes)

### Choose ONE option:

### **OPTION A: Gmail (Easiest for Development)**

1. **Enable 2-Factor Authentication** on your Google Account
   - Go to: https://myaccount.google.com/security
   - Turn on "2-Step Verification"

2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Name it "NestQuarter Backend"
   - Google will give you a 16-character password

3. **Update in `.env`:**
```bash
SMTP_USER=your-email@gmail.com              # ← Your Gmail address
SMTP_PASS=abcd efgh ijkl mnop               # ← The 16-char app password
```

### **OPTION B: SendGrid (Better for Production)**

1. **Sign up:** https://signup.sendgrid.com/
2. **Create API Key:**
   - Go to Settings > API Keys
   - Click "Create API Key"
   - Choose "Full Access"
   - Copy the key (starts with `SG.`)

3. **Update in `.env`:**
```bash
# Comment out Gmail settings and use SendGrid instead:
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-16-char-app-password

SENDGRID_API_KEY=SG.your_actual_api_key_here  # ← Uncomment and add key
```

---

## 💳 **3. Stripe Setup** (10 minutes)

### Steps:
1. **Sign up:** https://dashboard.stripe.com/register
2. **After signup**, you'll be in Test Mode (perfect for development)
3. **Get your API keys:**
   - Go to: https://dashboard.stripe.com/test/apikeys
   - You'll see:
     - **Publishable key** (starts with `pk_test_`)
     - **Secret key** (starts with `sk_test_` - click "Reveal")

4. **Get Webhook Secret** (for payment confirmations):
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
   - Endpoint URL: `http://localhost:3001/api/payments/webhook`
   - Select event: `payment_intent.succeeded`
   - Click "Add endpoint"
   - Copy the "Signing secret" (starts with `whsec_`)

5. **Connect (optional for now):**
   - Go to: https://dashboard.stripe.com/settings/connect
   - Copy "Client ID" (starts with `ca_`)

### Update in `.env`:
```bash
STRIPE_SECRET_KEY=sk_test_your_actual_key       # ← Replace this
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key  # ← Replace this
STRIPE_WEBHOOK_SECRET=whsec_your_actual_secret  # ← Replace this
STRIPE_CONNECT_CLIENT_ID=ca_your_client_id      # ← Replace this (optional)
```

---

## ✅ **After Adding All Credentials**

### 1. Restart your server:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### 2. Test the features:
```bash
# Run the test script
bash /tmp/test-new-features.sh
```

---

## 🔍 **How to Verify Setup**

### Check Cloudinary:
- Upload a profile photo via API
- Check your Cloudinary Dashboard to see the uploaded image

### Check Email:
- Register a new user
- You should receive a welcome email

### Check Stripe:
- Create a test booking payment
- Check Stripe Dashboard > Payments to see the transaction

---

## 📍 **File Locations**

- **Environment file:** `/Users/kaaneroltu/Desktop/Sublet Project/backend/.env`
- **Setup guide:** `/Users/kaaneroltu/Desktop/Sublet Project/backend/FEATURES-SETUP.md` (detailed version)
- **This guide:** `/Users/kaaneroltu/Desktop/Sublet Project/backend/SETUP-CREDENTIALS.md`

---

## 💰 **Costs**

All three services are **FREE** for development:
- **Cloudinary:** 25GB storage, 25GB bandwidth/month
- **Gmail:** Limited sends (enough for development)
- **SendGrid:** 100 emails/day free forever
- **Stripe:** Unlimited in test mode

---

## 🆘 **Need Help?**

Check the detailed guide: `FEATURES-SETUP.md`

Or test without credentials (features will be disabled but API will still work for other endpoints).

---

**Last Updated:** 2025-11-18
