# 0002 — Supabase for authentication and database

## Status
Accepted

## Context
b00ks needs email/password auth with verification and reset, persistent
sessions across web and mobile, and a relational database with row-level
access control strong enough to be a real second line of defence — not just
the UI hiding things it shouldn't show.

## Decision
Use Supabase Auth for authentication (with optional Google OAuth) and
Supabase Postgres for all relational data, with Row-Level Security enabled
on every user-owned table.

## Consequences
- Session handling on web uses `@supabase/ssr` so cookies, refresh, and
  server components all work consistently.
- Every table holding user data needs RLS policies before it ships — this
  is enforced by review and by RLS integration tests (Phase 2), not by
  convention alone.
- Service-role access (which bypasses RLS) is confined to
  `packages/database`'s admin client factory and only ever instantiated in
  server-only code paths.
