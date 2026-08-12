<script setup lang="ts">
  import { computed } from "vue";

  import { useSiteConfig } from "#imports";

  defineOptions({
    inheritAttrs: false,
  });

  defineProps<{
    headline?: string;
    title?: string;
    description?: string;
  }>();

  const site = useSiteConfig();
  const host = computed(() => new URL(site.url).host);
</script>

<template>
  <div
    class="relative flex h-full w-full overflow-hidden bg-neutral-950"
    data-theme="dark"
  >
    <div class="bg-primary-400 absolute top-0 left-0 h-full w-1.5" />

    <div class="flex flex-1 flex-col justify-between px-20 py-16">
      <div />

      <div class="flex flex-col gap-5">
        <span v-if="headline" class="text-primary-400 text-2xl font-medium">
          {{ headline }}
        </span>

        <h1 v-if="title" class="text-highlighted text-6xl font-bold">
          {{ title }}
        </h1>

        <p
          v-if="description"
          class="text-muted text-3xl/11"
          :style="{ maxHeight: '5.5rem', overflow: 'hidden' }"
        >
          {{ description }}
        </p>
      </div>

      <div class="flex items-center gap-4">
        <svg
          class="size-8"
          viewBox="0 0 512 512"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="462.64 144.69 355.65 350.58 336.67 206.35 340.88 197.62 366.5 144.69 462.64 144.69"
            fill="#ffffff"
          />
          <polygon
            points="345.36 370.38 324.65 213.07 315.66 144.72 315.66 144.69 219.52 144.69 214.74 154.56 196.74 191.77 193.89 197.62 192.85 199.82 176.01 234.66 167.21 186.99 159.4 144.69 49.36 88.36 61.75 144.69 71.06 186.99 105.73 344.25 111.12 368.68 111.49 370.38 198.39 370.38 214.71 338.91 215.75 336.94 220.91 327.04 240.06 290.19 257.28 370.38 352.39 423.64 345.36 370.38"
            fill="#FDE047"
          />
        </svg>
        <div class="bg-border h-px flex-1" />
        <span class="text-dimmed text-xl">{{ host }}</span>
      </div>
    </div>
  </div>
</template>
