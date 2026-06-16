create table public.reading_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  device_id uuid references public.devices (id) on delete set null,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  duration_seconds integer,
  start_percentage numeric(5, 2),
  end_percentage numeric(5, 2)
);

create index reading_sessions_user_id_idx on public.reading_sessions (user_id);
create index reading_sessions_user_started_idx on public.reading_sessions (user_id, started_at desc);
create index reading_sessions_book_id_idx on public.reading_sessions (book_id);

alter table public.reading_sessions enable row level security;

create policy "reading_sessions_select_own" on public.reading_sessions
  for select using (auth.uid() = user_id);

create policy "reading_sessions_insert_own" on public.reading_sessions
  for insert with check (auth.uid() = user_id);

create policy "reading_sessions_update_own" on public.reading_sessions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "reading_sessions_delete_own" on public.reading_sessions
  for delete using (auth.uid() = user_id);
