<script setup lang="ts">
  import { queryCollection, useAsyncData } from "#imports";
  import { usePageSeo } from "~/composables/usePageSeo";

  const { data: projects } = await useAsyncData("open-source-index", () =>
    queryCollection("openSource").order("title", "ASC").all(),
  );

  usePageSeo({
    description: "Open-source projects from the Weburz team.",
    title: "Open Source",
  });
</script>

<template>
  <UContainer class="py-12 sm:py-16">
    <PageHeader eyebrow="Open Source" title="Tools we build in the open.">
      Small libraries we extracted from real Weburz projects and published under
      <NuxtLink to="https://github.com/Weburz" class="underline">
        github.com/Weburz </NuxtLink
      >. Each one has its own docs page below.
    </PageHeader>

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
