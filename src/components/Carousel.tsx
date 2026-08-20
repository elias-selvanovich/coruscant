import { useEffect, useRef, useState } from 'react'

export function Carousel({ photos, title }: { photos: string[]; title: string }) {
  const [i, setI] = useState(0)
  const touchX = useRef<number | null>(null)
  const total = photos.length

  const go = (n: number) => setI((n + total) % total)
  const next = () => go(i + 1)
  const prev = () => go(i - 1)

  useEffect(() => {
    if (total <= 1) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, total])

  if (total === 0) {
    return <div className="carousel__stage carousel__stage--empty">Sin fotos</div>
  }

  return (
    <div className="carousel">
      <div
        className="carousel__stage"
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (dx > 40) prev()
          else if (dx < -40) next()
          touchX.current = null
        }}
      >
        <img src={photos[i]} alt={`${title} — foto ${i + 1}`} />

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
    </div>
  )
}
