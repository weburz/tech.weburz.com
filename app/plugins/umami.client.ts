export default defineNuxtPlugin(() => {
  const { umamiWebsiteId } = useRuntimeConfig().public;

  if (!umamiWebsiteId) {
    return;
  }

  useHead({
    script: [
      {
        "data-website-id": umamiWebsiteId,
        defer: true,
        src: "https://umami.weburz.com/script.js",
      },
    ],
  });
});
