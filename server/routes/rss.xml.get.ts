import { eventHandler, setHeader } from "h3";
import { Feed } from "rivu";

export default eventHandler((event) => {
  const feed = new Feed({
    description: "Notes on building things.",
    items: [
      {
        author: "jane@example.com (Jane Doe)",
        category: ["intro", "meta"],
        description: "<p>The first post.</p>",
        guid: "https://example.com/posts/hello-world",
        link: "https://example.com/posts/hello-world",
        pubDate: new Date("2025-10-10T08:00:00Z"),
        title: "Hello, world",
      },
    ],
    language: "en-US",
    lastBuildDate: new Date("2025-10-12T09:30:00Z"),
    link: "https://example.com",
    title: "Example Blog",
  });

  const generatedFeed = feed.generate();

  setHeader(event, "Content-Type", "text/xml");

  return generatedFeed;
});
