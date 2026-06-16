# b00ks

**Your books. Every device.**

b00ks is a private personal cloud library and reading application. Upload EPUB
and PDF books you legally own, store them privately, and read them on the
web, iPhone, iPad, or Android — continuing from the same spot on every
device. b00ks is not a bookstore and does not sell books. It is not a closed
ecosystem: you can download your original files and export your reading data
at any time.

## Core principles

1. Users own their files.
2. Users can download their original files at any time.
3. Users can export their reading data.
4. Books are private by default.
5. Reading progress synchronises across devices.
6. Mobile users can download books for offline reading.
7. The interface should feel calm, literary and premium.

## Repository layout

```text
b00ks/
├── apps/
│   ├── web/             Next.js web application (App Router)
│   └── mobile/           Expo / React Native application
├── packages/
│   ├── api/              Server-side business logic (R2, upload pipeline, etc.)
│   ├── auth/              Supabase Auth wrapper
│   ├── database/          Supabase clients + generated types + row mappers
│   ├── design-tokens/      Colours, typography, spacing, reader themes
│   ├── shared/            Cross-cutting utilities (errors, logging, object keys)
│   ├── types/              Shared domain TypeScript types
│   ├── validation/         Zod schemas shared by client and server
│   └── config/            Shared tsconfig/eslint config
├── supabase/
│   ├── migrations/         SQL migrations (schema + RLS policies)
│   └── seed.sql
└── docs/
    ├── decisions/           Architecture decision records
    ├── setup/                Local development setup guides
    └── security/             Threat models and security notes
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the technical architecture,
[PROJECT_PLAN.md](./PROJECT_PLAN.md) for the phased delivery plan, and
[TASKS.md](./TASKS.md) for live progress.

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 10+ (`corepack enable` will install the pinned version automatically)
- [Supabase CLI](https://supabase.com/docs/guides/cli) for local Postgres + Auth
- A Cloudflare R2 bucket (private) and API token for uploads/downloads
- For mobile: Expo CLI and an iOS/Android development build (Expo Go is not
  used in production because native modules are required)

### Install

```bash
pnpm install
```

### Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the Supabase and Cloudflare R2 values — see `.env.example` for which
variables are public vs. server-only. Never commit `.env.local`.

### Run Supabase locally

```bash
pnpm dlx supabase start
pnpm dlx supabase db reset   # applies supabase/migrations + seed.sql
```

### Run the web app

```bash
pnpm --filter @b00ks/web dev
```

### Run the mobile app

```bash
pnpm --filter @b00ks/mobile start
```

Requires an Expo development build (`expo run:ios` / `expo run:android`)
rather than Expo Go, since b00ks depends on native filesystem, SQLite, and
secure-storage modules.

### Lint, typecheck, test

```bash
pnpm lint
pnpm typecheck
pnpm test
```

## Security

b00ks treats uploaded EPUB/PDF files as untrusted input and stores all books
privately in Cloudflare R2, accessed only via short-lived presigned URLs
issued after a server-side ownership check. See
[docs/security/epub-threat-model.md](./docs/security/epub-threat-model.md)
for the EPUB-specific threat model.

b00ks supports DRM-free EPUB and PDF files that you have the legal right to
upload. It does not implement, and will not implement, DRM circumvention.
