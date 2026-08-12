# AGENTS.md

Nuxt 4 static site (Nuxt UI v4 + Nuxt Content) deployed to GitHub Pages. The
README covers layout and content frontmatter in depth — read it before editing.

## Commands

- Use the Task runner, not pnpm directly: `task dev` (port **3001**, not 3000),
  `task build` (static output under `.output/public`), `task preview` (serves
  the built artifact on 3000), `task qa-checks`, `task format`, `task setup`.
- `task qa-checks` is the pre-push gate: Oxlint → `nuxt typecheck` → Oxfmt
  `--check` → `pre-commit run --all-files`. Fix all of these before pushing.
- Lint/format are Oxlint + Oxfmt (no ESLint/Prettier). `sort-imports` is off,
  but `oxfmt` **sorts imports** — run `task format` after adding imports.
- `task build` fails on any prerender error (`nitro.prerender.failOnError`), and
  it's the exact artifact GitHub Pages deploys. If it succeeds, deploy succeeds.

## Content (most edits land here)

- Blog posts: `content/blog/<slug>.md`; OSS pages:
  `content/open-source/<name>.md`. Filename = slug. Frontmatter shape is
  Zod-validated in `content.config.ts`.
- `category` must be one of `CATEGORY_NAMES` in `app/utils/category-styles.ts`
  (`Data`, `Infrastructure`, `People`, `Open Source`) or content fails to load.
  Edit that map (and `ALL_CATEGORIES` usage) to add a category.
- No `draft: true` support. Never merge unpublished posts to `main`.
- **Never run `task format` / `pnpm fmt` on `content/`** — oxfmt corrupts Nuxt
  Content MDC syntax like `::u-page-hero{...}`; it's hard-excluded in
  `oxfmt.config.ts` for that reason.

## Code conventions

- `tsconfig.json` extends the generated `.nuxt/tsconfig.json` — run
  `pnpm install` (postinstall runs `nuxt prepare`) before typechecking fresh
  clones.
- **Never rely on Nuxt auto-imports** — Oxlint keeps no `globals` allowlist, so
  an unimported composable fails `no-undef`. Import everything explicitly:
  - Vue APIs (`ref`, `computed`) → `vue`
  - Nuxt/module APIs (`useAsyncData`, `queryCollection`, `useSeoMeta`,
    `defineOgImage`, `definePageMeta`, …) → `#imports`
  - h3 utilities in `server/**` (`eventHandler`, `setHeader`, …) → `h3`, **not**
    `#imports`. `nuxt typecheck` resolves `#imports` in server files against the
    app project, where those names don't exist.
  - `defineNuxtConfig` → `nuxt/config`; local helpers → `~/composables/*`,
    `~/utils/*`
  - SFC compiler macros (`defineProps`, `defineOptions`, `withDefaults`) need no
    import — Oxlint's `vue` env already knows them.
- `app/composables/**`, `app/utils/**` use named exports; `app/plugins/**` and
  `server/**` handlers use default exports.
- Type-aware Oxlint rules are disabled for `server/**` (tsgolint can't resolve
  Nitro's tsconfig) — `nuxt typecheck` is the authority for those files.
- New shared components: PascalCase filename, max 3 props, no destructured
  `defineProps` (enforced by Oxlint).

## Env & deploy

- All env vars are `NUXT_PUBLIC_*` and baked into the static HTML — nothing is
  secret; `.env` stays out of git (see `.env.example`). Blank
  `NUXT_PUBLIC_UMAMI_WEBSITE_ID` disables analytics.
- Pre-commit hooks block committing to `main` (`no-commit-to-branch`) and lint
  commit messages (Weburz/crisp) — work on a branch, conventional messages.
- Push to `main` runs qa-checks + deploys `.output/public` via
  `.github/workflows/deploy.yml`.
