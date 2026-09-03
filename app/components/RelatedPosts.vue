<script setup lang="ts">
  import { computed } from "vue";

  /** @description A blog post the list links to. */
  interface Post {
    path: string;
    title: string;
  }

  /**
   * @description Lists other blog posts the reader might want to check out next, as a titled
   * link list for the aside of a post.
   */
  interface Props {
    posts: Post[];
  }

  const props = defineProps<Props>();

  const links = computed(() =>
    props.posts.map((post) => ({ label: post.title, to: post.path })),
  );
</script>

<template>
  <UPageLinks title="Related articles" :links="links" />
</template>
