import { z } from "zod";

export const createCollectionSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().max(1000).nullable().optional(),
});

export const updateCollectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(120).optional(),
  description: z.string().max(1000).nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export const deleteCollectionSchema = z.object({
  id: z.string().uuid(),
});

export const addBookToCollectionSchema = z.object({
  collectionId: z.string().uuid(),
  bookId: z.string().uuid(),
});

export const removeBookFromCollectionSchema = z.object({
  collectionId: z.string().uuid(),
  bookId: z.string().uuid(),
});
