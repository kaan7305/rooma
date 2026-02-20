import { createClient, SupabaseClient } from '@supabase/supabase-js';
import config from './env';

const supabaseUrl = config.supabase.url || 'http://127.0.0.1:54321';
const supabaseServiceKey = config.supabase.serviceRoleKey || 'local-dev-placeholder-key';

if (!config.supabase.url || !config.supabase.serviceRoleKey) {
  // Allow local development without hard-blocking app startup.
  // Endpoints that rely on Supabase will still require valid credentials.
  console.warn('[Supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set; using local placeholders.');
}

// NOTE:
// The checked-in generated Database types are incomplete/stale and currently cause
// table inference to collapse to `never` in services (e.g. booking.service.ts),
// which prevents the backend from compiling in dev mode.
// Use an untyped client until types are regenerated from the live schema.
const supabase: SupabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabase;
