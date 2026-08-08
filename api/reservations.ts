import type { VercelRequest, VercelResponse } from '@vercel/node'
import { getSupabase } from './_lib/supabase'

// GET /api/reservations → { reserved: string[] }
// Devuelve los item_id ya reservados, para que el front los marque.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'method-not-allowed' })
  }
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('reservations')
      .select('item_id')
    if (error) throw error

    const reserved = (data ?? []).map((row) => row.item_id as string)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).json({ reserved })
  } catch (err) {
    console.error('[reservations] error', err)
    return res.status(500).json({ error: 'error' })
  }
}
