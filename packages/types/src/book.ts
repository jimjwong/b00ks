export const BOOK_FORMATS = ["epub", "pdf"] as const;
export type BookFormat = (typeof BOOK_FORMATS)[number];

/**
 * Formats the architecture must support adding later without schema rework.
 * Not yet implemented — kept here so `format`/mime handling stays forward-compatible.
 */
export const FUTURE_BOOK_FORMATS = [
  "cbz",
  "cbr",
  "mobi",
  "azw3",
  "txt",
  "markdown",
  "audiobook",
] as const;

export const PROCESSING_STATUSES = [
  "pending_upload",
  "uploaded",
  "processing",
  "ready",
  "failed",
] as const;
export type ProcessingStatus = (typeof PROCESSING_STATUSES)[number];

export const METADATA_SOURCES = ["extracted", "user_edited", "mixed"] as const;
export type MetadataSource = (typeof METADATA_SOURCES)[number];

export interface Book {
  id: string;
  userId: string;
  title: string;
  subtitle: string | null;
  author: string | null;
  description: string | null;
  language: string | null;
  publisher: string | null;
  publishedDate: string | null;
  isbn: string | null;
  format: BookFormat;
  mimeType: string;
  originalFilename: string;
  fileSizeBytes: number;
  fileHash: string;
  r2ObjectKey: string;
  coverR2ObjectKey: string | null;
  processingStatus: ProcessingStatus;
  processingError: string | null;
  pageCount: number | null;
  wordCount: number | null;
  epubIdentifier: string | null;
  metadataSource: MetadataSource | null;
  createdAt: string;
  updatedAt: string;
  lastOpenedAt: string | null;
  archivedAt: string | null;
}

/** Book shape exposed to clients — never includes raw R2 object keys. */
export type BookSummary = Omit<Book, "r2ObjectKey" | "coverR2ObjectKey"> & {
  hasCover: boolean;
};
