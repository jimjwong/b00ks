import type { BookFormat } from "./book";

/** A durable, format-specific reading location. */
export type EpubLocator = {
  type: "epub-cfi";
  cfi: string;
  chapterHref?: string;
};

export type PdfLocator = {
  type: "pdf-page";
  page: number;
  zoom?: number;
  scrollTop?: number;
};

export type Locator = EpubLocator | PdfLocator;

export interface ReadingProgress {
  id: string;
  userId: string;
  bookId: string;
  format: BookFormat;
  locator: Locator;
  percentage: number;
  currentPage: number | null;
  totalPages: number | null;
  currentChapter: string | null;
  deviceId: string;
  version: number;
  updatedAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  bookId: string;
  locator: Locator;
  label: string | null;
  createdAt: string;
  updatedAt: string;
}

export const ANNOTATION_TYPES = ["highlight", "note"] as const;
export type AnnotationType = (typeof ANNOTATION_TYPES)[number];

export const ANNOTATION_COLORS = ["yellow", "green", "blue", "pink", "purple"] as const;
export type AnnotationColor = (typeof ANNOTATION_COLORS)[number];

export interface Annotation {
  id: string;
  userId: string;
  bookId: string;
  annotationType: AnnotationType;
  locator: Locator;
  selectedText: string | null;
  prefixText: string | null;
  suffixText: string | null;
  note: string | null;
  color: AnnotationColor | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface ReadingSession {
  id: string;
  userId: string;
  bookId: string;
  deviceId: string;
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
  startPercentage: number | null;
  endPercentage: number | null;
}

export interface Device {
  id: string;
  userId: string;
  deviceName: string;
  platform: "web" | "ios" | "android";
  appVersion: string | null;
  lastSeenAt: string;
  createdAt: string;
}
