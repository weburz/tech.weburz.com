import { defineConfig } from "oxlint";

export default defineConfig({
  categories: {
    // Code that is definitely wrong or useless
    correctness: "error",
    // Rules under development that may change
    nursery: "warn",
    // Extra strict rules that may have false positives
    pedantic: "error",
    // Rules that aim to improve runtime performance
    perf: "warn",
    // Rules that ban specific patterns or features
    restriction: "error",
    // Idiomatic and consistent style rules
    style: "error",
    // Code that is likely to be wrong or useless
    suspicious: "warn",
  },
  // `vue` covers the SFC compiler macros (defineProps, withDefaults, …). There
  // is deliberately no `globals` allowlist for Nuxt auto-imports — every
  // composable and util is imported explicitly at its call site, so `no-undef`
  // catches a missing import instead of the allowlist hiding it.
  env: {
    amd: true,
    browser: true,
    builtin: true,
    "shared-node-browser": true,
    vue: true,
  },
  ignorePatterns: [
    ".data",
    ".nuxt",
    ".output",
    ".task",
    "content",
    "dist",
    "node_modules",
    "public",
  ],
  options: {
    maxWarnings: 10,
    reportUnusedDisableDirectives: "error",
    respectEslintDisableDirectives: false,
    typeAware: true,
    // TS diagnostics are covered by `pnpm typecheck` (vue-tsc); tsgolint
    // cannot resolve Nuxt's solution-style tsconfig for server/ files and
    // reports every Nitro auto-import as an unresolved name.
    typeCheck: false,
  },
  overrides: [
    {
      files: ["*.config.ts"],
      rules: {
        "import/no-default-export": "allow",
        "node/no-top-level-await": "allow",
        "typescript/strict-boolean-expressions": "allow",
        // Zod schemas are call chains by design; the nesting cap would
        // force every field into a named intermediate variable.
        "unicorn/max-nested-calls": "allow",
      },
    },
    {
      files: ["*.vue"],
      rules: {
        "import/unambiguous": "off",
        "max-lines": [
          "error",
          {
            skipBlankLines: true,
            skipComments: true,
          },
        ],
        "node/no-top-level-await": "allow",
        "vue/define-props-destructuring": ["error", { destructure: "never" }],
        "vue/max-props": ["error", { maxProps: 3 }],
      },
    },
    {
      files: ["app/components/**/*.vue"],
      rules: {
        "unicorn/filename-case": ["error", { case: "pascalCase" }],
      },
    },
    {
      // Nuxt auto-imports dictate the export shape of these files: named
      // exports for composables/utils, a default export for plugins and
      // route handlers.
      files: [
        "app/composables/**/*.ts",
        "app/middleware/**/*.ts",
        "app/plugins/**/*.ts",
        "app/utils/**/*.ts",
        "server/**/*.ts",
      ],
      rules: {
        "import/exports-last": "allow",
        "import/group-exports": "allow",
        "import/no-default-export": "allow",
        "import/no-named-export": "allow",
        "import/prefer-default-export": "allow",
      },
    },
    {
      // Server routes are typed by .nuxt/tsconfig.server.json, which
      // tsgolint cannot reach through the root solution tsconfig — every
      // Nitro auto-import resolves to an `error` type there, so the
      // type-aware rules only produce noise. vue-tsc still checks these
      // files via `pnpm typecheck`.
      files: ["server/**/*.ts"],
      rules: {
        "typescript/no-unnecessary-condition": "allow",
        "typescript/no-unsafe-argument": "allow",
        "typescript/no-unsafe-assignment": "allow",
        "typescript/no-unsafe-call": "allow",
        "typescript/no-unsafe-member-access": "allow",
        "typescript/strict-boolean-expressions": "allow",
      },
    },
    {
      files: ["app/composables/**/*.ts"],
      rules: {
        "unicorn/filename-case": ["error", { case: "camelCase" }],
      },
    },
    {
      files: ["**/types/**/*.ts"],
      rules: {
        "import/no-default-export": "error",
        "import/no-named-export": "allow",
      },
    },
  ],
  plugins: [
    "eslint",
    "import",
    "jsdoc",
    "node",
    "oxc",
    "promise",
    "typescript",
    "unicorn",
    "vue",
  ],
  rules: {
    "capitalized-comments": [
      "error",
      "always",
      {
        ignoreConsecutiveComments: true,
        ignoreInlineComments: true,
      },
    ],
    // Zero and one are index/offset arithmetic, not magic.
    "no-magic-numbers": ["error", { ignore: [0, 1] }],
    "no-ternary": "allow",
    "no-undefined": "allow",
    "node/no-process-env": [
      "warn",
      {
        allowedVariables: ["CI", "GITHUB_ACTIONS"],
      },
    ],
    "oxc/no-async-await": "allow",
    "oxc/no-optional-chaining": "allow",
    "oxc/no-rest-spread-properties": "allow",
    "sort-imports": "off",
    // Vue and Nuxt Content types (Ref, ContentNavigationItem, …) are not
    // readonly-compatible, so this rule flags nearly every composable.
    "typescript/prefer-readonly-parameter-types": "allow",
  },
});
