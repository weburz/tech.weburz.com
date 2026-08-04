<script setup lang="ts">
  defineProps<{
    project: {
      path?: string;
      title?: string;
      description?: string;
      icon?: string;
      tags?: string[];
    };
  }>();
</script>

<template>
  <NuxtLink
    :to="project.path"
    class="group border-default bg-default hover:bg-elevated/40 block rounded-lg border p-6 transition-colors"
  >
    <div class="flex items-start gap-4">
      <div
        class="bg-elevated ring-default flex size-10 shrink-0 items-center justify-center rounded-md ring-1"
      >
        <UIcon
          :name="project.icon || 'i-lucide-package'"
          class="text-default size-5"
        />
      </div>
      <div class="min-w-0 flex-1">
        <h3
          class="text-lg font-semibold tracking-tight decoration-2 underline-offset-4 group-hover:underline"
        >
          {{ project.title }}
        </h3>
        <p v-if="project.description" class="text-muted mt-2 text-sm">
          {{ project.description }}
        </p>
        <div v-if="project.tags?.length" class="mt-4 flex flex-wrap gap-1.5">
          <TechTag v-for="tag in project.tags" :key="tag" :label="tag" />
        </div>
      </div>
    </div>
  </NuxtLink>
</template>
