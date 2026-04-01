import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Only create client if both URL and Key are provided and not placeholders
let supabase = null;
if (supabaseUrl && supabaseAnonKey && !supabaseAnonKey.includes('YOUR_')) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  console.warn('Supabase credentials not configured. Database features will be disabled.');
}

export { supabase };
