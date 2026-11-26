import { queryCollection } from "@nuxt/content/server";
import { eventHandler, setHeader } from "h3";
import { version } from "nuxt/package.json";
import { Feed } from "rivu";

import { getSiteConfig } from "#site-config/server/composables";

export default eventHandler(async (event) => {
  // Get the site-wide configurations for the application.
  const site = getSiteConfig(event);

  // Fetch the list of blog posts to render the XML tree.
  const posts = await queryCollection(event, "blog")
    .order("date", "DESC")
    .all();

  // Create an instance of today's date and time.
  const today = new Date();

  // Construct the RSS feed with all the necessary details rendered from the blog posts.
  const feed = new Feed({
    category: "Technology",
    copyright: `Weburz © 2026-${new Date().getFullYear()}`,
    description: site.description,
    generator: `Nuxt.js ${version} (Node.js ${process.version})`,
    items: posts.map((post) => ({
      category: post.category,
      description: post.description,
      guid: `${post.id}`,
      link: `${site.url}${post.path}`,
      title: post.title,
    })),
    language: "en-US",
    lastBuildDate: today,
    link: site.url,
    managingEditor: "Somraj Saha",
    pubDate: today,
    title: site.name,
    ttl: 1440,
    webMaster: "Somraj Saha",
  });

  // Construct the XML tree
  const generatedFeed = feed.generate();

  // Set the header for the browser to properly identify the content-type of the rendered
  // contents.
  setHeader(event, "Content-Type", "text/xml");

  // Return the newly constructed XML tree on request.
  return generatedFeed;
});
