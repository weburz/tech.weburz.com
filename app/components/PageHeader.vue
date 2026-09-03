<script setup lang="ts">
  /**
   * @description Renders the header of an index page: a small uppercase eyebrow, the page
   * title, and a description passed through the default slot.
   */
  interface Props {
    eyebrow: string;
    title: string;
  }

  const props = defineProps<Props>();
</script>

<template>
  <header class="max-w-3xl">
    <p class="text-muted text-xs tracking-wider uppercase">
      {{ props.eyebrow }}
    </p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
      {{ props.title }}
    </h1>
    <p class="text-muted mt-3"><slot /></p>
  </header>
</template>
