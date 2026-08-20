import { useEffect, useRef, useState } from 'react'

export function Carousel({ photos, title }: { photos: string[]; title: string }) {
  const [i, setI] = useState(0)
  const [open, setOpen] = useState(false)
  const touchX = useRef<number | null>(null)
  const total = photos.length

  const go = (n: number) => setI((n + total) % total)
  const next = () => go(i + 1)
  const prev = () => go(i - 1)

  // Teclado: flechas navegan, Escape cierra el lightbox.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, total])

  // Bloquear el scroll del fondo mientras el lightbox está abierto.
  useEffect(() => {
    if (!open) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Gestos de swipe (mobile).
  const swipe = {
    onTouchStart: (e: React.TouchEvent) => (touchX.current = e.touches[0].clientX),
    onTouchEnd: (e: React.TouchEvent) => {
      if (touchX.current === null) return
      const dx = e.changedTouches[0].clientX - touchX.current
      if (dx > 40) prev()
      else if (dx < -40) next()
      touchX.current = null
    },
  }

  if (total === 0) {
    return <div className="carousel__stage carousel__stage--empty">Sin fotos</div>
  }

  return (
    <div className="carousel">
      <div className="carousel__stage" {...swipe}>
        <img
          src={photos[i]}
          alt={`${title} — foto ${i + 1}`}
          className="carousel__img"
          onClick={() => setOpen(true)}
        />

        <button className="carousel__expand" onClick={() => setOpen(true)} aria-label="Ver a pantalla completa">
          <ExpandIcon />
        </button>

        {total > 1 && (
          <>
            <button className="carousel__nav carousel__nav--prev" onClick={prev} aria-label="Anterior">
              ‹
            </button>
            <button className="carousel__nav carousel__nav--next" onClick={next} aria-label="Siguiente">
              ›
            </button>
            <span className="carousel__count">
              {i + 1} / {total}
            </span>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="carousel__thumbs">
          {photos.map((p, idx) => (
            <button
              key={p}
              className={`carousel__thumb${idx === i ? ' is-active' : ''}`}
              onClick={() => setI(idx)}
              aria-label={`Ir a foto ${idx + 1}`}
            >
              <img src={p} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}

      {open && (
        <div
          className="lightbox"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — foto ${i + 1} de ${total}`}
        >
          <button className="lightbox__close" onClick={() => setOpen(false)} aria-label="Cerrar">
            ×
          </button>

          <img
            src={photos[i]}
            alt={`${title} — foto ${i + 1}`}
            className="lightbox__img"
            onClick={(e) => e.stopPropagation()}
            {...swipe}
          />

          {total > 1 && (
            <>
              <button
                className="lightbox__nav lightbox__nav--prev"
                onClick={(e) => {
                  e.stopPropagation()
                  prev()
                }}
                aria-label="Anterior"
              >
                ‹
              </button>
              <button
                className="lightbox__nav lightbox__nav--next"
                onClick={(e) => {
                  e.stopPropagation()
                  next()
                }}
                aria-label="Siguiente"
              >
                ›
              </button>
              <span className="lightbox__count">
                {i + 1} / {total}
              </span>
            </>
          )}
        </div>
      )}
    </div>
  )
}

function ExpandIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  )
}
