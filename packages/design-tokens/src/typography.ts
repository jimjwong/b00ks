export const fontFamilies = {
  editorialSerif: "'Literata', 'Source Serif 4', Georgia, serif",
  sourceSerif: "'Source Serif 4', Georgia, serif",
  interfaceSans: "'Inter', 'Geist', -apple-system, system-ui, sans-serif",
  system: "-apple-system, system-ui, sans-serif",
} as const;

export const readerFontStacks = {
  literata: fontFamilies.editorialSerif,
  "source-serif": fontFamilies.sourceSerif,
  inter: fontFamilies.interfaceSans,
  system: fontFamilies.system,
} as const;

export const fontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
} as const;

export const readerFontSizeSteps = [14, 16, 18, 20, 22, 24, 28, 32] as const;
export const readerLineHeightSteps = [1.3, 1.5, 1.7, 1.9, 2.1] as const;

export const fontWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;
