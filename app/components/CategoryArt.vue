<script setup lang="ts">
  import { getCategoryStyle } from "~/utils/category-styles";

  const props = defineProps<{
    category?: string;
    cover?: string;
    alt?: string;
  }>();

  const style = computed(() => getCategoryStyle(props.category));
  const gradient = computed(
    () => `linear-gradient(135deg, ${style.value.from}, ${style.value.to})`,
  );
</script>

<template>
  <div class="relative isolate aspect-[16/9] w-full overflow-hidden rounded-md">
    <NuxtImg
      v-if="cover"
      :src="cover"
      :alt="alt ?? ''"
      sizes="640px md:768px lg:1024px"
      format="webp"
      quality="80"
      class="absolute inset-0 size-full object-cover"
    />
    <template v-else>
      <div class="absolute inset-0" :style="{ background: gradient }" />
      <div
        class="absolute inset-0 opacity-25"
        style="
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.5) 1px,
            transparent 1px
          );
          background-size: 16px 16px;
        "
      />
      <div class="absolute inset-0 flex items-center justify-center">
        <UIcon
          :name="style.icon"
          class="size-16 text-white/85 drop-shadow sm:size-20"
        />
      </div>
    </template>
  </div>
</template>
