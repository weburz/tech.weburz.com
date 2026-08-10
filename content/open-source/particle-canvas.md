---
title: "@weburz/particle-canvas"
description:
  Zero-dependency animated particle canvas for Nuxt 4 — drop-in <ParticleCanvas
  /> component, ~10 KB.
icon: i-simple-icons-nuxt
tags:
  - Nuxt
  - TypeScript
  - Canvas
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

`@weburz/particle-canvas` is a Nuxt 4 module that ships a drop-in
`<ParticleCanvas />` component for animated linked-particle backgrounds. Zero
runtime dependencies, ~10 KB unminified (~3 KB gzipped), TypeScript-first.

> **Status: experimental.** Pre-1.0 — the API may shift between minor releases.

## Why it exists

Every marketing site we build ends up wanting a particle-y hero background. We
wanted something small, Nuxt-native, and SSR-safe — so we wrote one, optimized
for the way we ship sites.

- Auto-imported `<ParticleCanvas />` component
- Zero runtime dependencies
- SSR-safe — the engine runs only in the browser via a `window` guard
- Linked-line constellations, hover/click interactions, density-aware scaling
- First-class TypeScript types

## Install

```sh
pnpm add @weburz/particle-canvas
```

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ["@weburz/particle-canvas"],

  particleCanvas: {
    defaults: {
      count: 100,
      color: ["#a3c4e0", "#ffd86b"],
    },
  },
});
```

## Usage

Drop the component anywhere — it auto-imports:

```vue
<template>
  <div class="hero">
    <ParticleCanvas
      :config="{
        count: 150,
        linked: {
          enable: true,
          distance: 140,
          color: '#a3c4e0',
          width: 1,
          opacity: 0.4,
        },
      }"
    />
    <h1>Hello</h1>
  </div>
</template>

<style scoped>
  .hero {
    position: relative;
    height: 100vh;
  }
  .hero > :first-child {
    position: absolute;
    inset: 0;
  }
</style>
```

The composable short-circuits when `window` is undefined, so the engine never
executes during SSR. The `<canvas>` element renders identically on server and
client — no hydration mismatch.

## Module options

| Option     | Type             | Default | Description                                                                |
| ---------- | ---------------- | ------- | -------------------------------------------------------------------------- |
| `defaults` | `ParticleConfig` | `{}`    | Config applied when `<ParticleCanvas>` is rendered without a `config` prop |
| `prefix`   | `string`         | `""`    | Component name prefix, e.g. `"Weburz"` → `<WeburzParticleCanvas>`          |

Full `ParticleConfig` reference lives in the repo README — see below.

## Source

[github.com/Weburz/particle-canvas](https://github.com/Weburz/particle-canvas) —
MIT licensed.
