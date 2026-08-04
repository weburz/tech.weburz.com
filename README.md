# tech.weburz.com

The Weburz engineering site — long-form notes, open-source project docs, and a
Careers page where the answer is "send us a link to something you built."

Live at [tech.weburz.com](https://tech.weburz.com). Built with [Nuxt 4], [Nuxt
UI v4], and [Nuxt Content]; deployed as a static site to GitHub Pages.

## Quickstart

```sh
task setup    # install Node deps and Git hooks (one-time, needs pnpm + pre-commit)
task          # start the dev server inside Docker on http://localhost:3001
```

If you'd rather skip Docker:

```sh
task dev:local
```

Either way, dev has hot reload and content edits show up immediately.

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
.github/workflows/       # CI (lint/typecheck/format) + deploy (GH Pages)
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

Authoring guide for new blog posts and OSS project pages lives in
[CONTRIBUTING.md](./CONTRIBUTING.md).

The short version:

- **New blog post** → drop a `.md` file in `content/blog/` with `title`,
  `description`, `date`, `author`, and `category` frontmatter. It appears on the
  home page and `/blog` automatically.
- **New OSS project** → drop a `.md` file in `content/open-source/` with
  `title`, `description`, `icon`, `tags`, and `links` frontmatter.

## Working on the site

| Task             | What it does                                                                 |
| ---------------- | ---------------------------------------------------------------------------- |
| `task`           | Run the dev server inside Docker on http://localhost:3001 (hot reload).      |
| `task dev:local` | Same dev server, but on the host directly — faster startup.                  |
| `task build`     | Generate the static site under `.output/public` (the GH Pages artifact).     |
| `task preview`   | Build the static site and serve `.output/public` on http://localhost:3000.   |
| `task format`    | Auto-format the codebase with Oxfmt.                                         |
| `task qa-checks` | Run Oxlint, the Nuxt typecheck, Oxfmt check, and all pre-commit hooks.       |
| `task clean`     | Wipe `node_modules`, `.nuxt`, `.output`, the Task cache, and dev containers. |

`task preview` serves the same static artifact GitHub Pages uploads, so it's the
closest local parity check before pushing. The site that serves at
https://tech.weburz.com is the static build deployed by
[`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) on every push
to `main`.

## Stack

- [Nuxt 4][Nuxt 4] — the framework.
- [Nuxt UI v4][Nuxt UI v4] — components, layout primitives, theming.
- [Nuxt Content][Nuxt Content] — Markdown-driven content pipeline.
- [`nuxt-og-image`](https://nuxt.com/modules/og-image) — auto-generated social
  cards.
- [Tailwind 4](https://tailwindcss.com) — styling, via `@nuxt/ui`.
- [pnpm 11](https://pnpm.io) — package manager.
- [Task](https://taskfile.dev) — workflow runner.

## License

Site code is MIT. Content under `content/` is © Weburz; not licensed for
redistribution.

[Nuxt 4]: https://nuxt.com
[Nuxt UI v4]: https://ui.nuxt.com
[Nuxt Content]: https://content.nuxt.com
