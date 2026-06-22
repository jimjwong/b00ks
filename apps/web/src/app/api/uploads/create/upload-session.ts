import type { CreateUploadSessionResponse } from "@b00ks/types";
import { createUploadSessionSchema, ALLOWED_MIME_TYPES } from "@b00ks/validation";

interface UserLike {
  id: string;
}

interface QueryResult<T> {
  data: T | null;
  error: { message: string } | null;
}

interface TableQuery {
  select(columns?: string): TableQuery;
  eq(column: string, value: unknown): TableQuery;
  is(column: string, value: unknown): TableQuery;
  maybeSingle<T>(): Promise<QueryResult<T>>;
  insert(values: unknown): { select(columns?: string): { single<T>(): Promise<QueryResult<T>> } };
}

export interface AdminClientLike {
  from(table: "books" | "upload_jobs"): TableQuery;
}

interface R2ClientLike {
  createUploadUrl(objectKey: string, contentType: string, expiresInSeconds: number): Promise<string>;
}

export interface CreateUploadSessionDependencies {
  user: UserLike;
  adminClient: AdminClientLike;
  r2Client: R2ClientLike;
  now?: () => Date;
  randomUUID?: () => string;
}

export type CreateUploadSessionResult =
  | { status: 201; body: CreateUploadSessionResponse }
  | { status: 400; body: { error: string } }
  | { status: 409; body: { duplicateOfBookId: string } }
  | { status: 500; body: { error: string } };

const UPLOAD_URL_EXPIRES_IN_SECONDS = 15 * 60;

function titleFromFilename(filename: string) {
  const withoutExtension = filename.replace(/\.[^.]+$/, "").trim();
  return withoutExtension || filename;
}

function buildOriginalObjectKey(userId: string, bookId: string, objectId: string, format: "epub" | "pdf") {
  return `users/${userId}/books/${bookId}/original/${objectId}.${format}`;
}

function getExpiry(now: () => Date) {
  return new Date(now().getTime() + UPLOAD_URL_EXPIRES_IN_SECONDS * 1000).toISOString();
}

export async function createUploadSession(
  input: unknown,
  deps: CreateUploadSessionDependencies,
): Promise<CreateUploadSessionResult> {
  const parsed = createUploadSessionSchema.safeParse(input);
  if (!parsed.success) {
    return { status: 400, body: { error: parsed.error.issues[0]?.message ?? "Invalid upload payload" } };
  }

  const request = parsed.data;
  const format = ALLOWED_MIME_TYPES[request.mimeType] ?? "pdf";
  const now = deps.now ?? (() => new Date());
  const randomUUID = deps.randomUUID ?? (() => crypto.randomUUID());

  const duplicateResult = await deps.adminClient
    .from("books")
    .select("id")
    .eq("user_id", deps.user.id)
    .eq("file_hash", request.fileHash)
    .is("archived_at", null)
    .maybeSingle<{ id: string }>();

  if (duplicateResult.error) {
    return { status: 500, body: { error: duplicateResult.error.message } };
  }

  if (duplicateResult.data) {
    return { status: 409, body: { duplicateOfBookId: duplicateResult.data.id } };
  }

  const bookId = randomUUID();
  const objectKey = buildOriginalObjectKey(deps.user.id, bookId, randomUUID(), format);
  const expiresAt = getExpiry(now);

  const bookResult = await deps.adminClient
    .from("books")
    .insert({
      id: bookId,
      user_id: deps.user.id,
      title: titleFromFilename(request.filename),
      format,
      mime_type: request.mimeType,
      original_filename: request.filename,
      file_size_bytes: request.sizeBytes,
      file_hash: request.fileHash,
      r2_object_key: objectKey,
      processing_status: "pending_upload",
    })
    .select("id")
    .single<{ id: string }>();

  if (bookResult.error || !bookResult.data) {
    return { status: 500, body: { error: bookResult.error?.message ?? "Failed to create book" } };
  }

  const uploadJobResult = await deps.adminClient
    .from("upload_jobs")
    .insert({
      user_id: deps.user.id,
      book_id: bookResult.data.id,
      object_key: objectKey,
      expected_size_bytes: request.sizeBytes,
      expected_mime_type: request.mimeType,
      status: "pending",
      expires_at: expiresAt,
    })
    .select("id, expires_at")
    .single<{ id: string; expires_at: string }>();

  if (uploadJobResult.error || !uploadJobResult.data) {
    return { status: 500, body: { error: uploadJobResult.error?.message ?? "Failed to create upload job" } };
  }

  const uploadUrl = await deps.r2Client.createUploadUrl(
    objectKey,
    request.mimeType,
    UPLOAD_URL_EXPIRES_IN_SECONDS,
  );

  return {
    status: 201,
    body: {
      bookId: bookResult.data.id,
      uploadJobId: uploadJobResult.data.id,
      uploadUrl,
      objectKey,
      expiresAt: uploadJobResult.data.expires_at,
    },
  };
}
