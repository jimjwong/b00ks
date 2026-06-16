// @ts-check
const tseslint = require("typescript-eslint");
const js = require("@eslint/js");

/** Shared ESLint flat config used by every app and package in the monorepo. */
module.exports = [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/consistent-type-imports": "warn",
    },
  },
  {
    ignores: ["dist/**", ".next/**", "node_modules/**", ".expo/**", "build/**"],
  },
];
