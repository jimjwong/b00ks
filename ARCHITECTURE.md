# Architecture

## Overview

b00ks is a TypeScript monorepo (pnpm + Turborepo) with two client
applications — a Next.js web app and an Expo mobile app — sharing
domain types, validation schemas, and design tokens. A Next.js server
(route handlers / server actions) is the only component that holds
privileged credentials (Supabase service role, Cloudflare R2 keys). All
book files live in a private Cloudflare R2 bucket, never in Supabase
Storage, and are only ever reachable through short-lived presigned URLs
issued after an explicit ownership check against Postgres.

```text
┌──────────────┐        ┌──────────────────┐        ┌──────────────────┐
│   apps/web    │◄──────►│  Next.js server   │◄──────►│  Supabase (auth,  │
│  (Next.js,    │  HTTP   │  route handlers /  │  RLS    │  Postgres, RLS)   │
│  React, EPUB.js│        │  packages/api      │        └──────────────────┘
│  PDF.js)       │        │                    │
└──────────────┘        │                    │        ┌──────────────────┐
                          │                    │◄──────►│  Cloudflare R2    │
┌──────────────┐        │                    │  S3 SDK │  (private bucket)  │
│  apps/mobile   │◄──────►│                    │        └──────────────────┘
│  (Expo, RN,    │  HTTP   └──────────────────┘
│  SQLite cache) │
└──────────────┘
```

## Why these choices

- **Supabase (Auth + Postgres + RLS)**: gives us email/password auth, email
  verification, password reset, and optional Google OAuth out of the box,
  backed by a real Postgres database where Row-Level Security gives us a
  second, independent layer of access control beneath the application code.
- **Cloudflare R2, not Supabase Storage**: R2's S3-compatible API plus egress
  pricing makes it the right fit for potentially large EPUB/PDF files, and
  keeping book bytes out of Postgres/Supabase Storage keeps the database
  small and fast. The bucket is private; every read or write goes through a
  presigned URL minted by the server after checking the requester owns the
  book.
- **Next.js App Router**: server components and route handlers let us keep
  privileged operations (presigned URL issuance, quota checks, metadata
  extraction) entirely server-side, while the reader itself renders
  client-side (EPUB.js / PDF.js need DOM/canvas access).
- **Expo + development builds**: Expo Router and the managed workflow give
  us fast iteration, but offline EPUB/PDF storage, SQLite, and SecureStore
  all require native modules unavailable in Expo Go — so the mobile app is
  designed around development builds from day one rather than retrofitted
  later.
- **Shared packages over duplicated logic**: `@b00ks/types` and
  `@b00ks/validation` are the single source of truth for what a `Book`,
  `ReadingProgress`, or upload request looks like — both the web app and the
  mobile app's API client import from here, so drift between platforms
  shows up as a type error, not a production bug.

## Data flow: upload

1. Client validates extension/MIME/size locally for fast feedback.
2. Client asks the server for an upload session (`POST /api/books/upload-session`).
3. Server authenticates the request, checks quota, creates a `books` row
   (`processing_status = 'pending_upload'`) and an `upload_jobs` row, then
   mints a random object key (`users/{userId}/books/{bookId}/original/{uuid}.ext`)
   — never derived from the original filename — and a short-lived presigned
   PUT URL.
4. Client uploads the file bytes directly to R2. The Next.js server never
   sees the file body.
5. Client reports completion (`POST /api/books/upload-session/complete`).
6. Server issues a HEAD request against R2 to confirm the object exists and
   matches the expected size/content-type, marks the upload job verified,
   and kicks off metadata/cover extraction.
7. Book status becomes `ready` (or `failed`, with `processing_error` set —
   the file itself remains downloadable even if metadata extraction fails).

## Data flow: reading

1. Reader requests a short-lived signed GET URL for the book's R2 object via
   a server endpoint that re-checks ownership on every call.
2. EPUB.js / PDF.js fetch and render the file client-side.
3. As the user reads, the client updates local state immediately and
   debounces remote writes to `reading_progress` (one row per user+book,
   guarded by an optimistic `version` counter) — see "Sync strategy" below.

## Sync strategy

- Local state updates instantly; nothing waits on the network for the page
  to turn.
- Remote saves are triggered by: a chapter/page change, a meaningful percent
  change, 10–20s of reading inactivity, the reader closing, or the app
  backgrounding — never on every single page turn.
- Each device tags its writes with a `device_id` and the `version` it last
  saw. If the server's row has moved on (another device wrote a newer
  version), the write is rejected with a conflict; the client then asks the
  user whether to continue from this device's location or the latest cloud
  location, rather than silently overwriting or silently discarding work.
- Offline writes queue locally (SQLite on mobile) and replay in order once
  connectivity returns, still subject to the same version check.

## Package boundaries

- `packages/types` — plain TypeScript types/interfaces. No runtime deps.
- `packages/validation` — Zod schemas built on top of `types`. Shared by
  client-side forms and server-side route handlers so validation never
  drifts between the two.
- `packages/database` — Supabase client factories (browser/server/admin)
  and the hand-maintained `Database` type mirroring the SQL migrations, plus
  row-to-domain mappers.
- `packages/api` — server-only business logic: the R2 client, upload
  session orchestration, ownership checks, export generation. Imported by
  Next.js route handlers; never imported into a client bundle.
- `packages/auth` — a thin wrapper over Supabase Auth, framework-agnostic so
  it can be driven by either a browser or server Supabase client.
- `packages/design-tokens` — colours, typography, spacing, radius, shadows,
  reader themes, shared by Tailwind config (web) and React Native styles
  (mobile).
- `packages/shared` — cross-cutting utilities: structured errors, a logger
  that redacts secrets/content by construction, formatting helpers, and the
  R2 object-key builders/ownership checks.
- `packages/config` — shared `tsconfig` bases and the flat ESLint config
  every package/app extends.

## Security model summary

Defence in depth, in this order:

1. **Authentication** on every protected route handler.
2. **Input validation** with the shared Zod schemas.
3. **Explicit ownership checks** in server code before any privileged
   action (signing a URL, deleting an object, returning data).
4. **Row-Level Security** in Postgres as an independent backstop — even a
   bug in (3) cannot let one user read or write another user's rows.
5. **Object keys are random UUIDs**, never user-supplied or filename-derived,
   and presigned URLs are short-lived and scoped to a single key.

Full detail in [docs/security/epub-threat-model.md](./docs/security/epub-threat-model.md).
