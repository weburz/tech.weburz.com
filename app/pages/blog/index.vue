<script setup lang="ts">
  const { data: posts } = await useAsyncData("blog-index", () =>
    queryCollection("blog").order("date", "DESC").all(),
  );

  useSeoMeta({
    description: "Engineering write-ups from the Weburz team.",
    ogDescription: "Engineering write-ups from the Weburz team.",
    ogTitle: "Blog",
    title: "Blog",
  });

  defineOgImage("Docs", {
    description: "Engineering write-ups from the Weburz team.",
    title: "Blog",
  });
</script>

<template>
  <UContainer class="py-12 sm:py-16">
    <header class="max-w-3xl">
      <p class="text-muted text-xs tracking-wider uppercase">Blog</p>
      <h1 class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Long-form engineering write-ups.
      </h1>
      <p class="text-muted mt-3">
        Architecture decisions, production lessons, and tooling deep-dives from
        the Weburz team.
      </p>
    </header>

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
