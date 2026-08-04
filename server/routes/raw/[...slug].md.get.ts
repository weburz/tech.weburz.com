import type { Collections } from "@nuxt/content";
import { queryCollection } from "@nuxt/content/server";
import { stringify } from "minimark/stringify";
import { withLeadingSlash } from "ufo";

const renderMarkdown = (page: Collections[keyof Collections]): string => {
  // Add title and description to the top of the page if missing
  if (page.body.value[0]?.[0] !== "h1") {
    page.body.value.unshift(
      ["h1", {}, page.title],
      ["blockquote", {}, page.description],
    );
  }

  return stringify(
    { ...page.body, type: "minimark" },
    { format: "markdown/html" },
  );
};

export default eventHandler(async (event) => {
  const slug = getRouterParams(event)["slug.md"];
  if (!slug?.endsWith(".md")) {
    throw createError({
      fatal: true,
      statusCode: 404,
      statusMessage: "Page not found",
    });
  }

  const path = withLeadingSlash(slug.replace(".md", ""));

  const collection: keyof Collections = path.startsWith("/blog/")
    ? "blog"
    : "openSource";

  const page = await queryCollection(event, collection).path(path).first();
  if (!page) {
    throw createError({
      fatal: true,
      statusCode: 404,
      statusMessage: "Page not found",
    });
  }

  setHeader(event, "Content-Type", "text/markdown; charset=utf-8");
  return renderMarkdown(page);
});
