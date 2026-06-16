export const spacing = {
  0: "0px",
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
} as const;

export const radius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  full: "9999px",
} as const;

export const shadows = {
  sm: "0 1px 2px rgba(31, 28, 24, 0.06)",
  md: "0 2px 8px rgba(31, 28, 24, 0.08)",
  lg: "0 8px 24px rgba(31, 28, 24, 0.12)",
} as const;

/** Minimum touch target size per WCAG/Apple/Material guidance. */
export const touchTarget = {
  minSize: "44px",
} as const;
