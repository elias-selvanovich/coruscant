import { useEffect, useState } from 'react'
import type { Item } from '../data/items'
import { reserveItem } from '../lib/api'

type Props = {
  item: Item
  onClose: () => void
  onReserved: (itemId: string) => void
}

type Status = 'idle' | 'sending' | 'done' | 'already' | 'invalid' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function ReserveModal({ item, onClose, onReserved }: Props) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const canSubmit = EMAIL_RE.test(email) && status !== 'sending'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setStatus('invalid')
      return
    }
    setStatus('sending')
    const result = await reserveItem(item.id, email.trim())
    if (result.ok) {
      setStatus('done')
      onReserved(item.id)
    } else if (result.reason === 'already-reserved') {
      setStatus('already')
      onReserved(item.id)
    } else if (result.reason === 'invalid') {
      setStatus('invalid')
    } else {
      setStatus('error')
    }
  }

  const success = status === 'done' || status === 'already'

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={`Reservar ${item.title}`}
      >
        <button className="modal__close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        {success ? (
          <div className="modal__done">
            <div className="check">✓</div>
            {status === 'done' ? (
              <>
                <h3>¡Reservado!</h3>
                <p>
                  Anotamos <strong>{item.title}</strong> para vos. Nos pusimos
                  en contacto a la brevedad al mail que dejaste.
                </p>
              </>
            ) : (
              <>
                <h3>Ya estaba reservado</h3>
                <p>
                  Alguien se adelantó con <strong>{item.title}</strong>. ¡Gracias
                  igual!
                </p>
              </>
            )}
            <button className="btn" onClick={onClose}>
              Cerrar
            </button>
          </div>
        ) : (
          <form className="modal__form" onSubmit={submit}>
            <h3>Reservar “{item.title}”</h3>
            <p className="modal__hint">
              Dejanos tu email y lo apartamos para vos. Te escribimos para
              coordinar.
            </p>
            <label htmlFor="email">Tu email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'invalid' || status === 'error') setStatus('idle')
              }}
              placeholder="vos@email.com"
              autoFocus
              autoComplete="email"
            />
            {status === 'invalid' && (
              <p className="modal__error">Ingresá un email válido.</p>
            )}
            {status === 'error' && (
              <p className="modal__error">
                Hubo un problema. Probá de nuevo en un momento.
              </p>
            )}
            <button className="btn btn--wide" type="submit" disabled={!canSubmit}>
              {status === 'sending' ? 'Reservando…' : 'Confirmar reserva'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
