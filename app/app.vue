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
