import { defineConfig } from "oxfmt";

export default defineConfig({
  ignorePatterns: [
    ".data",
    ".nuxt",
    ".output",
    ".task",
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
