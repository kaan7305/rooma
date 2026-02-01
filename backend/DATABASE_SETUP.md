# Supabase Setup Guide

This backend uses Supabase (PostgreSQL) directly via the Supabase client. No Prisma setup or migrations are required.

## 1) Create a Supabase Project

- Create a project in the Supabase dashboard.
- Copy the **Project URL** and the **Service Role Key**.

## 2) Configure Environment Variables

Update `backend/.env` (or your deployment secrets) with:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
# Optional: override JWT secret for email verification tokens
EMAIL_VERIFICATION_SECRET=your_email_verification_secret
```

## 3) Verify Connection

Run the backend and hit the health/test endpoint:

```bash
cd backend
npm run dev
```

Then:

```
GET /api/test/supabase
```

You should receive a success response if the credentials are correct.

## 4) Types (Optional)

If you want to regenerate TypeScript types from your Supabase schema, use the Supabase CLI in your environment and update:

- `backend/src/types/database.types.ts`

This file is used for typed Supabase queries across services.
