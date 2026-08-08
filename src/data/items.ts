// ─── CATÁLOGO ────────────────────────────────────────────────────────────────
// Para agregar/editar cosas en venta:
//   1. Poné las fotos en  public/items/<id>/  (ej: public/items/sofa/1.jpg)
//   2. Agregá una entrada acá abajo.
//   3. Commit + push → Vercel hace el deploy solo.
//
// price: número en pesos, o null para que muestre "A convenir".
// El `id` tiene que ser único y estable (se usa para guardar la reserva).
// ─────────────────────────────────────────────────────────────────────────────

export type Item = {
  id: string
  title: string
  description: string
  price: number | null // null → "A convenir"
  photos: string[] // rutas desde /public, ej: '/items/sofa/1.jpg'
}

export const items: Item[] = [
  {
    id: 'sofa-3-cuerpos',
    title: 'Sofá 3 cuerpos',
    description:
      'Sofá gris de 3 cuerpos, muy cómodo. Tiene algo de uso pero está impecable. Retira en zona Palermo.',
    price: 90000,
    photos: ['/items/sofa-3-cuerpos/1.svg', '/items/sofa-3-cuerpos/2.svg'],
  },
  {
    id: 'bici-rodado-29',
    title: 'Bicicleta MTB rodado 29',
    description:
      'Mountain bike rodado 29, cambios Shimano, frenos a disco. Recién service. Ideal ciudad y montaña.',
    price: 150000,
    photos: ['/items/bici-rodado-29/1.svg'],
  },
  {
    id: 'escritorio-madera',
    title: 'Escritorio de madera',
    description:
      'Escritorio de madera maciza, 120x60cm. Un par de marcas de uso. Perfecto para home office.',
    price: null,
    photos: ['/items/escritorio-madera/1.svg'],
  },
]

export const itemById = (id: string): Item | undefined =>
  items.find((it) => it.id === id)
