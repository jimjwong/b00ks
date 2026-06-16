import { z } from "zod";
import { ALLOWED_MIME_TYPES, FILE_HASH_REGEX } from "./constants";

export const createUploadSessionSchema = z.object({
  filename: z
    .string()
    .min(1)
    .max(255)
    .refine((name) => !name.includes("/") && !name.includes("\\"), {
      message: "Filename must not contain path separators",
    }),
  mimeType: z.enum(Object.keys(ALLOWED_MIME_TYPES) as [string, ...string[]], {
    message: "Unsupported file type. Only EPUB and PDF are supported.",
  }),
  sizeBytes: z.number().int().positive(),
  fileHash: z.string().regex(FILE_HASH_REGEX, "fileHash must be a sha-256 hex digest"),
});

export const completeUploadSchema = z.object({
  uploadJobId: z.string().uuid(),
});

export const retryProcessingSchema = z.object({
  bookId: z.string().uuid(),
});
