import type { AuthorsCollectionItem } from "@nuxt/content";

/**
 * @description Resolves author content entries by slug. Fetches the full `authors`
 * collection once via a keyed `useAsyncData` call, so every `useAuthor()`
 * invocation shares a single request and server-fetched payload across the
 * app.
 *
 * @returns { CallableFunction } A callback function to query the author details
 *   such as their profile pictures, GitHub profile, etc.
 */
export const useAuthor: CallableFunction = () => {
  // oxlint-disable-next-line promise-function-async
  const { data } = useAsyncData("authors", () =>
    queryCollection("authors").all(),
  );

  /**
   * @description Finds an author by slug.
   *
   * @param { string | undefined } slug Author slug (filename of the entry under
   *   `content/authors/`); `undefined` is tolerated and resolves to
   *   `undefined`.
   *
   * @returns { AuthorsCollectionItem | undefined } The matching author entry,
   *   or `undefined` when no entry with that slug exists.
   */
  const getAuthor = (
    slug: string | undefined,
  ): AuthorsCollectionItem | undefined => {
    if (slug === undefined) {
      return undefined;
    }

    return (
      data.value?.find((author) => author.stem === `authors/${slug}`) ??
      undefined
    );
  };

  return { getAuthor };
};
