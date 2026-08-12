<script setup lang="ts">
  import { computed } from "vue";

  import { useAuthor } from "~/composables/useAuthor";
  import { formatDate } from "~/utils/format-date";

  interface Props {
    post: {
      path?: string;
      title?: string;
      description?: string;
      date?: string | Date;
      author?: string;
      category?: string;
      cover?: string;
    };
    featured?: boolean;
  }

  const props = defineProps<Props>();

  const { getAuthor } = useAuthor();

  const postDate = computed(() => formatDate(props.post.date));
  const author = computed(() => getAuthor(props.post.author));
</script>

<template>
  <NuxtLink :to="post.path" class="group block">
    <div
      class="flex flex-col gap-5"
      :class="featured ? 'sm:flex-row sm:items-center sm:gap-8' : ''"
    >
      <div :class="featured ? 'shrink-0 sm:w-3/5' : 'w-full'">
        <CategoryArt
          :category="post.category"
          :cover="post.cover"
          :alt="post.title"
        />
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <CategoryChip v-if="post.category" :category="post.category" />
          <time v-if="postDate" class="text-muted text-xs">
            {{ postDate }}
          </time>
        </div>

        <h2
          class="text-default font-semibold tracking-tight decoration-2 underline-offset-4 group-hover:underline"
          :class="
            featured ? 'text-2xl sm:text-3xl lg:text-4xl' : 'text-lg sm:text-xl'
          "
        >
          {{ post.title }}
        </h2>

        <p
          v-if="post.description"
          class="text-muted"
          :class="featured ? 'sm:text-lg' : 'text-sm'"
        >
          {{ post.description }}
        </p>

        <PostAuthor v-if="author" :author="author" :link-github="false" />
      </div>
    </div>
  </NuxtLink>
</template>
