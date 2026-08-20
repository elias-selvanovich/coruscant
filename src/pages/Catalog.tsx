import { useCatalog } from '../data/catalog'
import { ItemCard } from '../components/ItemCard'
import { Footer } from '../components/Footer'

export function Catalog() {
  const { items, loaded } = useCatalog()
  const available = items.filter((it) => !it.reserved).length

  return (
    <div className="page">
      <header className="hero">
        <h1 className="hero__title">Nos mudamos 📦</h1>
        <p className="hero__sub">
          Estas cosas buscan casa nueva. Si algo te gusta, reservalo por WhatsApp
          y coordinamos.
        </p>
        {loaded && items.length > 0 && (
          <p className="hero__count">
            {available} de {items.length} disponibles
          </p>
        )}
      </header>

      <main className="grid">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </main>

      {loaded && items.length === 0 && (
        <p className="empty">Pronto vamos a publicar cosas por acá. ¡Volvé luego!</p>
      )}

      <Footer />
    </div>
  )
}
