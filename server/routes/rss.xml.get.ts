import { queryCollection } from "@nuxt/content/server";
import { eventHandler, setHeader } from "h3";

import { getSiteConfig } from "#site-config/server/composables";

const escape = (text: string | undefined): string =>
  (text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

export default eventHandler(async (event) => {
  const site = getSiteConfig(event);
  const baseUrl = site.url;

  const posts = await queryCollection(event, "blog")
    .order("date", "DESC")
    .all();

  const items = posts
    .map((post) => {
      const link = `${baseUrl}${post.path}`;
      const pubDate = new Date(post.date ?? Date.now()).toUTCString();
      const author = post.author
        ? `<author>${escape(post.author)}</author>`
        : "";
      const category = post.category
        ? `<category>${escape(post.category)}</category>`
        : "";
      return `    <item>
      <title>${escape(post.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escape(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      ${author}
      ${category}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)}</title>
    <link>${baseUrl}</link>
    <description>Engineering writing from the Weburz team.</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  setHeader(event, "Content-Type", "application/rss+xml; charset=utf-8");
  return xml;
});
