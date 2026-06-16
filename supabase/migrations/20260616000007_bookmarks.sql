create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  locator_json jsonb not null,
  label text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index bookmarks_user_book_idx on public.bookmarks (user_id, book_id);

create trigger bookmarks_set_updated_at
  before update on public.bookmarks
  for each row execute function public.set_updated_at();

alter table public.bookmarks enable row level security;

create policy "bookmarks_select_own" on public.bookmarks
  for select using (auth.uid() = user_id);

create policy "bookmarks_insert_own" on public.bookmarks
  for insert with check (auth.uid() = user_id);

create policy "bookmarks_update_own" on public.bookmarks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "bookmarks_delete_own" on public.bookmarks
  for delete using (auth.uid() = user_id);
