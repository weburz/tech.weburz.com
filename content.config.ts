import { defineCollection, defineContentConfig, z } from "@nuxt/content";

import { ALL_CATEGORIES } from "./app/utils/category-styles";

const seoSchema = z
  .object({
    description: z.string().optional(),
    title: z.string().optional(),
  })
  .optional();

export default defineContentConfig({
  collections: {
    authors: defineCollection({
      schema: z.object({
        avatar: z.string().optional(),
        bio: z.string().optional(),
        github: z.string().optional(),
        name: z.string(),
        role: z.string(),
        website: z.string().optional(),
      }),
      source: {
        include: "authors/**/*.yml",
      },
      type: "data",
    }),
    blog: defineCollection({
      schema: z.object({
        author: z.string().optional(),
        category: z.enum(ALL_CATEGORIES).optional(),
        cover: z.string().optional(),
        date: z.coerce.date().optional(),
        seo: seoSchema,
      }),
      source: {
        include: "blog/**/*.md",
      },
      type: "page",
    }),
    openSource: defineCollection({
      schema: z.object({
        icon: z.string().optional(),
        links: z
          .array(
            z.object({
              icon: z.string(),
              label: z.string(),
              target: z.string().optional(),
              to: z.string(),
            }),
          )
          .optional(),
        seo: seoSchema,
        tags: z.array(z.string()).optional(),
      }),
      source: {
        include: "open-source/**/*.md",
      },
      type: "page",
    }),
  },
});
