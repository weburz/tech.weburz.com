<script setup lang="ts">
  const MAX_INITIALS = 2;

  const props = withDefaults(
    defineProps<{
      name: string;
      size?: "sm" | "md";
    }>(),
    { size: "sm" },
  );

  const initials = computed(() =>
    props.name
      .split(/\s+/u)
      .map((word) => word[0] ?? "")
      .join("")
      .slice(0, MAX_INITIALS)
      .toUpperCase(),
  );

  const isLarge = computed(() => props.size === "md");
</script>

<template>
  <span class="inline-flex items-center gap-2">
    <span
      class="bg-elevated text-default ring-default flex items-center justify-center rounded-full font-semibold ring-1"
      :class="isLarge ? 'size-9 text-sm' : 'size-6 text-[11px]'"
    >
      {{ initials }}
    </span>
    <span
      v-if="name"
      class="text-muted"
      :class="isLarge ? 'text-sm font-medium' : 'text-xs'"
    >
      {{ name }}
    </span>
  </span>
</template>
