create table public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  subtitle text,
  author text,
  description text,
  language text,
  publisher text,
  published_date text,
  isbn text,
  format text not null check (format in ('epub', 'pdf')),
  mime_type text not null,
  original_filename text not null,
  file_size_bytes bigint not null check (file_size_bytes > 0),
  file_hash text not null,
  r2_object_key text not null unique,
  cover_r2_object_key text,
  processing_status text not null default 'pending_upload'
    check (processing_status in ('pending_upload', 'uploaded', 'processing', 'ready', 'failed')),
  processing_error text,
  page_count integer,
  word_count integer,
  epub_identifier text,
  metadata_source text check (metadata_source in ('extracted', 'user_edited', 'mixed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_opened_at timestamptz,
  archived_at timestamptz
);

create index books_user_id_idx on public.books (user_id);
create index books_user_status_idx on public.books (user_id, processing_status);
create index books_user_hash_idx on public.books (user_id, file_hash);
create index books_user_archived_idx on public.books (user_id, archived_at);
create index books_user_last_opened_idx on public.books (user_id, last_opened_at desc);

-- Trigram indexes power ILIKE search across the fields users search by.
create index books_title_trgm_idx on public.books using gin (title gin_trgm_ops);
create index books_author_trgm_idx on public.books using gin (author gin_trgm_ops);
create index books_description_trgm_idx on public.books using gin (description gin_trgm_ops);
create index books_filename_trgm_idx on public.books using gin (original_filename gin_trgm_ops);

create trigger books_set_updated_at
  before update on public.books
  for each row execute function public.set_updated_at();

-- Protects fields that only server-side (service-role) processing should ever set,
-- even though application-layer checks are the primary defence.
create or replace function public.protect_book_system_fields()
returns trigger
language plpgsql
as $$
begin
  if auth.role() <> 'service_role' then
    if new.r2_object_key is distinct from old.r2_object_key
      or new.cover_r2_object_key is distinct from old.cover_r2_object_key
      or new.file_hash is distinct from old.file_hash
      or new.processing_status is distinct from old.processing_status
      or new.processing_error is distinct from old.processing_error
      or new.user_id is distinct from old.user_id
    then
      raise exception 'Field cannot be modified by the client';
    end if;
  end if;
  return new;
end;
$$;

create trigger books_protect_system_fields
  before update on public.books
  for each row execute function public.protect_book_system_fields();

alter table public.books enable row level security;

create policy "books_select_own" on public.books
  for select using (auth.uid() = user_id);

create policy "books_insert_own" on public.books
  for insert with check (auth.uid() = user_id);

create policy "books_update_own" on public.books
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "books_delete_own" on public.books
  for delete using (auth.uid() = user_id);
