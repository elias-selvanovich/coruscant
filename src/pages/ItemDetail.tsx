import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useCatalog } from '../data/catalog'
import { formatPrice } from '../lib/format'
import { Carousel } from '../components/Carousel'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { Footer } from '../components/Footer'

export function ItemDetail() {
  const { id } = useParams()
  const { items, loaded } = useCatalog()
  const item = items.find((it) => it.id === id)

  // Al entrar al detalle, arrancamos arriba de todo.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [id])

  if (!loaded) {
    return (
      <div className="page detail">
        <BackLink />
        <p className="empty">Cargando…</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="page detail">
        <BackLink />
        <p className="empty">No encontramos este ítem. Quizás ya no está publicado.</p>
        <Footer />
      </div>
    )
  }

  return (
    <div className="page detail">
      <BackLink />

      <div className="detail__grid">
        <div className="detail__media">
          <Carousel photos={item.photos} title={item.title} />
        </div>

        <div className="detail__info">
          {item.reserved && <span className="badge badge--inline">Reservado</span>}
          <h1 className="detail__title">{item.title}</h1>
          <p className="detail__price">{formatPrice(item.price)}</p>
          {item.description && (
            <p className="detail__desc">{item.description}</p>
          )}

          <div className="detail__action">
            {item.reserved ? (
              <span className="btn btn--disabled btn--big">Reservado</span>
            ) : (
              <WhatsAppButton title={item.title} big />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function BackLink() {
  return (
    <Link to="/" className="back">
      ← Volver
    </Link>
  )
}
