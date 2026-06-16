create table public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index collections_user_id_idx on public.collections (user_id, sort_order);

create trigger collections_set_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

alter table public.collections enable row level security;

create policy "collections_select_own" on public.collections
  for select using (auth.uid() = user_id);

create policy "collections_insert_own" on public.collections
  for insert with check (auth.uid() = user_id);

create policy "collections_update_own" on public.collections
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "collections_delete_own" on public.collections
  for delete using (auth.uid() = user_id);
