<script setup lang="ts">
  definePageMeta({
    layout: "blog",
  });

  const route = useRoute();
  const { toc } = useAppConfig();

  const { data: page } = await useAsyncData(route.path, () =>
    queryCollection("blog").path(route.path).first(),
  );
  if (!page.value) {
    throw createError({
      fatal: true,
      statusCode: 404,
      statusMessage: "Post not found",
    });
  }

  const { data: surround } = await useAsyncData(`${route.path}-surround`, () =>
    queryCollectionItemSurroundings("blog", route.path, {
      fields: ["description", "date"],
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

  const formatted = useFormattedDate(() => page.value?.date, "long");

  defineOgImage("Docs", {
    description,
    headline: page.value.category || undefined,
    title,
  });
</script>

<template>
  <UPage v-if="page">
    <header class="mb-10 sm:mb-12">
      <div class="max-w-3xl">
        <div class="flex flex-wrap items-center gap-3">
          <CategoryChip v-if="page.category" :category="page.category" />
          <time
            v-if="formatted"
            :datetime="formatted.iso"
            class="text-muted text-sm"
          >
            {{ formatted.display }}
          </time>
        </div>

        <h1
          class="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
        >
          {{ page.title }}
        </h1>

        <p v-if="page.description" class="text-muted mt-4 text-lg">
          {{ page.description }}
        </p>
      </div>

      <div class="mt-8">
        <CategoryArt
          :category="page.category"
          :cover="page.cover"
          :alt="page.title"
        />
      </div>

      <div
        class="border-default mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6"
      >
        <PostAuthor v-if="page.author" :name="page.author" size="md" />
        <span v-else />
        <PageHeaderLinks />
      </div>
    </header>

    <UPageBody>
      <ContentRenderer :value="page" />

      <USeparator v-if="surround?.length" class="my-12" />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc :title="toc?.title" :links="page.body?.toc?.links" />
    </template>
  </UPage>
</template>
