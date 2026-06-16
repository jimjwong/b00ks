import { z } from "zod";

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(120).nullable().optional(),
  avatarUrl: z.string().url().nullable().optional(),
  onboardingCompleted: z.boolean().optional(),
  preferredTheme: z.enum(["light", "sepia", "dark"]).optional(),
  preferredFontFamily: z.enum(["literata", "source-serif", "inter", "system"]).optional(),
});

export const exportAnnotationsSchema = z.object({
  bookId: z.string().uuid().optional(),
  format: z.enum(["markdown", "json", "csv"]),
});

export const deleteAccountSchema = z.object({
  confirm: z.literal(true),
  /** Re-entered to guard against accidental/forced deletion via a stolen session. */
  confirmationPhrase: z.literal("DELETE MY ACCOUNT"),
});
