<script setup lang="ts">
  import { computed } from "vue";

  import {
    defineOgImage,
    queryCollection,
    useAsyncData,
    useSeoMeta,
    useSiteConfig,
  } from "#imports";

  const { name } = useSiteConfig();

  const { data: posts } = await useAsyncData("home-posts", () =>
    queryCollection("blog").order("date", "DESC").all(),
  );
  const { data: projects } = await useAsyncData("home-projects", () =>
    queryCollection("openSource").order("title", "ASC").all(),
  );

  const featured = computed(() => posts.value?.[0]);
  const rest = computed(() => posts.value?.slice(1) ?? []);

  useSeoMeta({
    description:
      "Engineering writing and open-source projects from the Weburz team.",
    ogDescription:
      "Engineering writing and open-source projects from the Weburz team.",
    ogTitle: name,
    title: name,
    titleTemplate: "",
  });

  defineOgImage("Docs", {
    description:
      "Engineering writing and open-source projects from the Weburz team.",
    title: name,
  });
</script>

<template>
  <UContainer class="py-12 sm:py-16">
    <section class="max-w-3xl">
      <p class="text-muted text-xs tracking-wider uppercase">Tech at Weburz</p>
      <h1
        class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl"
      >
        Engineering notes from the team behind
        <NuxtLink
          to="https://weburz.com"
          class="decoration-primary underline decoration-2 underline-offset-4"
          >weburz.com</NuxtLink
        >.
      </h1>
      <p class="text-muted mt-4 text-base sm:text-lg">
        Architecture decisions, production lessons, and the small open-source
        tools we build along the way.
      </p>
    </section>

    <section v-if="featured" class="mt-16 sm:mt-20">
      <p class="text-muted mb-6 text-xs tracking-wider uppercase">Featured</p>
      <PostCard :post="featured" featured />
    </section>

    <section v-if="rest.length" class="mt-16 sm:mt-20">
      <p class="text-muted mb-6 text-xs tracking-wider uppercase">
        Recent posts
      </p>
      <div class="grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-3">
        <PostCard v-for="post in rest" :key="post.path" :post="post" />
      </div>
    </section>

    <section v-if="!posts?.length" class="text-muted mt-16">
      No posts yet — check back soon.
    </section>

    <section v-if="projects?.length" class="mt-20 sm:mt-24">
      <div class="mb-6 flex items-end justify-between gap-4">
        <p class="text-muted text-xs tracking-wider uppercase">Open source</p>
        <NuxtLink
          to="/open-source"
          class="text-muted hover:text-default text-sm underline-offset-4 hover:underline"
        >
          View all →
        </NuxtLink>
      </div>
      <div class="grid gap-4 sm:grid-cols-2">
        <ProjectCard
          v-for="project in projects"
          :key="project.path"
          :project="project"
        />
      </div>
    </section>
  </UContainer>
</template>
