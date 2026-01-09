import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import config from './env';

// Supabase Client singleton
declare global {
  // eslint-disable-next-line no-var
  var supabase: ReturnType<typeof createClient<Database>> | undefined;
}

const supabaseUrl = config.supabase.url;
const supabaseServiceKey = config.supabase.serviceRoleKey;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Supabase URL and Service Role Key must be set in environment variables');
}

const supabase =
  global.supabase ||
  createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

if (process.env.NODE_ENV !== 'production') {
  global.supabase = supabase;
}

export default supabase;

