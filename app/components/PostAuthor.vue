<script setup lang="ts">
  const MAX_INITIALS = 2;

  /**
   * @description Displays an author block with avatar, name, role, and GitHub link. The
   * avatar resolves to `author.avatar` when set, otherwise to the author's
   * GitHub avatar via `https://github.com/<handle>.png`. If no avatar is
   * available or the image fails to load, initials derived from `author.name`
   * are shown instead. The GitHub link renders only when `author.github` is
   * set.
   */
  interface Props {
    author: {
      name: string;
      github?: string;
      role: string;
      avatar?: string;
    };
  }

  // The props for the PostAuthor component.
  const props = defineProps<Props>();

  // Initial state for the author profile fetching logic
  const imgFailed = ref(false);

  // Computed object of the author's profile image
  const avatarUrl = computed(
    () =>
      props.author.avatar ??
      (props.author.github
        ? `https://github.com/${props.author.github}.png?size=160`
        : undefined),
  );

  // Computed object of the author's initial
  const initials = computed(() =>
    props.author.name
      .split(/\s+/u)
      .map((word) => word[0] ?? "")
      .join("")
      .slice(0, MAX_INITIALS)
      .toUpperCase(),
  );

  // Computed object of the author's GitHub profile
  const githubUrl = computed(() =>
    props.author.github
      ? `https://github.com/${props.author.github}`
      : undefined,
  );
</script>

<template>
  <span class="inline-flex items-center gap-2">
    <span
      :class="[
        'bg-elevated',
        'text-default',
        'ring-default',
        'flex',
        'items-center',
        'justify-center',
        'rounded-full',
        'font-semibold',
        'size-9',
        'text-sm',
        'ring-2',
        'gap-2',
      ]"
    >
      <img
        v-if="avatarUrl && !imgFailed"
        :src="avatarUrl"
        alt=""
        class="size-full rounded-full object-cover"
        decoding="async"
        referrerpolicy="no-referrer"
        loading="lazy"
        @error="imgFailed = true"
      />
      <span v-else>{{ initials }}</span>
    </span>

    <span v-if="author.name" class="flex min-w-0 flex-col gap-1">
      <span class="text-default text-sm font-medium">
        {{ author.name }}
      </span>
      <span class="text-muted text-xs">
        {{ author.role }}
      </span>
      <a
        v-if="githubUrl"
        :href="githubUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="text-muted hover:text-default inline-flex items-center gap-1 text-xs"
        :aria-label="`${props.author.name} on GitHub`"
      >
        <UIcon name="i-simple-icons-github" class="size-4" />
        @{{ author.github }}
      </a>
    </span>
  </span>
</template>
