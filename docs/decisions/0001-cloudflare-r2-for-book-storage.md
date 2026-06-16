# 0001 — Cloudflare R2 for book storage, not Supabase Storage

## Status
Accepted

## Context
Books are arbitrary-size binary files (EPUB/PDF) owned privately by each
user. They need private storage, short-lived access URLs, and predictable
egress costs as the library grows.

## Decision
Store original files and derived assets (covers, future processed
artifacts) in a private Cloudflare R2 bucket, accessed via the S3-compatible
API. Supabase Postgres stores only metadata and a reference to the R2
object key — never the file bytes, and never via Supabase Storage.

## Consequences
- All reads/writes of file bytes go through presigned URLs minted
  server-side after an explicit ownership check in Postgres.
- R2 credentials never reach client code.
- Object keys are random UUIDs under `users/{userId}/books/{bookId}/...`,
  never derived from the original filename, so listing or guessing keys
  reveals nothing.
- Multipart upload support can be added later without changing this
  decision, since the S3-compatible API already supports it.
