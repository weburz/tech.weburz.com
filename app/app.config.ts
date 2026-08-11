export default defineAppConfig({
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
