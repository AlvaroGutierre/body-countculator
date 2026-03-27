-- ─────────────────────────────────────────────────────────────────────────────
-- bodycount-web · Supabase schema  v1.1
-- Ejecutar en Supabase → SQL Editor (instalación limpia)
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Tablas ────────────────────────────────────────────────────────────────────

create table if not exists submissions (
  id             uuid        primary key default gen_random_uuid(),
  session_id     text        not null unique,
  created_at     timestamptz not null default now(),
  answers        jsonb       not null,
  result         jsonb       not null,
  is_preliminary boolean     not null default false,
  completed_at   bigint      not null,
  model_version  text        not null default '1.0'
);

create table if not exists feedback (
  id              uuid        primary key default gen_random_uuid(),
  session_id      text        not null unique,
  estimated_value integer     not null,
  feedback_type   text        not null,
  real_value      integer,
  model_version   text        not null default '1.0',
  timestamp       bigint      not null,
  created_at      timestamptz not null default now()
);

-- ── Permisos de tabla ─────────────────────────────────────────────────────────
-- En Supabase, las tablas creadas via SQL no heredan permisos automáticamente.
-- RLS y GRANT son capas independientes: sin GRANT, Postgres deniega antes de
-- evaluar las políticas RLS.

grant insert on table submissions to anon;
grant insert on table feedback    to anon;

-- ── Row Level Security ────────────────────────────────────────────────────────

alter table submissions enable row level security;
alter table feedback    enable row level security;

-- anon puede insertar. TO anon explícito para evitar ambigüedades.
create policy "anon_insert_submissions"
  on submissions
  for insert
  to anon
  with check (true);

create policy "anon_insert_feedback"
  on feedback
  for insert
  to anon
  with check (true);

-- No hay políticas SELECT para anon. Los datos crudos solo son accesibles
-- desde service_role. Las estadísticas públicas se sirven exclusivamente
-- a través de get_public_stats() (ver abajo).

-- ── Función de estadísticas públicas ─────────────────────────────────────────
-- SECURITY DEFINER: se ejecuta con los permisos del propietario (service_role),
-- no con los del llamante (anon). Solo devuelve conteos agregados.

create or replace function get_public_stats()
returns json
language sql
security definer
stable
set search_path = public
as $$
  select json_build_object(
    'submissions_count', (select count(*) from submissions)::bigint,
    'feedbacks_count',   (select count(*) from feedback)::bigint
  );
$$;

grant execute on function get_public_stats() to anon;

-- ── Migración desde v1.0 (si las tablas ya existen) ──────────────────────────
--
-- Ejecutar solo si ya tenías el schema anterior:
--
--   alter table submissions add column if not exists model_version text not null default '1.0';
--   alter table submissions add constraint if not exists unique_submission_session unique (session_id);
--
--   alter table feedback add column if not exists model_version text not null default '1.0';
--   alter table feedback add constraint if not exists unique_feedback_session unique (session_id);
--
--   drop policy if exists "anon_select_submissions" on submissions;
--   drop policy if exists "anon_select_feedback"    on feedback;
--
--   grant insert on table submissions to anon;
--   grant insert on table feedback    to anon;
--
--   -- Luego re-crear las políticas con TO anon explícito y ejecutar el bloque
--   -- create or replace function + grant de arriba.
