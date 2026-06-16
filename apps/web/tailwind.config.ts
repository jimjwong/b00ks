import type { Config } from "tailwindcss";
import { colors, fontFamilies, spacing, radius } from "@b00ks/design-tokens";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: colors.paper,
        charcoal: colors.charcoal,
        accent: colors.accent,
        success: colors.semantic.success,
        danger: colors.semantic.danger,
        warning: colors.semantic.warning,
        info: colors.semantic.info,
        highlight: colors.highlight,
      },
      fontFamily: {
        serif: fontFamilies.editorialSerif.split(", "),
        sans: fontFamilies.interfaceSans.split(", "),
      },
      spacing,
      borderRadius: radius,
    },
  },
  plugins: [],
};

export default config;
