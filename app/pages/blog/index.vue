<script setup lang="ts">
  import { queryCollection, useAsyncData, usePageSeo } from "#imports";

  const { data: posts } = await useAsyncData("blog-index", () =>
    queryCollection("blog").order("date", "DESC").all(),
  );

  usePageSeo({
    description: "Engineering write-ups from the Weburz team.",
    title: "Blog",
  });
</script>

<template>
  <UContainer class="py-12 sm:py-16">
    <PageHeader eyebrow="Blog" title="Long-form engineering write-ups.">
      Architecture decisions, production lessons, and tooling deep-dives from
      the Weburz team.
    </PageHeader>

    <section
      v-if="posts?.length"
      class="mt-12 grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3"
    >
      <PostCard v-for="post in posts" :key="post.path" :post="post" />
    </section>
    <section v-else class="text-muted border-default mt-12 border-t pt-6">
      No posts yet — check back soon.
    </section>
  </UContainer>
</template>
