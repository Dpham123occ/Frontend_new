import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true, // Persist session to avoid frequent token refreshes
      autoRefreshToken: true, // Automatically refresh tokens
      detectSessionInUrl: true, // Detect session in URL for OAuth redirects
      storage: localStorage, // Use localStorage for session persistence
    },
});
