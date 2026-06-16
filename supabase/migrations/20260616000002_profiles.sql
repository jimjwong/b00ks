create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url text,
  onboarding_completed boolean not null default false,
  preferred_theme text not null default 'light' check (preferred_theme in ('light', 'sepia', 'dark')),
  preferred_font_family text not null default 'literata'
    check (preferred_font_family in ('literata', 'source-serif', 'inter', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Inserts happen only via the handle_new_user trigger (security definer), never directly.

-- Automatically create a profile (and zeroed storage usage row) when a user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id);
  insert into public.user_storage_usage (user_id) values (new.id);
  return new;
end;
$$;
