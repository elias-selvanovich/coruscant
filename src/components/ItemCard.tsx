import { Link } from 'react-router-dom'
import type { Item } from '../data/catalog'
import { formatPrice } from '../lib/format'

export function ItemCard({ item }: { item: Item }) {
  const cover = item.photos?.[0]
  const count = item.photos?.length ?? 0

  return (
    <Link
      to={`/item/${item.id}`}
      className={`card${item.reserved ? ' card--reserved' : ''}`}
    >
      <div className="card__media">
        {cover ? (
          <img className="card__photo" src={cover} alt={item.title} loading="lazy" />
        ) : (
          <div className="card__photo card__photo--empty">Sin foto</div>
        )}

        {item.reserved && <span className="badge">Reservado</span>}
        {count > 1 && (
          <span className="photo-count" aria-label={`${count} fotos`}>
            <CameraIcon /> {count}
          </span>
        )}
      </div>

      <div className="card__body">
        <h2 className="card__title">{item.title}</h2>
        <div className="card__foot">
          <span className="price">{formatPrice(item.price)}</span>
          <span className="card__cta">Ver detalle →</span>
        </div>
      </div>
    </Link>
  )
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor" aria-hidden="true">
      <path d="M9 3 7.2 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-3.2L15 3H9Zm3 5.5A4.5 4.5 0 1 1 12 17a4.5 4.5 0 0 1 0-9Zm0 2A2.5 2.5 0 1 0 12 15a2.5 2.5 0 0 0 0-5Z" />
    </svg>
  )
}
