create table public.annotations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  annotation_type text not null check (annotation_type in ('highlight', 'note')),
  locator_json jsonb not null,
  selected_text text,
  prefix_text text,
  suffix_text text,
  note text,
  color text check (color in ('yellow', 'green', 'blue', 'pink', 'purple')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index annotations_user_book_idx on public.annotations (user_id, book_id);
create index annotations_user_active_idx on public.annotations (user_id) where deleted_at is null;
create index annotations_selected_text_trgm_idx
  on public.annotations using gin (selected_text gin_trgm_ops);

create trigger annotations_set_updated_at
  before update on public.annotations
  for each row execute function public.set_updated_at();

alter table public.annotations enable row level security;

create policy "annotations_select_own" on public.annotations
  for select using (auth.uid() = user_id);

create policy "annotations_insert_own" on public.annotations
  for insert with check (auth.uid() = user_id);

create policy "annotations_update_own" on public.annotations
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "annotations_delete_own" on public.annotations
  for delete using (auth.uid() = user_id);
