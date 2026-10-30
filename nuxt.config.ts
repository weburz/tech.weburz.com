import process from "node:process";

import { defineNuxtConfig } from "nuxt/config";

const umamiWebsiteId = process.env.UMAMI_WEBSITE_ID;
const umamiScriptUrl = process.env.UMAMI_SCRIPT_URL;

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
      script:
        umamiWebsiteId && umamiScriptUrl
          ? [
              {
                "data-website-id": umamiWebsiteId,
                defer: true,
                src: umamiScriptUrl,
              },
            ]
          : [],
    },
  },
  compatibilityDate: "2026-05-23",
  content: {
    build: {
      markdown: {
        highlight: {
          langs: [
            "hcl",
            "vue",
            "typescript",
            "javascript",
            "console",
            "bash",
            "sql",
            "systemd",
          ],
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
      failOnError: true,
      interval: 0,
    },
  },
  ogImage: {
    zeroRuntime: true,
  },
  prerender: {
    crawlLinks: true,
    routes: ["/rss.xml"],
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
