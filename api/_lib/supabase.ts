import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Cliente de Supabase para uso EXCLUSIVO del servidor.
// Usa la Service Role Key: nunca debe exponerse en el frontend.
export function getSupabase(): SupabaseClient {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error('Faltan SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  }
  return createClient(url, key, { auth: { persistSession: false } })
}
