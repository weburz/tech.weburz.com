<p align="center">
  <a href="https://tech.weburz.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="public/weburz-wordmark-dark.svg">
      <img alt="Weburz" src="public/weburz-wordmark-light.svg" width="220">
    </picture>
  </a>
</p>

<h1 align="center">tech.weburz.com</h1>

<p align="center">
  The Weburz engineering site — long-form notes, open-source project docs, and
  a Careers page where the answer is "send us a link to something you built."
</p>

<p align="center">
  <a href="https://github.com/weburz/tech.weburz.com/actions/workflows/deploy.yml"><img alt="Deploy Site" src="https://github.com/weburz/tech.weburz.com/actions/workflows/deploy.yml/badge.svg"></a>
  <a href="https://github.com/weburz/tech.weburz.com/actions/workflows/qa-checks.yml"><img alt="Code QA Checks" src="https://github.com/weburz/tech.weburz.com/actions/workflows/qa-checks.yml/badge.svg"></a>
  <a href="https://tech.weburz.com"><img alt="Website status" src="https://img.shields.io/website?url=https%3A%2F%2Ftech.weburz.com&label=tech.weburz.com"></a>
  <a href="https://tech.weburz.com/rss.xml"><img alt="RSS feed" src="https://img.shields.io/badge/RSS-feed-F26522?logo=rss&logoColor=white"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/github/license/weburz/tech.weburz.com"></a>
</p>

<p align="center">
  <a href="https://nuxt.com"><img alt="Nuxt 4" src="https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt&logoColor=white"></a>
  <a href="https://ui.nuxt.com"><img alt="Nuxt UI 4" src="https://img.shields.io/badge/Nuxt_UI-4-00DC82?logo=nuxt&logoColor=white"></a>
  <a href="https://content.nuxt.com"><img alt="Nuxt Content 3" src="https://img.shields.io/badge/Nuxt_Content-3-00DC82?logo=nuxt&logoColor=white"></a>
  <a href="https://tailwindcss.com"><img alt="Tailwind CSS 4" src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white"></a>
  <a href="https://oxc.rs"><img alt="Oxlint and Oxfmt" src="https://img.shields.io/badge/Oxlint_%2B_Oxfmt-oxc.rs-6E4AFF"></a>
  <a href="https://pnpm.io"><img alt="pnpm 11" src="https://img.shields.io/badge/pnpm-11-F69220?logo=pnpm&logoColor=white"></a>
</p>

Live at [tech.weburz.com](https://tech.weburz.com). Built with [Nuxt 4], [Nuxt
UI v4], and [Nuxt Content]; deployed as a static site to GitHub Pages.

## Quickstart

```sh
task setup    # install Node deps and Git hooks (one-time, needs pnpm + pre-commit)
task dev      # start the dev server on http://localhost:3001
```

Dev has hot reload and content edits show up immediately.

## Layout

```
app/                     # Vue application
  app.config.ts          # Theme, header nav, footer, SEO/site name
  app.vue                # Root: layout shell, search overlay, head config
  components/            # Shared components (PostCard, CategoryArt, …)
  layouts/               # docs/ (the UContainer + UPage shell for content pages)
  pages/
    index.vue            # Home: featured + recent + open-source teaser
    blog/                # /blog (index) + /blog/<slug> (post detail)
    open-source/         # /open-source (index) + /open-source/<slug> (project docs)
    careers.vue          # /careers
  utils/                 # categories.ts (the per-category color + icon map)
content/                 # Markdown content (see "Adding content" below)
server/
  routes/
    rss.xml.get.ts       # /rss.xml — built from the blog collection
public/                  # Static assets served verbatim
content.config.ts        # Nuxt Content collections (blog + docs)
nuxt.config.ts           # Modules, prerender, OG image, site URL
oxlint.config.ts         # Oxlint ruleset (see comments for the Nuxt caveats)
oxfmt.config.ts          # Oxfmt formatting rules
.github/workflows/       # CI (oxlint/oxfmt/typecheck/build) + deploy (GH Pages)
```

The site has four top-level routes:

| Route          | What lives here                                 |
| -------------- | ----------------------------------------------- |
| `/`            | Featured post, recent posts grid, OSS teaser    |
| `/blog`        | All long-form engineering posts                 |
| `/open-source` | Weburz OSS projects (one detail page per repo)  |
| `/careers`     | "Role not found" — soft inbound contact channel |

`/blog/<slug>` and `/open-source/<slug>` are content-driven.

## Adding content

### Blog posts

