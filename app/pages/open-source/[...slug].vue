<script setup lang="ts">
  import {
    createError,
    defineOgImage,
    definePageMeta,
    queryCollection,
    queryCollectionItemSurroundings,
    useAsyncData,
    useRoute,
    useSeoMeta,
  } from "#imports";

  definePageMeta({
    layout: "docs",
  });

  const route = useRoute();

  const { data: page } = await useAsyncData(route.path, () =>
    queryCollection("openSource").path(route.path).first(),
  );
  if (!page.value) {
    throw createError({
      fatal: true,
      statusCode: 404,
      statusMessage: "Page not found",
    });
  }

  const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
    queryCollectionItemSurroundings("openSource", route.path, {
      fields: ["description"],
    }),
  );

  const title = page.value.seo?.title || page.value.title;
  const description = page.value.seo?.description || page.value.description;

  useSeoMeta({
    description,
    ogDescription: description,
    ogTitle: title,
    title,
  });

  defineOgImage("Docs", { description, title });
</script>

<template>
  <UPage v-if="page">
    <header class="mb-10">
      <div class="flex items-start gap-4">
        <div
          v-if="page.icon"
          class="bg-elevated ring-default flex size-12 shrink-0 items-center justify-center rounded-md ring-1"
        >
          <UIcon :name="page.icon" class="text-default size-6" />
        </div>
        <div class="min-w-0 flex-1">
          <h1 class="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            {{ page.title }}
          </h1>
          <p v-if="page.description" class="text-muted mt-3 text-lg">
            {{ page.description }}
          </p>
          <div v-if="page.tags?.length" class="mt-4 flex flex-wrap gap-1.5">
            <TechTag v-for="tag in page.tags" :key="tag" :label="tag" />
          </div>
        </div>
      </div>
      <div class="mt-6 flex flex-wrap items-center gap-3">
        <div class="flex flex-wrap items-center gap-2">
          <UButton
            v-for="(link, index) in page.links"
            :key="index"
            v-bind="link"
          />
        </div>
      </div>
    </header>

    <UPageBody>
      <ContentRenderer :value="page" />

      <USeparator v-if="surround?.length" class="my-12" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc title="Table of Contents" :links="page.body?.toc?.links" />
    </template>
  </UPage>
</template>
