const ars = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

export function formatPrice(price: number | null): string {
  if (price === null) return 'A convenir'
  return ars.format(price)
}
