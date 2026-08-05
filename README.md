# tech.weburz.com

The Weburz engineering site — long-form notes, open-source project docs, and a
Careers page where the answer is "send us a link to something you built."

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
  layouts/               # blog/ (centered reading) + docs/ (sidebar)
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
    raw/[...slug].md...  # /raw/<path>.md — markdown source of any content page
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
docs pages, top-right of the post header on blog posts), and any page is
available as raw Markdown at `/raw/<path>.md` — e.g.
`https://tech.weburz.com/raw/blog/hello-world.md` — useful for piping into an AI
tool or off-site quoting.

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
