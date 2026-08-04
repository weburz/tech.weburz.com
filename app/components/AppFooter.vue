<script setup lang="ts">
  const { footer } = useAppConfig();
</script>

<template>
  <UFooter>
    <template #left>
      <div class="text-muted flex items-center gap-3 text-sm">
        <UColorModeImage
          light="/weburz-wordmark-light.svg"
          dark="/weburz-wordmark-dark.svg"
          alt="Weburz"
          class="h-4 w-auto opacity-80"
        />
        <span class="text-default/40">·</span>
        <span>{{ footer.credits }}</span>
      </div>
    </template>

    <template #right>
      <UColorModeButton v-if="footer?.colorMode" />

      <UButton
        v-for="(link, index) of footer?.links"
        :key="index"
        v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
      />
    </template>
  </UFooter>
</template>
