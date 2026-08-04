<script setup lang="ts">
  import { getCategoryStyle } from "~/utils/categories";

  const props = defineProps<{ category: string }>();
  const style = computed(() => getCategoryStyle(props.category));
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium"
    :style="{
      backgroundColor: style.from,
      color: style.to,
      borderColor: style.to + '33',
    }"
  >
    <UIcon :name="style.icon" class="size-3" />
    {{ category }}
  </span>
</template>
