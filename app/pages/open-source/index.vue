<script setup lang="ts">
  const { data: projects } = await useAsyncData("open-source-index", () =>
    queryCollection("openSource").order("title", "ASC").all(),
  );

  useSeoMeta({
    description: "Open-source projects from the Weburz team.",
    ogDescription: "Open-source projects from the Weburz team.",
    ogTitle: "Open Source",
    title: "Open Source",
  });

  defineOgImage("Docs", {
    description: "Open-source projects from the Weburz team.",
    title: "Open Source",
  });
</script>

<template>
  <UContainer class="py-12 sm:py-16">
    <header class="max-w-3xl">
      <p class="text-muted text-xs tracking-wider uppercase">Open Source</p>
      <h1 class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Tools we build in the open.
      </h1>
      <p class="text-muted mt-3">
        Small libraries we extracted from real Weburz projects and published
        under
        <NuxtLink to="https://github.com/Weburz" class="underline">
          github.com/Weburz </NuxtLink
        >. Each one has its own docs page below.
      </p>
    </header>

    <section v-if="projects?.length" class="mt-12 grid gap-4 sm:grid-cols-2">
      <ProjectCard
        v-for="project in projects"
        :key="project.path"
        :project="project"
      />
    </section>
    <section v-else class="text-muted border-default mt-12 border-t pt-6">
      Nothing here yet.
    </section>
  </UContainer>
</template>
