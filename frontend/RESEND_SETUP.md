# 📧 FREE Email Setup (30 Seconds!)

## ✨ Why Resend?

We switched from Gmail SMTP to **Resend** because:

| Feature | Resend | Gmail SMTP |
|---------|--------|------------|
| Setup Time | **30 seconds** | 5 minutes |
| Free Tier | **3,000 emails/month** | 500/day |
| Works with Next.js | **Perfect!** | Buggy with Turbopack |
| Configuration | **1 API key** | 2FA + App password |
| Complexity | **Super simple** | Multiple steps |

---

## 🚀 Setup (30 Seconds)

### Step 1: Sign Up (10 seconds)
Go to: **https://resend.com/signup**

- Click "Sign up with GitHub" or use email
- Verify your email

### Step 2: Get API Key (10 seconds)
1. Go to: **https://resend.com/api-keys**
2. Click **"Create API Key"**
3. Name it: `NestQuarter`
4. **Copy the key** (starts with `re_`)

### Step 3: Add to .env.local (10 seconds)
Open `.env.local` and replace:

```bash
RESEND_API_KEY=re_your_actual_key_here
```

### Step 4: Restart Server
```bash
npm run dev
```

### Step 5: Test!
- Register with your email
- **Check your inbox!** 📬
- Beautiful email arrives instantly

**That's it! 🎉**

---

## 📊 Free Tier

**Completely FREE:**
- ✅ 3,000 emails/month
- ✅ 100 emails/day
- ✅ Beautiful email templates
- ✅ Email logs & analytics
- ✅ No credit card required

Perfect for:
- Testing & development
- Small to medium apps
- Startups & side projects

---

## 🎨 What Users Receive

A professional email with:
- NestQuarter branding
- Large verification code
- 10-minute expiry timer
- Security warnings
- Mobile-responsive design

---

## 🔧 Current Status

**Right now (without setup):**
- Development mode active
- Codes show in alerts
- Perfect for testing

**After setup (with API key - FREE TIER):**
- ⚠️ **IMPORTANT**: Free tier can ONLY send to your Resend account email
- You can only test with the email you used to sign up for Resend
- To send to ANY email: Verify a domain (see below)

**After domain verification (PRODUCTION):**
- Send to any email address
- No restrictions
- Production-ready

---

## 📱 Test Email

Want to see what the email looks like?

1. Set up Resend (30 seconds)
2. Register with your email
3. Check inbox for gorgeous email!

---

## 💡 Pro Tips

**For Testing (Free Tier):**
- Register with your Resend account email (`kaaneroltu73@gmail.com`)
- Or leave API key empty for dev mode (codes in alerts)
- Zero cost, instant testing

**For Production:**
- **Verify a custom domain** (see below)
- Update the `from` email in the API route
- Monitor emails in Resend dashboard

---

## 🌐 Domain Verification (Remove Restrictions)

To send emails to ANY address (not just your own):

### Option 1: Use a Custom Domain (Recommended)
1. Go to: https://resend.com/domains
2. Click "Add Domain"
3. Enter your domain (e.g., `nestquarter.com`)
4. Add the DNS records shown (SPF, DKIM, DMARC)
5. Wait for verification (usually 5-10 minutes)
6. Update `/app/api/send-verification-email/route.ts`:
   ```typescript
   from: 'NestQuarter <noreply@nestquarter.com>'
   ```

### Option 2: Keep Testing Mode
- Leave API key empty in `.env.local`
- Codes will show in browser alerts
- Perfect for development!

---

## 🆘 Troubleshooting

### "Can't send to other emails" / "Validation error"
- **FREE TIER RESTRICTION**: You can only send to your Resend account email
- Test with `kaaneroltu73@gmail.com` (your Resend email)
- OR verify a domain at https://resend.com/domains
- OR use dev mode (remove API key, codes show in alerts)

### "Still showing in alert"
- Check `.env.local` has real API key
- Restart server with `npm run dev`
- API key should start with `re_`

### "Email not received"
- Check spam folder
- Make sure you're sending to your Resend account email (free tier)
- Check Resend dashboard logs at https://resend.com/emails

### "Invalid API key"
- Generate new key at resend.com/api-keys
- Copy entire key (starts with `re_`)
- No spaces or quotes needed

---

## 🔐 Security

- API key is server-side only (not exposed)
- Stored in `.env.local` (not committed to git)
- Can revoke/rotate keys anytime

---

## 📈 Upgrade Later

Need more emails?

**Paid Plans:**
- $20/month: 50,000 emails
- $80/month: 500,000 emails
- Enterprise: Unlimited

But the free tier (3,000/month) is usually plenty!

---

## 🎯 Quick Links

- Dashboard: https://resend.com/home
- API Keys: https://resend.com/api-keys
- Docs: https://resend.com/docs
- Email Logs: https://resend.com/emails

---

**Ready in 30 seconds! Give it a try! 🚀**
