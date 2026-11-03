---
title: Rivu
description:
  A modern TypeScript library for generating RSS 2.0 feeds programmatically. It
  enforces strict type safety, validates required channel metadata and produces
  a fully compliant RSS feed as an XML document.
icon: i-simple-icons-typescript
tags:
  - TypeScript
  - RSS
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/jarmos-san/rivu
    target: _blank
---

Rivu is a modern TypeScript library for generating RSS 2.0 feeds
programmatically. It enforces strict type safety, validates required channel
metadata and produces a fully compliant RSS feed as an XML document.

The library provides the following features:

1. 100% RSS 2.0 compliant output.
2. Lightweight and fast (based on Node.js).
3. Fully type-safe using TypeScript interfaces.
4. Strict validation for required RSS channel fields.
5. Custom feed items with rich optional metadata.
6. Small footprint and works in Node.js and other JavaScript runtimes.

While the library is marked stable and used in production, its feature set is
continuously evolving. If you want or need a specific set of features, create an
open discussion for further comments here -
https://github.com/jarmos-san/rivu/discussions.

## Quick Usage Guide

To get started with using the package to generate RSS 2.0 feeds for your
requirements, follow these instructions:

1. Install the package from the `npm` registry.

   ```console
   pnpm add rivu
   ```

2. Create a Node.js script (for example, `feed.ts`).

   ```typescript
   import Feed from "rivu";

   const feed = new Feed(
     {
       title: "Weburz Engineering Blog",
       link: "https://tech.weburz.com/rss.xml",
       description: "The technical and official engineering blog at Weburz.",
       language: "en-US",
       items: [
         {
           title: "Example Blog",
           description: "Lorem Ipsum",
           pubDate: new Date("2025-10-10"),
         },
       ],
     },
     new URL("https://tech.weburz.com/rss-stylesheet.xsl"), // Optional stylesheet
   );

   console.log(feed.generate());
   ```

3. Ensure you've the latest Node.js version installed locally, then execute the
   script by running:

   ```console
   node feed.ts
   ```

   If everything is working fine and as expected, you will see this output on
   your console:

   ```xml
    <?xml version="1.0"?>
    <?xml-stylesheet type="text/xsl" href=https://tech.weburz.com/rss-stylesheet.xsl?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <atom:link href="https://tech.weburz.com/rss.xml" rel="self" type="application/rss+xml"/>
        <title><![CDATA[Weburz Engineering Blog]]></title>
        <link>https://tech.weburz.com/rss.xml</link>
        <description><![CDATA[The technical and official engineering blog at Weburz.]]></description>
        <language>en-US</language>
        <item>
          <title><![CDATA[Example Blog]]></title>
          <description><![CDATA[Lorem Ipsum]]></description>
          <pubDate>Fri Oct 10 2025 05:30:00 GMT+0530 (India Standard Time)</pubDate>
        </item>
      </channel>
    </rss>
   ```

## Licensing & Distribution Rights

The library is built using open-source tools and the source code of the package
is also publicly shared under an open-source license. You are free to copy,
modify and/or distribute the package under the T&Cs of the license. You will
find more detailed information about the licensing details in the package's
public GitHub repository here -
[jarmos-san/rivu](https://github.com/jarmos-san/rivu).
