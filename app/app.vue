<script setup lang="ts">
  const { seo } = useAppConfig();

  const { data: navigation } = await useAsyncData("navigation", () =>
    queryCollectionNavigation("openSource"),
  );
  const { data: files } = useLazyAsyncData(
    "search",
    async () => {
      const [openSource, blog] = await Promise.all([
        queryCollectionSearchSections("openSource"),
        queryCollectionSearchSections("blog"),
      ]);
      return [...openSource, ...blog];
    },
    {
      server: false,
    },
  );

  useHead({
    htmlAttrs: {
      lang: "en",
    },
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
    meta: [
      { content: "width=device-width, initial-scale=1", name: "viewport" },
    ],
  });

  useSeoMeta({
    ogSiteName: seo?.siteName,
    titleTemplate: `%s - ${seo?.siteName}`,
    twitterCard: "summary_large_image",
  });

  provide("navigation", navigation);
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator />

    <AppHeader />

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch :files="files" :navigation="navigation" />
    </ClientOnly>
  </UApp>
</template>