Create a Markdown file under `content/blog/` — the filename becomes the slug
(`content/blog/our-django-migration.md` → `/blog/our-django-migration`) — with
frontmatter:

```yaml
---
title: How we migrated 14M rows without a maintenance window
description:
  A short, declarative summary. Shows up under the title and on cards.
date: 2026-05-22
author: Sagar Kapoor
category: Infrastructure
---
```

| Field         | Required | What it does                                                                  |
| ------------- | -------- | ----------------------------------------------------------------------------- |
| `title`       | yes      | Headline. Also used in browser tab and OG image.                              |
| `description` | yes      | One-sentence summary. Renders on cards, RSS, and OG image.                    |
| `date`        | yes      | ISO date (`YYYY-MM-DD`). Drives sorting + the byline date.                    |
| `author`      | no       | Renders avatar + name on the post header. Defaults to no byline.              |
| `category`    | no       | Drives the chip color + the generated cover art. Must match a known category. |
| `cover`       | no       | Path to a real image (under `public/`). Overrides the generated tile.         |

Known categories live in `CATEGORY_NAMES` in `app/utils/category-styles.ts`
(`Infrastructure`, `Data`, `People`, `Open Source`); edit that map to add one.

The body is standard Markdown; fenced code blocks get syntax highlighting from
Nuxt Content. Run `task dev` and check the post renders on `/` and `/blog`
before opening a PR.

### OSS project pages

Create `content/open-source/<repo-name>.md` (npm-scoped packages omit the scope:
`particle-canvas.md` → `/open-source/particle-canvas`):

```yaml
---
title: "@weburz/particle-canvas"
description: Zero-dependency animated particle canvas for Nuxt 4.
icon: i-simple-icons-nuxt
tags:
  - Nuxt
  - TypeScript
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/Weburz/particle-canvas
    target: _blank
---
```

| Field         | Required | What it does                                                          |
| ------------- | -------- | --------------------------------------------------------------------- |
| `title`       | yes      | Project name as it should appear (use the npm name for npm packages). |
| `description` | yes      | One-line elevator pitch.                                              |
| `icon`        | no       | [Iconify name](https://icones.js.org). Shown on the OSS project tile. |
| `tags`        | no       | Short tech badges (≤ 4 typical). Render under the description.        |
| `links`       | no       | Action links (GitHub, npm, docs site, …). Render in the page header.  |

Body convention: short "why it exists," install snippet, minimal usage, link to
the repo's own README for full reference.

### Editing and drafts

Every content page has "View source" / "Edit on GitHub" links (right rail on
docs pages, top-right of the post header on blog posts).

There is no `draft: true` convention: don't merge a post to `main` until it's
ready to publish. Use a branch.

## Working on the site

| Task             | What it does                                                               |
| ---------------- | -------------------------------------------------------------------------- |
| `task`           | List all available tasks.                                                  |
| `task dev`       | Run the dev server on http://localhost:3001 (hot reload).                  |
| `task build`     | Generate the static site under `.output/public` (the GH Pages artifact).   |
| `task preview`   | Build the static site and serve `.output/public` on http://localhost:3000. |
| `task format`    | Auto-format the codebase with Oxfmt.                                       |
| `task qa-checks` | Run Oxlint, the Nuxt typecheck, Oxfmt check, and all pre-commit hooks.     |
| `task clean`     | Wipe `node_modules`, `.nuxt`, `.output`, and the Task cache.               |

`task preview` serves the same static artifact GitHub Pages uploads, so it's the
closest local parity check before pushing — if `task build` succeeds, deploy
will succeed. The site that serves at https://tech.weburz.com is the static
build deployed by
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) on every push
to `main`.

## Stack

- [Nuxt 4][Nuxt 4] — the framework.
- [Nuxt UI v4][Nuxt UI v4] — components, layout primitives, theming.
- [Nuxt Content][Nuxt Content] — Markdown-driven content pipeline.
- [`nuxt-og-image`](https://nuxt.com/modules/og-image) — auto-generated social
  cards.
- [Tailwind 4](https://tailwindcss.com) — styling, via `@nuxt/ui`.
- [Oxlint + Oxfmt](https://oxc.rs) — linting and formatting.
- [pnpm 11](https://pnpm.io) — package manager.
- [Task](https://taskfile.dev) — workflow runner.

## License

Site code is MIT. Content under `content/` is © Weburz; not licensed for
redistribution.

[Nuxt 4]: https://nuxt.com
[Nuxt UI v4]: https://ui.nuxt.com
[Nuxt Content]: https://content.nuxt.com
