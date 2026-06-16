create table public.collection_books (
  collection_id uuid not null references public.collections (id) on delete cascade,
  book_id uuid not null references public.books (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  added_at timestamptz not null default now(),
  primary key (collection_id, book_id)
);

create index collection_books_user_id_idx on public.collection_books (user_id);
create index collection_books_book_id_idx on public.collection_books (book_id);

alter table public.collection_books enable row level security;

create policy "collection_books_select_own" on public.collection_books
  for select using (auth.uid() = user_id);

-- A user can only link their own collection to their own book — this is the
-- defence-in-depth check that stops one user attaching another user's book.
create policy "collection_books_insert_own" on public.collection_books
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.collections c
      where c.id = collection_id and c.user_id = auth.uid()
    )
    and exists (
      select 1 from public.books b
      where b.id = book_id and b.user_id = auth.uid()
    )
  );

create policy "collection_books_delete_own" on public.collection_books
  for delete using (auth.uid() = user_id);
