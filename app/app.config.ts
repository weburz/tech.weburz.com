export default defineAppConfig({
  footer: {
    colorMode: false,
    credits: `© ${new Date().getFullYear()} Weburz`,
    links: [
      {
        "aria-label": "RSS feed",
        external: true,
        icon: "i-lucide-rss",
        to: "/rss.xml",
      },
      {
        "aria-label": "Weburz on GitHub",
        icon: "i-simple-icons-github",
        target: "_blank",
        to: "https://github.com/Weburz",
      },
      {
        "aria-label": "weburz.com",
        icon: "i-lucide-globe",
        target: "_blank",
        to: "https://weburz.com",
      },
    ],
  },
  header: {
    colorMode: true,
    links: [
      {
        "aria-label": "tech.weburz.com on GitHub",
        icon: "i-simple-icons-github",
        target: "_blank",
        to: "https://github.com/Weburz/tech.weburz.com",
      },
    ],
    nav: [
      { label: "Blog", to: "/blog" },
      { label: "Open Source", to: "/open-source" },
      { label: "Careers", to: "/careers" },
    ],
    search: true,
    title: "tech.weburz",
    to: "/",
  },
  toc: {
    bottom: {
      edit: false,
      links: [],
      title: "Page",
    },
    title: "Table of Contents",
  },
  ui: {
    colors: {
      error: "red",
      info: "blue",
      neutral: "slate",
      primary: "burzyellow",
      secondary: "burzblue",
      success: "green",
      warning: "amber",
    },
    footer: {
      slots: {
        left: "text-sm text-muted",
        root: "border-t border-default",
      },
    },
  },
});
