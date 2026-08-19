import { WHATSAPP_PHONE, WHATSAPP_TEMPLATE } from '../config'

export type Item = {
  id: string
  title: string
  description: string
  price: number | null // null → "A convenir"
  photos: string[] // URLs o rutas desde /public (ej: '/items/sofa/1.jpg')
  reserved: boolean
}

// Lee el catálogo del JSON estático (que edita el admin local).
export async function loadItems(): Promise<Item[]> {
  const res = await fetch('/items.json', { cache: 'no-store' })
  if (!res.ok) throw new Error('No se pudo cargar el catálogo')
  const data = (await res.json()) as { items: Item[] }
  return data.items ?? []
}

// Link de WhatsApp con el mensaje de reserva prellenado.
export function whatsappUrl(title: string): string {
  const text = WHATSAPP_TEMPLATE.replace('{title}', title)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
}
