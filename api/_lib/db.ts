import { createClient, type Client } from '@libsql/client'

// Cliente de Turso (libSQL / SQLite) para uso del servidor.
// Credenciales desde el dashboard de Turso o `turso db tokens create`.
export function getDb(): Client {
  const url = process.env.TURSO_DATABASE_URL
  const authToken = process.env.TURSO_AUTH_TOKEN
  if (!url) {
    throw new Error('Falta TURSO_DATABASE_URL')
  }
  return createClient({ url, authToken })
}

// true si el error es una violación de unicidad (item_id ya reservado).
export function isUniqueViolation(err: unknown): boolean {
  const code = (err as { code?: string })?.code ?? ''
  const message = (err as { message?: string })?.message ?? ''
  return (
    code.includes('SQLITE_CONSTRAINT') ||
    /UNIQUE constraint failed|PRIMARY KEY/i.test(message)
  )
}
