# coruscant

Mini página para vender cosas por una mudanza — [coruscant.selvanovich.ar](https://coruscant.selvanovich.ar)

Muestra artículos con fotos, descripción y precio (o "A convenir"). Cualquiera puede
**reservar dejando su email**; la reserva queda guardada y **bloquea el ítem para el
primero** que reserva. A vos te llega un **email de aviso**.

**Stack:** Vite + React + TypeScript · funciones serverless de Vercel (`/api`) ·
Supabase (reservas) · Resend (emails). Todo en free tier.

## Cómo funciona

- **Catálogo** → `src/data/items.ts` (editás vos). Fotos en `public/items/<id>/`.
- **Estado "reservado"** → la app pide `GET /api/reservations` y marca los ítems.
- **Reservar** → `POST /api/reserve` inserta en Supabase. La columna `item_id` es
  `UNIQUE`: el segundo intento sobre el mismo ítem devuelve 409 ("ya reservado").
  Sin race conditions. Después manda el aviso por Resend.

## Agregar / editar cosas en venta

1. Poné las fotos en `public/items/<id>/` (ej. `public/items/sofa-3-cuerpos/1.jpg`).
2. Agregá/editá la entrada en `src/data/items.ts` (`price: null` → "A convenir").
3. `git push` → Vercel deploya solo.

## Liberar un ítem reservado

Borrá su fila en Supabase (Table editor o SQL):

```sql
delete from reservations where item_id = 'sofa-3-cuerpos';
```

## Setup (una vez)

### 1. Supabase
- Creá un proyecto en [supabase.com](https://supabase.com).
- SQL Editor → pegá y ejecutá [`supabase/schema.sql`](supabase/schema.sql).
- Project Settings → API → copiá **Project URL** y **service_role key**.

### 2. Resend
- Cuenta en [resend.com](https://resend.com) → creá una API key.
- Para producción: verificá el dominio `selvanovich.ar` (agrega unos registros DNS
  en Cloudflare) y usá un remitente tipo `reservas@selvanovich.ar`.
- Para probar rápido podés usar `onboarding@resend.dev` (los mails llegan solo a tu
  propia dirección verificada en Resend).

### 3. Variables de entorno
Copiá `.env.example` → `.env.local` y completá (ver ese archivo). En Vercel, cargá las
mismas en Project → Settings → Environment Variables:

| Variable | Qué es |
|---|---|
| `SUPABASE_URL` | Project URL de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (solo servidor) |
| `RESEND_API_KEY` | API key de Resend |
| `FROM_EMAIL` | Remitente, ej. `Coruscant <reservas@selvanovich.ar>` |
| `NOTIFY_EMAILS` | A quién avisar (varios separados por coma) |

## Desarrollo

Solo el front (sin backend), útil para maquetar:

```bash
npm install
npm run dev
```

Con las funciones `/api` (flujo completo de reservas), usando el CLI de Vercel:

```bash
npm i -g vercel
vercel dev
```

(`vercel dev` levanta el front + las funciones y lee `.env.local`.)

## Deploy

Proyecto de **Vercel** conectado a este repo. Framework preset: **Vite**. Push a `main`
= deploy. Dominio `coruscant.selvanovich.ar` apuntado por CNAME desde Cloudflare
(en "DNS only"). Cargá las env vars antes del primer deploy.
