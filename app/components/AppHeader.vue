<script setup lang="ts">
  const { header } = useAppConfig();
</script>

<template>
  <UHeader :ui="{ center: 'hidden lg:flex lg:flex-1 lg:justify-center gap-1' }">
    <template #title>
      <span class="flex items-center gap-2">
        <AppLogo class="h-6 w-auto shrink-0" />
        <span class="text-default font-semibold">{{ header.title }}</span>
      </span>
    </template>

    <template #default>
      <AppHeaderNav :items="header.nav" />
    </template>

    <template #right>
      <UColorModeButton v-if="header?.colorMode" />
      <template>
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>

    <template #body>
      <nav class="flex flex-col gap-1">
        <AppHeaderNav :items="header.nav" block />
      </nav>
    </template>
  </UHeader>
</template>
