import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: { lang: "en-US" },
      link: [
        { href: "/weburz-mark.svg", rel: "icon", type: "image/svg+xml" },
        { href: "/favicon.ico", rel: "icon", type: "image/x-icon" },
        {
          href: "/favicon-32x32.png",
          rel: "icon",
          sizes: "32x32",
          type: "image/png",
        },
        {
          href: "/favicon-16x16.png",
          rel: "icon",
          sizes: "16x16",
          type: "image/png",
        },
        {
          href: "/apple-touch-icon.png",
          rel: "apple-touch-icon",
          sizes: "180x180",
        },
        { href: "/site.webmanifest", rel: "manifest" },
      ],
      script: [
        {
          "data-website-id": "",
          defer: true,
          src: "https://umami.weburz.com/script.js",
        },
      ],
    },
  },
  compatibilityDate: "2026-05-23",
  content: {
    build: {
      markdown: {
        highlight: {
          langs: ["vue", "typescript", "javascript", "console", "bash", "sql"],
          theme: "github-dark",
        },
        toc: {
          searchDepth: 2,
        },
      },
    },
    experimental: {
      sqliteConnector: "native",
    },
  },
  css: ["~/assets/css/main.css"],
  devtools: {
    enabled: true,
  },
  modules: ["@nuxt/image", "@nuxt/ui", "@nuxt/content", "nuxt-og-image"],
  nitro: {
    prerender: {
      autoSubfolderIndex: true,
      concurrency: 1,
      crawlLinks: true,
      failOnError: true,
      interval: 0,
      routes: ["/rss.xml"],
    },
  },
  ogImage: {
    zeroRuntime: true,
  },
  site: {
    name: "Tech at Weburz",
    url: "https://tech.weburz.com",
  },
  ui: {
    theme: {
      colors: [
        "primary",
        "secondary",
        "neutral",
        "success",
        "info",
        "warning",
        "error",
      ],
    },
  },
  vite: {
    optimizeDeps: {
      include: ["@vueuse/core"],
    },
  },
});
