# Project plan

This plan tracks the ten development phases from the product brief. Live,
granular status lives in [TASKS.md](./TASKS.md) — this file describes scope
and the definition of done for each phase.

## Phase 1 — Foundation
pnpm + Turborepo monorepo, strict TypeScript, shared packages
(`types`, `validation`, `shared`, `design-tokens`, `config`, `database`,
`auth`, `api` scaffolding), Supabase client factories, Cloudflare R2 client,
and the core docs (this file, README, ARCHITECTURE, TASKS, `.env.example`,
`docs/decisions`, `docs/security`).

## Phase 2 — Authentication and database
Email/password registration with verification, login, logout, password
reset, persistent sessions, protected routes, session refresh, account
deletion, optional Google OAuth. Full SQL schema with RLS on every
user-owned table. Onboarding flow (welcome → formats → privacy/ownership →
upload first book → open reader).

## Phase 3 — Upload pipeline
Client-side validation, upload-session API, presigned R2 PUT, progress/
cancel/retry, server-side HEAD verification, duplicate detection via file
hash, configurable size limit and quota.

## Phase 4 — Metadata and library
EPUB/PDF metadata + cover extraction (failure-tolerant), manual metadata
editing, responsive library (grid/list, search, filters, sort), book
details page.

## Phase 5 — Web readers
EPUB.js reader and PDF.js reader, reader settings (font, size, line height,
margins, alignment, theme), bookmarks, in-book search, keyboard shortcuts,
progress sync, reading-session tracking.

## Phase 6 — Collections and annotations
Collections CRUD + starter collections, highlights and notes, annotation
browsing/search/navigation, export (Markdown/JSON/CSV).

## Phase 7 — Mobile application
Expo app: auth, library, book details, EPUB/PDF reader, progress sync.
Built around development builds, not Expo Go.

## Phase 8 — Offline reading
Mobile downloads with progress/cancel/retry, SQLite-backed offline
metadata and sync queue, Wi-Fi-only setting, integrity verification,
storage management, conflict handling on reconnect.

## Phase 9 — Privacy and portability
Original file downloads, full account data export (JSON), account
deletion, server-calculated storage reporting, security hardening pass.

## Phase 10 — Production quality
Accessibility (WCAG AA), performance, the full test suite (Vitest, RTL,
Playwright, RLS integration tests, Expo/RN tests), observability,
deployment documentation.

## Definition of done (MVP)

A new user can register and verify an account, upload an EPUB or PDF to
private R2 storage, see extracted metadata and a cover, open and read the
book on the web, save and resume their location on another device, add
bookmarks/highlights/notes, organise books into collections, download a
book for offline mobile reading, read it offline, sync changes after
reconnecting, download the original file, export their reading data, and
delete books or their account — with TypeScript compiling cleanly, lint
passing, critical tests passing, RLS verified to block cross-user access,
no secret in any client bundle, and no private R2 object publicly
reachable.
