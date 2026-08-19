# coruscant

Mini página para vender cosas por una mudanza — [coruscant.selvanovich.ar](https://coruscant.selvanovich.ar)

Muestra artículos con fotos, descripción y precio (o "A convenir"). Para reservar,
cada ítem tiene un **botón de WhatsApp** que abre un chat con un mensaje prellenado
("Hola, quiero reservar: X"). Cuando te llega el mensaje, marcás el ítem como
**reservado** desde un admin local.

**Stack:** Vite + React + TypeScript. **Sin backend**: sitio 100% estático. El catálogo
es un JSON que editás vos. Deploy gratis en Vercel, sin base de datos ni variables de
entorno.

## Cómo funciona

- **Catálogo** → [`public/items.json`](public/items.json). El sitio lo lee al cargar.
- **Reservar** → botón de WhatsApp (`wa.me`) con el mensaje prellenado hacia tu número.
- **Marcar reservado** → cambiás `"reserved": true` en el ítem (a mano o con el admin).
  El ítem queda con un badge "Reservado" y sin botón.

## Configurar tu WhatsApp

En [`src/config.ts`](src/config.ts):

- `WHATSAPP_PHONE` — tu número en formato internacional, solo dígitos. Argentina celular:
  `54 9 <área sin 0> <número sin 15>` → ej. `5491122334455`.
- `WHATSAPP_TEMPLATE` — el texto del mensaje (`{title}` se reemplaza por el ítem).

## Cargar / editar cosas (admin local)

Hay un pequeño admin que corre **solo en tu máquina** y escribe `public/items.json`:

```bash
npm run admin      # abre http://localhost:4321
```

Ahí agregás/editás ítems, subís precios, pegás links de fotos y marcás reservados.
Al guardar, escribe el JSON. Para que aparezca online:

```bash
git add public/items.json && git commit -m "Actualizar catálogo" && git push
```

> El admin vive en `admin/` y está en `.gitignore` (no se sube; Vercel solo sirve el
> `dist/` compilado, así que nunca sería público de todos modos).

### Fotos
- Locales: poné los archivos en `public/items/<id>/` y referencialos como
  `/items/<id>/1.jpg` (una por línea en el admin).
- Externas: pegá la URL completa.

### Editar el JSON a mano (alternativa al admin)
Cada ítem: `id` (único y estable), `title`, `description`, `price` (número o `null` →
"A convenir"), `photos` (array de rutas/URLs), `reserved` (`true`/`false`).

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:5174
```

## Deploy

Proyecto de **Vercel** conectado a este repo. Framework preset: **Vite**, sin env vars.
Push a `main` = deploy. Dominio `coruscant.selvanovich.ar` apuntado por CNAME desde
Cloudflare (en "DNS only") → `cname.vercel-dns.com`.
