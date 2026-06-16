/**
 * Warm, paper-inspired palette. Charcoal text, restrained terracotta accent —
 * no neon, no gradients. Values are plain hex so they translate directly
 * to Tailwind config (web) and React Native StyleSheets (mobile).
 */
export const colors = {
  paper: {
    50: "#fdfbf7",
    100: "#f8f3ea",
    200: "#f0e8d8",
    300: "#e3d5bc",
  },
  charcoal: {
    900: "#1f1c18",
    700: "#3a352d",
    500: "#5c554a",
    300: "#8a8175",
  },
  accent: {
    500: "#a4533c", // muted terracotta
    600: "#8a4530",
    700: "#6f3624",
  },
  semantic: {
    success: "#4f7a4b",
    danger: "#a23b3b",
    warning: "#b8842f",
    info: "#3d6b8a",
  },
  highlight: {
    yellow: "#f3d98c",
    green: "#bcd9b0",
    blue: "#aecbe0",
    pink: "#e5c0c9",
    purple: "#cdc0e0",
  },
} as const;

export const readerThemes = {
  light: {
    background: colors.paper[50],
    text: colors.charcoal[900],
    secondaryText: colors.charcoal[500],
  },
  sepia: {
    background: "#f1e7d0",
    text: "#3a2e1f",
    secondaryText: "#6b5b41",
  },
  dark: {
    background: "#1a1a18",
    text: "#e8e3d8",
    secondaryText: "#a8a298",
  },
} as const;

export type ReaderThemeName = keyof typeof readerThemes;
