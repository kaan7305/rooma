# 🌐 Domain Verification Guide for Resend

This guide will help you verify your domain with Resend so you can send emails to ANY address (not just your own).

---

## Step 1: Add Domain to Resend

1. Go to: **https://resend.com/domains**
2. Click the **"Add Domain"** button
3. Enter your domain name:
   - If you own `nestquarter.com`, enter: `nestquarter.com`
   - If using a subdomain, enter: `mail.nestquarter.com` (recommended)
4. Click **"Add"**

---

## Step 2: Get DNS Records

After adding the domain, Resend will show you DNS records to add. You'll see something like:

### Record 1: SPF (TXT Record)
```
Type: TXT
Name: @ (or your domain)
Value: v=spf1 include:_spf.resend.com ~all
```

### Record 2: DKIM (TXT Record)
```
Type: TXT
Name: resend._domainkey
Value: [long string provided by Resend]
```

### Record 3: DMARC (TXT Record) - Optional but recommended
```
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; pct=100; rua=mailto:dmarc@nestquarter.com
```

---

## Step 3: Add Records to Your DNS Provider

The steps depend on where your domain is registered:

### If Using Namecheap:
1. Log into Namecheap
2. Go to **Domain List** → Click **Manage** next to your domain
3. Go to **Advanced DNS** tab
4. Click **Add New Record**
5. For each record above:
   - Select the **Type** (TXT)
   - Enter the **Host** (Name)
   - Enter the **Value**
   - Set TTL to **Automatic** or **1 min**
6. Click **Save All Changes**

### If Using GoDaddy:
1. Log into GoDaddy
2. Go to **My Products** → **Domains**
3. Click **DNS** next to your domain
4. Click **Add** under DNS Records
5. Add each TXT record from above
6. Click **Save**

### If Using Cloudflare:
1. Log into Cloudflare
2. Select your domain
3. Go to **DNS** tab
4. Click **Add record**
5. Add each TXT record from above
6. Click **Save**

### If Using Vercel (Free Subdomain):
1. Deploy your Next.js app to Vercel
2. In Vercel dashboard, go to your project
3. Go to **Settings** → **Domains**
4. Add your production domain
5. Go to **DNS** tab
6. Add the TXT records from Resend

---

## Step 4: Verify Domain in Resend

1. Go back to: **https://resend.com/domains**
2. Wait 5-10 minutes for DNS propagation
3. Click **"Verify"** next to your domain
4. If successful, you'll see a green checkmark ✅
5. If not verified yet, wait a bit longer (DNS can take up to 48 hours, but usually 5-30 minutes)

**Tip**: You can check DNS propagation at: https://dnschecker.org

---

## Step 5: Update Your Code

Once the domain is verified, update the email sending code:

### Open: `/app/api/send-verification-email/route.ts`

Find line 258 and change:
```typescript
// FROM THIS:
from: 'NestQuarter <onboarding@resend.dev>',

// TO THIS (use your actual domain):
from: 'NestQuarter <noreply@nestquarter.com>',
```

Or use these common email addresses:
- `noreply@nestquarter.com` (most common)
- `hello@nestquarter.com`
- `support@nestquarter.com`
- `verify@nestquarter.com`

---

## Step 6: Test It!

1. Restart your dev server: `npm run dev`
2. Try registering with ANY email address (not just your own)
3. Check that email inbox - you should receive the verification email!
4. Check Resend dashboard to see the email was sent

---

## 🎉 You're Done!

Now you can send verification emails to ANY student email address!

---

## 🆘 Troubleshooting

### Domain Not Verifying
- Wait 30 minutes for DNS propagation
- Double-check the DNS records match exactly what Resend shows
- Check for typos in the record values
- Use https://dnschecker.org to verify DNS records are live

### Emails Still Not Sending
- Make sure you updated the `from` address in the code
- Check that it uses your verified domain (e.g., `@nestquarter.com`)
- Restart the dev server
- Check Resend dashboard for errors

### "Domain Not Verified" Error
- Domain must show green checkmark in Resend dashboard
- DNS records must be added correctly
- Try clicking "Verify" again in Resend dashboard

---

## 💰 Cost

**Free Forever!**
- Domain verification: FREE
- Resend free tier: 3,000 emails/month
- No credit card required

Only cost is the domain name itself (~$10-15/year if you don't have one)

---

## 📚 Useful Links

- Resend Domains: https://resend.com/domains
- Resend Docs: https://resend.com/docs/dashboard/domains/introduction
- DNS Checker: https://dnschecker.org
- Resend Email Logs: https://resend.com/emails
