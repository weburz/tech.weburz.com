# Contributing to tech.weburz.com

This is the authoring guide for adding content — blog posts and OSS project
pages. Code changes follow the usual Weburz workflow (branch, PR, CI green).

## Adding a blog post

1. Create a new Markdown file under `content/blog/`. The filename becomes the
   slug:

   ```
   content/blog/our-django-migration.md  →  /blog/our-django-migration
   ```

2. Add frontmatter at the top:

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

   Known categories (`app/utils/categories.ts`): `Infrastructure`, `Data`,
   `People`, `Open Source`.

   To add a new category, edit `CATEGORY_STYLES` in `app/utils/categories.ts`.

3. Write the body. Standard Markdown — headings, lists, code fences,
   blockquotes. Fenced code blocks get syntax highlighting from Nuxt Content.

4. Local check:

   ```sh
   task dev:local
   ```

   Open http://localhost:3001 — the new post should appear on the home page and
   on `/blog`. Click through to make sure the post renders.

5. Open a PR. CI runs lint, typecheck, format check, hadolint, and pre-commit
   hooks (including [Crisp](https://github.com/Weburz/crisp) for commit
   messages).

## Adding an OSS project page

1. Create `content/open-source/<repo-name>.md`. For npm-scoped packages, the
   slug omits the scope:

   ```
   content/open-source/particle-canvas.md  →  /open-source/particle-canvas
   ```

2. Frontmatter:

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
     - label: npm
       icon: i-simple-icons-npm
       to: https://www.npmjs.com/package/@weburz/particle-canvas
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

3. Body: standard Markdown. Convention is roughly: short "why it exists,"
   install snippet, minimal usage, link to the repo's own README for full
   reference.

## Local checks before opening a PR

```sh
task qa-checks   # lint + typecheck + format check + pre-commit hooks
task build       # full static build, same as CI
```

If `task build` succeeds, deploy will succeed.

## Editing existing pages

Every page has a "View source" / "Edit on GitHub" link in the right rail of the
docs layout (OSS pages). For blog posts the equivalent is in `PageHeaderLinks` —
top-right of the post header.

You can also fetch any page as raw Markdown:

```
https://tech.weburz.com/raw/blog/hello-world.md
https://tech.weburz.com/raw/open-source/crisp.md
```

Useful for piping a page into an AI tool or for off-site quoting.

## Drafts

There is no `draft: true` convention. The convention is: don't merge a post to
`main` until it's ready to publish. Use a branch.
