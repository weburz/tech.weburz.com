import { defineOgImage, useSeoMeta } from "#imports";

/** @description The metadata a page declares once for its head tags and its Open Graph image. */
interface PageSeo {
  description?: string;
  /**
   * @description Short line rendered above the title on the Open Graph image, such as a
   * post's category.
   */
  headline?: string;
  title: string;
  /**
   * @description Overrides the site-wide title template. Pass an empty string to render the
   * title as is.
   */
  titleTemplate?: string;
}

/**
 * @description Sets the page title and description together with their Open Graph
 * counterparts, and registers the "Docs" Open Graph image with the same values,
 * so a page declares its metadata in one place.
 *
 * @param { PageSeo } seo The title, description and optional headline and title
 *   template of the page.
 *
 * @returns { void }
 */
export const usePageSeo = (seo: PageSeo): void => {
  useSeoMeta({
    description: seo.description,
    ogDescription: seo.description,
    ogTitle: seo.title,
    title: seo.title,
    titleTemplate: seo.titleTemplate,
  });

  defineOgImage("Docs", {
    description: seo.description,
    headline: seo.headline,
    title: seo.title,
  });
};
