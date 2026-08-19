import { useState } from 'react'
import { type Item, whatsappUrl } from '../data/catalog'
import { formatPrice } from '../lib/format'

export function ItemCard({ item }: { item: Item }) {
  const [active, setActive] = useState(0)
  const photos = item.photos ?? []

  return (
    <article className={`card${item.reserved ? ' card--reserved' : ''}`}>
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

        {item.reserved && <span className="badge">Reservado</span>}

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
          {item.reserved ? (
            <span className="btn btn--disabled">Reservado</span>
          ) : (
            <a
              className="btn btn--wa"
              href={whatsappUrl(item.title)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <WhatsAppIcon />
              Reservar
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 1.82c2.16 0 4.19.84 5.72 2.37a8.05 8.05 0 0 1 2.37 5.72c0 4.46-3.63 8.09-8.1 8.09a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.11.82.83-3.04-.19-.31a8.02 8.02 0 0 1-1.24-4.28c0-4.46 3.63-8.08 8.09-8.08Zm4.62 11.44c-.25-.13-1.47-.72-1.7-.81-.23-.08-.4-.13-.56.13-.17.25-.64.8-.79.97-.14.17-.29.19-.54.06-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09 0 1.23.9 2.42 1.03 2.59.13.17 1.77 2.7 4.28 3.79.6.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  )
}
