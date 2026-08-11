<script setup lang="ts">
  const credits = `© ${new Date().getFullYear()} Weburz`;

  const links = [
    {
      "aria-label": "RSS feed",
      external: true,
      icon: "i-lucide-rss",
      to: "/rss.xml",
    },
    {
      "aria-label": "Weburz on GitHub",
      icon: "i-simple-icons-github",
      target: "_blank",
      to: "https://github.com/Weburz",
    },
    {
      "aria-label": "weburz.com",
      icon: "i-lucide-globe",
      target: "_blank",
      to: "https://weburz.com",
    },
  ];
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
        <span>{{ credits }}</span>
      </div>
    </template>

    <template #right>
      <UButton
        v-for="(link, index) of links"
        :key="index"
        v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
      />
    </template>
  </UFooter>
</template>
