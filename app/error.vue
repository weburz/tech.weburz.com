<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();

useHead({
  htmlAttrs: {
    lang: "en",
  },
});

useSeoMeta({
  title: "Page not found",
  description: "We are sorry but this page could not be found.",
});

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

provide("navigation", navigation);
</script>

<template>
  <UApp>
    <AppHeader />

    <UError :error="error" />

    <UContainer class="pb-16 sm:pb-20">
      <figure class="max-w-3xl mx-auto">
        <!--
          This page is served as a client-rendered SPA shell on GitHub Pages,
          so IPX URLs here are never prerendered. The image params must match
          careers.vue exactly to reuse the variant emitted by that page; the
          grayscale treatment is CSS for the same reason.
        -->
        <NuxtImg
          src="/blog/vitosha.webp"
          alt="Fog filling the valleys below Vitosha mountain at dusk"
          width="2000"
          height="600"
          fit="cover"
          format="webp"
          quality="75"
          loading="lazy"
          class="w-full aspect-[10/3] object-cover rounded-lg grayscale opacity-70"
        />
        <figcaption class="mt-3 text-xs text-muted text-center">
          Somewhere in the fog below Vitosha. The page you wanted isn't up here,
          but the navigation above is.
        </figcaption>
      </figure>
    </UContainer>

    <AppFooter />

    <ClientOnly>
      <LazyUContentSearch :files="files" :navigation="navigation" />
    </ClientOnly>
  </UApp>
</template>
