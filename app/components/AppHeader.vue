<script setup lang="ts">
  const links = [
    {
      "aria-label": "tech.weburz.com on GitHub",
      icon: "i-simple-icons-github",
      target: "_blank",
      to: "https://github.com/Weburz/tech.weburz.com",
    },
  ];

  const nav = [
    { label: "Blog", to: "/blog" },
    { label: "Open Source", to: "/open-source" },
    { label: "Careers", to: "/careers" },
  ];
</script>

<template>
  <UHeader :ui="{ center: 'hidden lg:flex lg:flex-1 lg:justify-center gap-1' }">
    <template #title>
      <span class="flex items-center gap-2">
        <AppLogo class="h-6 w-auto shrink-0" />
        <span class="text-default font-semibold">tech.weburz</span>
      </span>
    </template>

    <template #default>
      <AppHeaderNav :items="nav" />
    </template>

    <template #right>
      <UColorModeButton />
      <UButton
        v-for="(link, index) of links"
        :key="index"
        v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
      />
    </template>

    <template #body>
      <nav class="flex flex-col gap-1">
        <AppHeaderNav :items="nav" block />
      </nav>
    </template>
  </UHeader>
</template>
