import { createClient, SupabaseClient } from '@supabase/supabase-js';
import config from './env';
import type { Database } from '../types/database.types';

const supabaseUrl = config.supabase.url;
const supabaseServiceKey = config.supabase.serviceRoleKey;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Role Key must be set in environment variables');
}

const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default supabase;

