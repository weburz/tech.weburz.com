import { defineOgImage, useSeoMeta } from "#imports";

interface PageSeo {
  description?: string;
  headline?: string;
  title: string;
  titleTemplate?: string;
}

export const usePageSeo = ({ headline, ...meta }: PageSeo): void => {
  useSeoMeta({
    ...meta,
    ogDescription: meta.description,
    ogTitle: meta.title,
  });

  defineOgImage("Docs", {
    description: meta.description,
    headline,
    title: meta.title,
  });
};
