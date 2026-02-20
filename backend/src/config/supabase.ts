import { createClient, SupabaseClient } from '@supabase/supabase-js';
import config from './env';

const supabaseUrl = config.supabase.url;
const supabaseServiceKey = config.supabase.serviceRoleKey;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Role Key must be set in environment variables');
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
