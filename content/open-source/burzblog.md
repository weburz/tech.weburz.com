---
title: BurzBlog
description:
  Write blog posts in the browser or in your own editor. One small Go binary,
  one SQLite file, any website.
icon: i-simple-icons-go
tags:
  - Go
  - SQLite
  - CMS
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/Weburz/burzblog
    target: _blank
  - label: Website
    icon: i-lucide-globe
    to: https://burzblog.weburz.com
    target: _blank
  - label: Docs
    icon: i-lucide-book-open
    to: https://burzblog.weburz.com/docs/
    target: _blank
---

BurzBlog is where blog posts get written. It's a single Go binary with the admin
panel built in, backed by one SQLite file. Your website (Nuxt, Astro, Next or
anything else) reads the posts and stays static and fast, even when BurzBlog is
down.

## Why it exists

Most CMSes want to be your website too. We only wanted somewhere to write,
version and publish posts, with no runtime to babysit.

1. **A writing tool, not a website builder.** Sites pull posts from a read-only
   content API or from exported Markdown at build time.
2. **Tiny.** About 25 MB of memory at rest. It runs on a Raspberry Pi, and
   dozens of instances fit on one small server.
3. **Your editor or ours.** Use the split Markdown editor in the browser, or run
   `burzblog edit my-post` to open the post in `$EDITOR`. Both talk to the same
   server.
4. **Nothing gets lost.** Every save is versioned. If a save is based on an old
   version, it's refused instead of overwriting someone else's work.

## Install

```sh
curl -fsSL https://burzblog.weburz.com/install.sh | sh
```

The script picks the right binary from the latest release and checks its SHA-256
before installing. A Docker image is also available.

## Quick start

```sh
burzblog serve --origin https://blog.example.com
```

On a fresh data directory, `serve` prints a one-time setup link to create the
first account. Then write from any machine:

```sh
burzblog login https://blog.example.com
burzblog new "My next post"
burzblog publish my-next-post
```

Your site reads published posts with a read-only token:

```sh
curl -H "Authorization: Bearer $BURZBLOG_TOKEN" \
  https://blog.example.com/api/content/posts
```

## What's in it

- Split editor with live preview, tags, SEO fields and image/PDF uploads
- Revision history with restore, full-text search, scheduled publishing
- RSS, Atom, JSON Feed and sitemap out of the box
- Deploy hook to rebuild your site on publish
- Admin and author roles, TOTP two-factor sign-in, append-only audit log
- Backups as a single download
- Runs under systemd, Docker or Coolify

## Source

[github.com/Weburz/burzblog](https://github.com/Weburz/burzblog), licensed under
Apache-2.0.
