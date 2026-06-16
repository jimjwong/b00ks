import type { Annotation, Book, BookSummary, Bookmark, Locator, ReadingProgress } from "@b00ks/types";
import type { Database } from "./database.types";

type BookRow = Database["public"]["Tables"]["books"]["Row"];
type ReadingProgressRow = Database["public"]["Tables"]["reading_progress"]["Row"];
type BookmarkRow = Database["public"]["Tables"]["bookmarks"]["Row"];
type AnnotationRow = Database["public"]["Tables"]["annotations"]["Row"];

export function mapBookRow(row: BookRow): Book {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    subtitle: row.subtitle,
    author: row.author,
    description: row.description,
    language: row.language,
    publisher: row.publisher,
    publishedDate: row.published_date,
    isbn: row.isbn,
    format: row.format,
    mimeType: row.mime_type,
    originalFilename: row.original_filename,
    fileSizeBytes: row.file_size_bytes,
    fileHash: row.file_hash,
    r2ObjectKey: row.r2_object_key,
    coverR2ObjectKey: row.cover_r2_object_key,
    processingStatus: row.processing_status,
    processingError: row.processing_error,
    pageCount: row.page_count,
    wordCount: row.word_count,
    epubIdentifier: row.epub_identifier,
    metadataSource: row.metadata_source,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastOpenedAt: row.last_opened_at,
    archivedAt: row.archived_at,
  };
}

/** Strips raw R2 keys before a book ever reaches an API response. */
export function mapBookRowToSummary(row: BookRow): BookSummary {
  const book = mapBookRow(row);
  const { r2ObjectKey: _r2ObjectKey, coverR2ObjectKey, ...rest } = book;
  return { ...rest, hasCover: Boolean(coverR2ObjectKey) };
}

export function mapReadingProgressRow(row: ReadingProgressRow): ReadingProgress {
  return {
    id: row.id,
    userId: row.user_id,
    bookId: row.book_id,
    format: row.format,
    locator: row.locator_json as unknown as Locator,
    percentage: Number(row.percentage),
    currentPage: row.current_page,
    totalPages: row.total_pages,
    currentChapter: row.current_chapter,
    deviceId: row.device_id ?? "",
    version: row.version,
    updatedAt: row.updated_at,
  };
}

export function mapBookmarkRow(row: BookmarkRow): Bookmark {
  return {
    id: row.id,
    userId: row.user_id,
    bookId: row.book_id,
    locator: row.locator_json as unknown as Locator,
    label: row.label,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapAnnotationRow(row: AnnotationRow): Annotation {
  return {
    id: row.id,
    userId: row.user_id,
    bookId: row.book_id,
    annotationType: row.annotation_type,
    locator: row.locator_json as unknown as Locator,
    selectedText: row.selected_text,
    prefixText: row.prefix_text,
    suffixText: row.suffix_text,
    note: row.note,
    color: row.color,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    deletedAt: row.deleted_at,
  };
}
