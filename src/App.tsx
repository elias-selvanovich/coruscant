import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import { useEffect, useState } from 'react'
import { loadItems, type Item } from './data/catalog'
import { ItemCard } from './components/ItemCard'

function App() {
  const [items, setItems] = useState<Item[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    let alive = true
    loadItems()
      .then((data) => {
        if (alive) setItems(data)
      })
      .catch(() => {
        /* si falla, queda vacío */
      })
      .finally(() => {
        if (alive) setLoaded(true)
      })
    return () => {
      alive = false
    }
  }, [])

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

      <footer className="footer">
        <p>
          Hecho con cariño ·{' '}
          <a href="https://www.selvanovich.ar">selvanovich.ar</a>
        </p>
      </footer>
    </div>
  )
}

export default App
