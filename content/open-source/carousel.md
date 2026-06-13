---
title: "@weburz/carousel"
description: Drop-in carousels for Nuxt 4 that make YouTube, Instagram, and TikTok embeds behave. Embla-powered.
icon: i-simple-icons-nuxt
tags:
  - Nuxt
  - TypeScript
  - Embla
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/Weburz/carousel
    target: _blank
  - label: npm
    icon: i-simple-icons-npm
    to: https://www.npmjs.com/package/@weburz/carousel
    target: _blank
---

`@weburz/carousel` is a Nuxt 4 module with drop-in carousels for YouTube,
Instagram, and TikTok embeds. Buttery
[Embla](https://www.embla-carousel.com/)-powered sliding, captions that fetch
themselves, and videos that actually shut up when you scroll away.

> **Status: experimental.** Pre-1.0 — the API may shift.

## Why it exists

Every platform embed is hostile in its own special way: Instagram answers the
obvious embed URL with `X-Frame-Options: DENY`, YouTube ignores your commands
until you whisper the right postMessage handshake, and TikTok's `embed.js`
sleeps through SPA navigations. This module ships all the workarounds so you
don't have to earn them the hard way.

- `<BaseCarousel>` / `<BaseSlide>` — Embla underneath: arrows, dots,
  multi-slide views, zero jank
- `<YouTubeCarousel>` — videos & Shorts; autoplays when scrolled into view,
  mutes/pauses when scrolled away
- `<InstagramCarousel>` — direct iframes that content blockers can't kill, no
  `embed.js` required
- `<TikTokCarousel>` — `/embed/v2/` cards whose playback halts the moment
  they're off-screen
- Captions that write themselves — titles auto-fetched from YouTube/TikTok
  oEmbed
- Stacked or magazine-style aside layouts, ~40 CSS variables to theme with
- Auto-imported composables: `useCarousel`, `useYouTubePlayer`,
  `useInstagramEmbed`, `useTikTokEmbed`, `useEmbedMetadata`

## Install

```sh
pnpm add @weburz/carousel
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@weburz/carousel"],
});
```

That's the whole setup — every component and composable auto-imports in every
Vue file.

## Usage

```vue
<template>
  <YouTubeCarousel
    :videos="[
      { id: 'dQw4w9WgXcQ', kind: 'video', title: 'Never Gonna Give You Up' },
      { id: '9bZkp7q19f0', kind: 'shorts', title: 'A short' },
    ]"
    mode="player-api"
    :autoplay-on-scroll="true"
    aria-label="Featured videos"
  />
</template>
```

Instagram and TikTok expose no playback control API from outside the iframe,
so "pause" is implemented by unloading the iframe (`src → about:blank`) and
restoring it on return — the embed reloads, but audio never keeps playing
off-screen.

The full prop reference — layouts, caption modes, theming variables — lives in
the repo README.

## Source

[github.com/Weburz/carousel](https://github.com/Weburz/carousel) — MIT
licensed.
