# Tasks

Status legend: `[ ]` not started · `[~]` in progress · `[x]` done

Last updated: 2026-06-16

## Phase 1 — Foundation
- [x] Inspect repository (empty — no prior code, no conflicts)
- [x] pnpm workspace + Turborepo config
- [x] Root strict TypeScript base config
- [x] Shared ESLint flat config (`packages/config`)
- [x] `packages/types` — domain types (book, reading, collection, profile, upload, api)
- [x] `packages/validation` — Zod schemas mirroring the types
- [x] `packages/shared` — errors, request id, redacting logger, formatting, object-key helpers
- [x] `packages/design-tokens` — colours, typography, spacing/radius/shadows, reader themes
- [x] `packages/database` — Supabase browser/server/admin client factories, hand-maintained `Database` type, row mappers
- [x] `packages/auth` — framework-agnostic Supabase Auth wrapper
- [x] `packages/api` — R2 client (more business logic lands in Phase 3)
- [x] Core docs: README, ARCHITECTURE, PROJECT_PLAN, TASKS, `.env.example`
- [x] `docs/security/epub-threat-model.md`
- [ ] `docs/decisions/` ADRs (mobile PDF rendering decision deferred to Phase 7)
- [x] `docs/setup/local-development.md`
- [ ] Scaffold `apps/web` (Next.js App Router)
- [ ] Scaffold `apps/mobile` (Expo Router)
- [ ] `pnpm install` clean, lint + typecheck passing across all packages

## Phase 2 — Authentication and database
- [x] SQL migrations: profiles, devices, books, upload_jobs, reading_progress,
      bookmarks, annotations, collections, collection_books, reading_sessions,
      user_storage_usage — all with RLS
- [ ] Register / verify / login / logout / reset password pages
- [ ] Protected route middleware + session refresh
- [ ] Account deletion endpoint
- [ ] Google OAuth (optional, config-gated)
- [ ] Onboarding flow (5 steps)
- [ ] RLS integration tests proving cross-user isolation

## Phase 3 — Upload pipeline
- [ ] Upload-session API (`packages/api`)
- [ ] Complete-upload verification (HEAD check)
- [ ] Quota + duplicate-hash checks
- [ ] Web upload UI (progress, cancel, retry)

## Phase 4 — Metadata and library
- [ ] EPUB metadata/cover extraction
- [ ] PDF metadata/cover extraction
- [ ] Library UI (grid/list, search, filter, sort)
- [ ] Book details page + manual metadata editing

## Phase 5 — Web readers
- [ ] EPUB.js reader
- [ ] PDF.js reader
- [ ] Reader settings, bookmarks, in-book search, keyboard shortcuts
- [ ] Progress sync + reading-session tracking

## Phase 6 — Collections and annotations
- [ ] Collections CRUD + starter collections
- [ ] Highlights and notes
- [ ] Annotation browsing/search/export

## Phase 7 — Mobile application
- [ ] Expo app auth, library, book details
- [ ] Mobile EPUB/PDF reader
- [ ] `docs/decisions/mobile-pdf-rendering.md`

## Phase 8 — Offline reading
- [ ] Downloads, SQLite cache, sync queue, conflict handling

## Phase 9 — Privacy and portability
- [ ] Original downloads, account export, account deletion, storage reporting

## Phase 10 — Production quality
- [ ] Accessibility, performance, full test suite, observability, deployment docs
- [ ] Replace CSP `script-src 'unsafe-inline'` with nonce-based CSP via middleware

---

### Notes for future sessions
- Database types in `packages/database/src/database.types.ts` are
  hand-written to mirror `supabase/migrations/*.sql`. Regenerate with the
  Supabase CLI once a local instance exists, but keep the file's header
  comment.
- No app code has run yet — `pnpm install` / lint / typecheck have not been
  verified end-to-end as of this update. That is the next concrete step.
