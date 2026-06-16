create table public.user_storage_usage (
  user_id uuid primary key references auth.users (id) on delete cascade,
  used_bytes bigint not null default 0,
  book_count integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.user_storage_usage enable row level security;

-- Read-only to the owning user. Only server code (service role) recalculates
-- and writes usage, so client-reported numbers can never be trusted.
create policy "user_storage_usage_select_own" on public.user_storage_usage
  for select using (auth.uid() = user_id);

-- Now that every referenced table exists, wire up the new-user trigger.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Recomputes used_bytes/book_count for one user from the books table.
-- Intended to be called by trusted server code (service role) after uploads,
-- deletions, or archive/restore operations.
create or replace function public.recalculate_storage_usage(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_storage_usage (user_id, used_bytes, book_count, updated_at)
  select
    target_user_id,
    coalesce(sum(file_size_bytes), 0),
    count(*),
    now()
  from public.books
  where user_id = target_user_id
    and archived_at is null
    and processing_status <> 'failed'
  on conflict (user_id) do update set
    used_bytes = excluded.used_bytes,
    book_count = excluded.book_count,
    updated_at = excluded.updated_at;
end;
$$;
