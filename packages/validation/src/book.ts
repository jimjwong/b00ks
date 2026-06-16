import { z } from "zod";

export const updateBookMetadataSchema = z.object({
  bookId: z.string().uuid(),
  title: z.string().min(1).max(500).optional(),
  subtitle: z.string().max(500).nullable().optional(),
  author: z.string().max(500).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  language: z.string().max(20).nullable().optional(),
  publisher: z.string().max(300).nullable().optional(),
  publishedDate: z.string().max(50).nullable().optional(),
  isbn: z.string().max(30).nullable().optional(),
});

export const archiveBookSchema = z.object({
  bookId: z.string().uuid(),
  archived: z.boolean(),
});

export const deleteBookSchema = z.object({
  bookId: z.string().uuid(),
  confirm: z.literal(true),
});

export const librarySortSchema = z.enum([
  "recently_opened",
  "recently_added",
  "title",
  "author",
  "progress",
  "file_size",
]);

export const libraryFilterSchema = z.enum([
  "all",
  "currently_reading",
  "recently_added",
  "recently_opened",
  "finished",
  "unread",
  "archived",
]);

export const listBooksQuerySchema = z.object({
  search: z.string().max(200).optional(),
  filter: libraryFilterSchema.default("all"),
  sort: librarySortSchema.default("recently_added"),
  collectionId: z.string().uuid().optional(),
  cursor: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(40),
});
