<script setup lang="ts">
  defineProps<{
    eyebrow: string;
    title: string;
  }>();
</script>

<template>
  <header class="max-w-3xl">
    <p class="text-muted text-xs tracking-wider uppercase">{{ eyebrow }}</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
      {{ title }}
    </h1>
    <p class="text-muted mt-3"><slot /></p>
  </header>
</template>
