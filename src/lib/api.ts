export type ReserveResult =
  | { ok: true }
  | { ok: false; reason: 'already-reserved' | 'invalid' | 'error' }

export async function fetchReservedIds(): Promise<string[]> {
  const res = await fetch('/api/reservations')
  if (!res.ok) throw new Error('No se pudieron cargar las reservas')
  const data = (await res.json()) as { reserved: string[] }
  return data.reserved ?? []
}

export async function reserveItem(
  itemId: string,
  email: string,
): Promise<ReserveResult> {
  const res = await fetch('/api/reserve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ itemId, email }),
  })

  if (res.ok) return { ok: true }
  if (res.status === 409) return { ok: false, reason: 'already-reserved' }
  if (res.status === 400) return { ok: false, reason: 'invalid' }
  return { ok: false, reason: 'error' }
}
