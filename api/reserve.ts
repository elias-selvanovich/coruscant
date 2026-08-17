import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Resend } from 'resend'
import { getDb, isUniqueViolation } from './_lib/db'
import { itemById } from '../src/data/items'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/reserve  { itemId, email }
//  200 → reservado ok
//  409 → ya estaba reservado (bloqueo al primero, vía UNIQUE en item_id)
//  400 → datos inválidos
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method-not-allowed' })
  }

  const body = (req.body ?? {}) as { itemId?: unknown; email?: unknown }
  const itemId = typeof body.itemId === 'string' ? body.itemId : ''
  const email =
    typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''

  const item = itemById(itemId)
  if (!item || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'invalid' })
  }

  try {
    const db = getDb()
    try {
      await db.execute({
        sql: 'insert into reservations (item_id, email) values (?, ?)',
        args: [itemId, email],
      })
    } catch (dbErr) {
      // item_id es PRIMARY KEY → violación de unicidad = ya reservado
      if (isUniqueViolation(dbErr)) {
        return res.status(409).json({ error: 'already-reserved' })
      }
      throw dbErr
    }

    // Aviso por email (best-effort: si falla, la reserva igual quedó guardada)
    try {
      await notify(item.title, email)
    } catch (mailErr) {
      console.error('[reserve] fallo el email de aviso', mailErr)
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('[reserve] error', err)
    return res.status(500).json({ error: 'error' })
  }
}

async function notify(itemTitle: string, email: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.FROM_EMAIL
  const to = (process.env.NOTIFY_EMAILS ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)

  if (!apiKey || !from || to.length === 0) {
    console.warn('[reserve] Resend sin configurar; no se envía aviso')
    return
  }

  const resend = new Resend(apiKey)
  await resend.emails.send({
    from,
    to,
    subject: `🛎️ Nueva reserva: ${itemTitle}`,
    html: `
      <div style="font-family: system-ui, sans-serif; font-size: 15px; color: #1c1720;">
        <h2 style="margin:0 0 12px;">Nueva reserva en Coruscant</h2>
        <p><strong>Artículo:</strong> ${escapeHtml(itemTitle)}</p>
        <p><strong>Reservó:</strong> ${escapeHtml(email)}</p>
        <p style="color:#6f6570;">Escribile para coordinar la entrega. Si querés
        liberar el ítem, borrá la fila en Turso.</p>
      </div>
    `,
  })
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
