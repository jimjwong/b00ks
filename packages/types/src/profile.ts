export const READER_THEMES = ["light", "sepia", "dark"] as const;
export type ReaderTheme = (typeof READER_THEMES)[number];

export const FONT_FAMILIES = ["literata", "source-serif", "inter", "system"] as const;
export type FontFamily = (typeof FONT_FAMILIES)[number];

export interface Profile {
  id: string;
  displayName: string | null;
  avatarUrl: string | null;
  onboardingCompleted: boolean;
  preferredTheme: ReaderTheme;
  preferredFontFamily: FontFamily;
  createdAt: string;
  updatedAt: string;
}

export interface UserStorageUsage {
  userId: string;
  usedBytes: number;
  bookCount: number;
  updatedAt: string;
}
