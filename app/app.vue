<script setup lang="ts">
  const { seo } = useAppConfig();

  useSeoMeta({
    ogSiteName: seo?.siteName,
    titleTemplate: `%s - ${seo?.siteName}`,
    twitterCard: "summary_large_image",
  });
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
  </UApp>
</template>
