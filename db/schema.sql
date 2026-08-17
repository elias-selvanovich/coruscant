-- Ejecutá esto una vez en tu base de Turso (dashboard → SQL, o `turso db shell`).
-- Tabla mínima de reservas. item_id es PRIMARY KEY: implementa el "bloqueo al
-- primero" (el segundo intento de reservar el mismo ítem falla con violación de
-- unicidad → 409), sin race conditions.

create table if not exists reservations (
  item_id    text primary key,
  email      text not null,
  created_at text not null default (datetime('now'))
);

-- Para LIBERAR un ítem reservado, borrá su fila:
--   delete from reservations where item_id = 'sofa-3-cuerpos';
