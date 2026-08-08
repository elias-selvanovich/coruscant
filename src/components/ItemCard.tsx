import { useState } from 'react'
import type { Item } from '../data/items'
import { formatPrice } from '../lib/format'

type Props = {
  item: Item
  reserved: boolean
  onReserve: (item: Item) => void
}

export function ItemCard({ item, reserved, onReserve }: Props) {
  const [active, setActive] = useState(0)
  const photos = item.photos.length > 0 ? item.photos : []

  return (
    <article className={`card${reserved ? ' card--reserved' : ''}`}>
      <div className="card__media">
        {photos.length > 0 ? (
          <img
            className="card__photo"
            src={photos[active]}
            alt={item.title}
            loading="lazy"
          />
        ) : (
          <div className="card__photo card__photo--empty">Sin foto</div>
        )}

        {reserved && <span className="badge">Reservado</span>}

        {photos.length > 1 && (
          <div className="thumbs" role="tablist" aria-label="Fotos">
            {photos.map((p, i) => (
              <button
                key={p}
                className={`thumb${i === active ? ' thumb--active' : ''}`}
                onClick={() => setActive(i)}
                aria-label={`Foto ${i + 1}`}
                aria-selected={i === active}
                role="tab"
              >
                <img src={p} alt="" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="card__body">
        <h2 className="card__title">{item.title}</h2>
        <p className="card__desc">{item.description}</p>
        <div className="card__foot">
          <span className="price">{formatPrice(item.price)}</span>
          <button
            className="btn"
            disabled={reserved}
            onClick={() => onReserve(item)}
          >
            {reserved ? 'Reservado' : 'Reservar'}
          </button>
        </div>
      </div>
    </article>
  )
}
