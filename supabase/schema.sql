-- Ejecutá esto una vez en Supabase → SQL Editor.
-- Tabla mínima de reservas. El UNIQUE en item_id implementa el "bloqueo al primero":
-- el segundo intento de reservar el mismo ítem falla con violación de unicidad (409).

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  item_id text not null unique,
  email text not null,
  created_at timestamptz not null default now()
);

-- El acceso a esta tabla es SOLO desde las funciones serverless usando la
-- Service Role key (que saltea RLS). El frontend nunca la toca directo.
-- Dejamos RLS activado sin políticas públicas => nadie puede leer/escribir
-- con la anon key. (La Service Role key ignora RLS.)
alter table reservations enable row level security;

-- Para LIBERAR un ítem reservado: borrá su fila.
--   delete from reservations where item_id = 'sofa-3-cuerpos';
