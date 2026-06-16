# Local development setup

## 1. Install dependencies

```bash
corepack enable
pnpm install
```

## 2. Environment variables

```bash
cp .env.example .env.local
```

| Variable | Public? | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | yes | Base URL of the web app |
| `NEXT_PUBLIC_SUPABASE_URL` | yes | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | yes | RLS enforces real access control |
| `SUPABASE_SERVICE_ROLE_KEY` | **no** | Bypasses RLS — server only |
| `CLOUDFLARE_ACCOUNT_ID` / `R2_*` | **no** | Server only — never imported into client code |
| `MAX_UPLOAD_SIZE_BYTES` / `DEFAULT_USER_STORAGE_QUOTA_BYTES` | **no** | Server-enforced limits |
| `EXPO_PUBLIC_*` | yes | Bundled into the Expo client |

## 3. Run Supabase locally

Requires Docker and the Supabase CLI.

```bash
pnpm dlx supabase start
pnpm dlx supabase db reset
```

This applies every file in `supabase/migrations/` in order, then
`supabase/seed.sql`. Copy the local `anon`/`service_role` keys printed by
`supabase start` into `.env.local`.

## 4. Create a Cloudflare R2 bucket

1. Create a private bucket in the Cloudflare dashboard.
2. Create an R2 API token scoped to that bucket only.
3. Fill in `CLOUDFLARE_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`,
   `R2_BUCKET_NAME`, `R2_ENDPOINT` in `.env.local`. Do not enable public
   bucket access — every read goes through a server-signed URL.

## 5. Run the apps

```bash
pnpm --filter @b00ks/web dev
pnpm --filter @b00ks/mobile start
```

The mobile app requires an Expo development build, not Expo Go:

```bash
pnpm --filter @b00ks/mobile exec expo run:ios
pnpm --filter @b00ks/mobile exec expo run:android
```

## 6. Verify

```bash
pnpm lint
pnpm typecheck
pnpm test
```
