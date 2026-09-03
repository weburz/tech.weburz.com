<script setup lang="ts">
  import { computed } from "vue";

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
  import { useAuthor } from "~/composables/useAuthor";
  import { formatDate } from "~/utils/format-date";

  const { getAuthor } = useAuthor();

  const MAX_RELATED_POSTS = 3;

  definePageMeta({
    layout: "blog",
  });

  const route = useRoute();

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

  const { data: posts } = await useAsyncData(`${route.path}-related`, () =>
    queryCollection("blog")
      .where("path", "<>", route.path)
      .select("path", "title", "date", "category")
      .order("date", "DESC")
      .all(),
  );

  const title = page.value.seo?.title || page.value.title;
  const description = page.value.seo?.description || page.value.description;

  useSeoMeta({
    description,
    ogDescription: description,
    ogTitle: title,
    title,
  });

  const postDate = computed(() => formatDate(page.value?.date));

  const author = computed(() => getAuthor(page.value?.author));

  const relatedPosts = computed(() =>
    (posts.value ?? [])
      .toSorted(
        (postA, postB) =>
          Number(postB.category === page.value?.category) -
          Number(postA.category === page.value?.category),
      )
      .slice(0, MAX_RELATED_POSTS),
  );

  defineOgImage("Docs", {
    description,
    headline: page.value.category || undefined,
    title,
  });
</script>

<template>
  <UPage v-if="page">
    <header class="mb-10 sm:mb-12">
      <div class="max-w-5xl">
        <div class="flex flex-wrap items-center gap-3">
          <CategoryChip v-if="page.category" :category="page.category" />
          <time v-if="postDate" class="text-muted text-sm">
            {{ postDate }}
          </time>
        </div>

        <h1
          class="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
        >
          {{ page.title }}
        </h1>

        <p v-if="page.description" class="text-muted mt-4 max-w-3xl text-lg">
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
        class="border-default mt-8 flex flex-wrap items-center gap-4 border-t pt-6"
      >
        <PostAuthor v-if="author" :author="author" />
      </div>
    </header>

    <UPageBody>
      <ContentRenderer :value="page" class="text-lg" />

      <USeparator v-if="surround?.length" class="my-12" />

      <UContentSurround :surround="surround" />

      <RelatedPosts
        v-if="relatedPosts.length"
        :posts="relatedPosts"
        class="lg:hidden"
      />
    </UPageBody>

    <template #right>
      <UContentToc title="Table of Contents" :links="page.body?.toc?.links">
        <template v-if="relatedPosts.length" #bottom>
          <USeparator type="dashed" />
          <RelatedPosts :posts="relatedPosts" />
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
