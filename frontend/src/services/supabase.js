import { createClient } from '@supabase/supabase-js'

// IMPORTANT:
// Supabase holds your app's "data" (menus, images). If these env vars differ between
// local/dev/prod, you will see different data even when GitHub code is identical.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in frontend/.env (local) and your deployment environment.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)


