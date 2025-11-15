import { createClient } from '@supabase/supabase-js';
import { Database } from './types';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Check if Supabase is configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey &&
    supabaseUrl !== 'your-supabase-url-here' &&
    supabaseAnonKey !== 'your-supabase-anon-key-here');
};

// Create Supabase client (will be null if not configured)
export const supabase = isSupabaseConfigured()
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false,
      },
    })
  : null;

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): string {
  if (error?.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
}

// Log Supabase configuration status
if (typeof window !== 'undefined') {
  if (isSupabaseConfigured()) {
    console.log('✅ Supabase is configured and connected');
  } else {
    console.warn('⚠️ Supabase is not configured. Using mock data. See .env.local.example for setup instructions.');
  }
}
