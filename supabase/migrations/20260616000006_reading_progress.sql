create table public.reading_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  format text not null check (format in ('epub', 'pdf')),
  locator_json jsonb not null,
  percentage numeric(5, 2) not null default 0 check (percentage >= 0 and percentage <= 100),
  current_page integer,
  total_pages integer,
  current_chapter text,
  device_id uuid references public.devices (id) on delete set null,
  version integer not null default 1,
  updated_at timestamptz not null default now(),
  unique (user_id, book_id)
);

create index reading_progress_user_book_idx on public.reading_progress (user_id, book_id);

alter table public.reading_progress enable row level security;

create policy "reading_progress_select_own" on public.reading_progress
  for select using (auth.uid() = user_id);

create policy "reading_progress_insert_own" on public.reading_progress
  for insert with check (auth.uid() = user_id);

create policy "reading_progress_update_own" on public.reading_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "reading_progress_delete_own" on public.reading_progress
  for delete using (auth.uid() = user_id);
