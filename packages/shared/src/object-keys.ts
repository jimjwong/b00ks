import type { BookFormat } from "@b00ks/types";

const EXTENSION_BY_FORMAT: Record<BookFormat, string> = {
  epub: "epub",
  pdf: "pdf",
};

/** Builds the private R2 key for an original book upload. Never derived from user input. */
export function buildOriginalObjectKey(userId: string, bookId: string, format: BookFormat): string {
  const uuid = crypto.randomUUID();
  return `users/${userId}/books/${bookId}/original/${uuid}.${EXTENSION_BY_FORMAT[format]}`;
}

export function buildCoverObjectKey(userId: string, bookId: string): string {
  const uuid = crypto.randomUUID();
  return `users/${userId}/books/${bookId}/cover/${uuid}.jpg`;
}

export function buildDerivedObjectKey(userId: string, bookId: string, assetName: string): string {
  const safeAssetName = assetName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `users/${userId}/books/${bookId}/derived/${safeAssetName}`;
}

/** Confirms an object key belongs to the given user before any signing/deletion happens. */
export function assertObjectKeyOwnership(objectKey: string, userId: string): boolean {
  return objectKey.startsWith(`users/${userId}/books/`);
}
