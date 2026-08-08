import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/700.css'
import { useEffect, useState } from 'react'
import { items, type Item } from './data/items'
import { fetchReservedIds } from './lib/api'
import { ItemCard } from './components/ItemCard'
import { ReserveModal } from './components/ReserveModal'

function App() {
  const [reserved, setReserved] = useState<Set<string>>(new Set())
  const [loaded, setLoaded] = useState(false)
  const [selected, setSelected] = useState<Item | null>(null)

  useEffect(() => {
    let alive = true
    fetchReservedIds()
      .then((ids) => {
        if (alive) setReserved(new Set(ids))
      })
      .catch(() => {
        /* si falla, mostramos todo como disponible */
      })
      .finally(() => {
        if (alive) setLoaded(true)
      })
    return () => {
      alive = false
    }
  }, [])

  function markReserved(id: string) {
    setReserved((prev) => new Set(prev).add(id))
  }

  const available = items.filter((it) => !reserved.has(it.id)).length

  return (
    <div className="page">
      <header className="hero">
        <h1 className="hero__title">Nos mudamos 📦</h1>
        <p className="hero__sub">
          Estas cosas buscan casa nueva. Si algo te gusta, reservalo con tu email
          y coordinamos.
        </p>
        {loaded && (
          <p className="hero__count">
            {available} de {items.length} disponibles
          </p>
        )}
      </header>

      <main className="grid">
        {items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            reserved={reserved.has(item.id)}
            onReserve={setSelected}
          />
        ))}
      </main>

      <footer className="footer">
        <p>
          Hecho con cariño ·{' '}
          <a href="https://www.selvanovich.com.ar">selvanovich.com.ar</a>
        </p>
      </footer>

      {selected && (
        <ReserveModal
          item={selected}
          onClose={() => setSelected(null)}
          onReserved={markReserved}
        />
      )}
    </div>
  )
}

export default App
