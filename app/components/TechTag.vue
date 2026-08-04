<script setup lang="ts">
  defineProps<{ label: string }>();
</script>

<template>
  <span
    class="bg-elevated text-muted ring-default inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ring-1"
  >
    {{ label }}
  </span>
</template>
