-- Required extensions
create extension if not exists "pgcrypto"; -- gen_random_uuid()
create extension if not exists "pg_trgm"; -- fuzzy search across title/author/etc.

-- Shared helper: keeps updated_at fresh on any UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
