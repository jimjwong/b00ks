create table public.devices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  device_name text not null,
  platform text not null check (platform in ('web', 'ios', 'android')),
  app_version text,
  last_seen_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index devices_user_id_idx on public.devices (user_id);

alter table public.devices enable row level security;

create policy "devices_select_own" on public.devices
  for select using (auth.uid() = user_id);

create policy "devices_insert_own" on public.devices
  for insert with check (auth.uid() = user_id);

create policy "devices_update_own" on public.devices
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "devices_delete_own" on public.devices
  for delete using (auth.uid() = user_id);
