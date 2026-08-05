export default defineNuxtConfig({
  compatibilityDate: "2026-05-23",
  content: {
    build: {
      markdown: {
        toc: {
          searchDepth: 1,
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
  icon: {
    provider: "iconify",
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
  runtimeConfig: {
    public: {
      umamiWebsiteId: "",
    },
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
