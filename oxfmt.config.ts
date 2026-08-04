import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: [
    ".data",
    ".nuxt",
    ".output",
    ".task",
    // Nuxt Content MDC syntax (e.g. ::u-page-hero{...}) is not understood
    // by generic Markdown formatters and gets corrupted on reformat.
    "content",
    "dist",
    "node_modules",
    "pnpm-lock.yaml",
    "pnpm-workspace.yaml",
    "public/site.webmanifest",
  ],
  jsdoc: {
    bracketSpacing: true,
    descriptionTag: true,
    descriptionWithDot: true,
    preferCodeFences: true,
    separateReturnsFromParam: true,
  },
  objectWrap: "preserve",
  printWidth: 80,
  proseWrap: "always",
  semi: true,
  singleQuote: false,
  sortImports: true,
  sortPackageJson: {
    sortScripts: true,
  },
  sortTailwindcss: true,
  tabWidth: 2,
  trailingComma: "all",
  vueIndentScriptAndStyle: true,
});
