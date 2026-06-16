import { z } from "zod";
import { locatorSchema } from "./locator";

export const saveReadingProgressSchema = z.object({
  bookId: z.string().uuid(),
  format: z.enum(["epub", "pdf"]),
  locator: locatorSchema,
  percentage: z.number().min(0).max(100),
  currentPage: z.number().int().min(1).nullable().optional(),
  totalPages: z.number().int().min(1).nullable().optional(),
  currentChapter: z.string().max(500).nullable().optional(),
  deviceId: z.string().uuid(),
  /** Optimistic-concurrency token: the version this update is based on. */
  baseVersion: z.number().int().min(0),
});

export const createBookmarkSchema = z.object({
  bookId: z.string().uuid(),
  locator: locatorSchema,
  label: z.string().max(200).nullable().optional(),
});

export const updateBookmarkSchema = z.object({
  id: z.string().uuid(),
  label: z.string().max(200).nullable().optional(),
});

export const createAnnotationSchema = z.object({
  bookId: z.string().uuid(),
  annotationType: z.enum(["highlight", "note"]),
  locator: locatorSchema,
  selectedText: z.string().max(10_000).nullable().optional(),
  prefixText: z.string().max(500).nullable().optional(),
  suffixText: z.string().max(500).nullable().optional(),
  note: z.string().max(10_000).nullable().optional(),
  color: z.enum(["yellow", "green", "blue", "pink", "purple"]).nullable().optional(),
});

export const updateAnnotationSchema = z.object({
  id: z.string().uuid(),
  note: z.string().max(10_000).nullable().optional(),
  color: z.enum(["yellow", "green", "blue", "pink", "purple"]).nullable().optional(),
});

export const registerDeviceSchema = z.object({
  deviceName: z.string().min(1).max(120),
  platform: z.enum(["web", "ios", "android"]),
  appVersion: z.string().max(50).nullable().optional(),
});
