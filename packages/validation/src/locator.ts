import { z } from "zod";

export const epubLocatorSchema = z.object({
  type: z.literal("epub-cfi"),
  cfi: z.string().min(1).max(2000),
  chapterHref: z.string().max(500).optional(),
});

export const pdfLocatorSchema = z.object({
  type: z.literal("pdf-page"),
  page: z.number().int().min(1),
  zoom: z.number().min(0.1).max(10).optional(),
  scrollTop: z.number().min(0).optional(),
});

export const locatorSchema = z.discriminatedUnion("type", [epubLocatorSchema, pdfLocatorSchema]);
