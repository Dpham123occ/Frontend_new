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

// Get the JWT
export async function getUserJWT() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error("Error fetching session:", error);
    return null;
  }
  return data.session.access_token;
}


