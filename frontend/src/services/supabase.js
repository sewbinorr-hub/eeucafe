import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dugrwatnnmjzeujifckb.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1Z3J3YXRubm1qemV1amlmY2tiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxMjA1NTAsImV4cCI6MjA4MTY5NjU1MH0.gDrILTFwqnbZjpKHsYHriXe7pKv7Z9Lb7cFMjp_X00Q'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

