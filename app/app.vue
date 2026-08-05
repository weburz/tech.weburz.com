<script setup lang="ts">
  const { name } = useSiteConfig();

  useSeoMeta({
    ogSiteName: name,
    titleTemplate: `%s - ${name}`,
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
