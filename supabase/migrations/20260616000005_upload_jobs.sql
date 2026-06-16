create table public.upload_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  object_key text not null,
  expected_size_bytes bigint not null check (expected_size_bytes > 0),
  expected_mime_type text not null,
  status text not null default 'pending'
    check (status in ('pending', 'uploaded', 'verified', 'failed', 'expired')),
  expires_at timestamptz not null,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create index upload_jobs_user_id_idx on public.upload_jobs (user_id);
create index upload_jobs_book_id_idx on public.upload_jobs (book_id);
create index upload_jobs_status_expires_idx on public.upload_jobs (status, expires_at);

alter table public.upload_jobs enable row level security;

-- Users may only read their own upload jobs. All writes happen via the
-- service role from trusted server code, never directly from the client.
create policy "upload_jobs_select_own" on public.upload_jobs
  for select using (auth.uid() = user_id);
