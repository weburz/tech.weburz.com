export default defineAppConfig({
  footer: {
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
    title: "tech.weburz",
  },
  ui: {
    colors: {
      primary: "burzyellow",
      secondary: "burzblue",
      warning: "amber",
    },
    footer: {
      slots: {
        root: "border-t border-default",
      },
    },
  },
});
