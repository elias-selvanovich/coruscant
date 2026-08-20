import { useEffect, useState } from 'react'
import { WHATSAPP_PHONE, WHATSAPP_TEMPLATE } from '../config'

export type Item = {
  id: string
  title: string
  description: string
  price: number | null // null → "A convenir"
  photos: string[] // URLs o rutas desde /public (ej: '/items/sofa/1.jpg')
  reserved: boolean
}

// Cache a nivel módulo: se fetchea el JSON una sola vez por carga de página.
let cache: Promise<Item[]> | null = null

export function loadItems(): Promise<Item[]> {
  if (!cache) {
    cache = fetch('/items.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('No se pudo cargar el catálogo')
        return res.json()
      })
      .then((data: { items: Item[] }) => data.items ?? [])
      .catch((err) => {
        cache = null // permití reintentar si falló
        throw err
      })
  }
  return cache
}

// Hook compartido por la grilla y el detalle.
export function useCatalog() {
  const [items, setItems] = useState<Item[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let alive = true
    loadItems()
      .then((data) => alive && setItems(data))
      .catch(() => {})
      .finally(() => alive && setLoaded(true))
    return () => {
      alive = false
    }
  }, [])

  return { items, loaded }
}

// Link de WhatsApp con el mensaje de reserva prellenado.
export function whatsappUrl(title: string): string {
  const text = WHATSAPP_TEMPLATE.replace('{title}', title)
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
}
