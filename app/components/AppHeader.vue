<script setup lang="ts">
  const { header } = useAppConfig();
</script>

<template>
  <UHeader
    :ui="{ center: 'hidden lg:flex lg:flex-1 lg:justify-center gap-1' }"
    :to="header?.to || '/'"
  >
    <template #title>
      <span class="flex items-center gap-2">
        <AppLogo class="h-6 w-auto shrink-0" />
        <span v-if="header?.title" class="text-default font-semibold">
          {{ header.title }}
        </span>
      </span>
    </template>

    <template v-if="header?.nav?.length" #default>
      <AppHeaderNav :items="header.nav" />
    </template>

    <template #right>
      <UContentSearchButton v-if="header?.search" />
      <UColorModeButton v-if="header?.colorMode" />
      <template v-if="header?.links">
        <UButton
          v-for="(link, index) of header.links"
          :key="index"
          v-bind="{ color: 'neutral', variant: 'ghost', ...link }"
        />
      </template>
    </template>

    <template #body>
      <nav class="flex flex-col gap-1">
        <AppHeaderNav :items="header?.nav || []" block />
      </nav>
    </template>
  </UHeader>
</template>
