<script setup lang="ts">
  defineProps<{
    items: { label: string; to: string }[];
    block?: boolean;
  }>();
</script>

<template>
  <UButton
    v-for="(item, index) in items"
    :key="index"
    :to="item.to"
    :label="item.label"
    color="neutral"
    variant="ghost"
    :block="block"
    :class="block ? 'justify-start' : ''"
  />
</template>
