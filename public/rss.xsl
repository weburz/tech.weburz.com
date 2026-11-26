<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>
          <xsl:value-of select="/rss/channel/title" /> - RSS Feed
        </title>
        <style>
          :root {
            color-scheme: light dark;
            --bg: #0b0f17;
            --surface: #121826;
            --surface-alt: #0f1522;
            --border: #242e42;
            --text: #e6edf7;
            --muted: #94a3b8;
            --accent: #38bdf8;
            --accent-bg: rgba(56, 189, 248, 0.12);
          }

          @media (prefers-color-scheme: light) {
            :root {
              --bg: #f8fafc;
              --surface: #ffffff;
              --surface-alt: #f1f5f9;
              --border: #e2e8f0;
              --text: #0f172a;
              --muted: #475569;
              --accent: #0284c7;
              --accent-bg: rgba(2, 132, 199, 0.1);
            }
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 2.5rem 1.25rem 4rem;
            background: var(--bg);
            color: var(--text);
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            line-height: 1.55;
          }

          .container {
            max-width: 1120px;
            margin: 0 auto;
          }

          .notice {
            background: var(--accent-bg);
            border: 1px solid var(--border);
            border-radius: 10px;
            padding: 0.8rem 1rem;
            margin-bottom: 1.75rem;
            font-size: 0.9rem;
            color: var(--muted);
          }

          .notice strong {
            color: var(--text);
          }

          header {
            margin-bottom: 1.75rem;
            padding-bottom: 1.25rem;
            border-bottom: 1px solid var(--border);
          }

          h1 {
            margin: 0 0 0.4rem;
            font-size: 2rem;
            line-height: 1.2;
            letter-spacing: -0.02em;
          }

          .desc {
            margin: 0 0 0.85rem;
            color: var(--muted);
            font-size: 1rem;
          }

          .meta {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem 1.25rem;
            font-size: 0.85rem;
            color: var(--muted);
          }

          .meta a {
            color: var(--accent);
            text-decoration: none;
          }

          .meta a:hover {
            text-decoration: underline;
          }

          .table-wrap {
            overflow-x: auto;
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 12px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }

          thead th {
            background: var(--surface-alt);
            color: var(--muted);
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            padding: 0.85rem 1rem;
            border-bottom: 1px solid var(--border);
          }

          tbody td {
            padding: 1rem;
            border-bottom: 1px solid var(--border);
            vertical-align: top;
            font-size: 0.93rem;
          }

          tbody tr:last-child td {
            border-bottom: none;
          }

          tbody tr:hover {
            background: var(--accent-bg);
          }

          .badge {
            display: inline-block;
            padding: 0.2rem 0.55rem;
            border-radius: 999px;
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: var(--accent);
            background: var(--accent-bg);
            white-space: nowrap;
          }

          .post-title a {
            color: var(--text);
            font-weight: 600;
            text-decoration: none;
          }

          .post-title a:hover {
            color: var(--accent);
            text-decoration: underline;
          }

          .post-desc {
            color: var(--muted);
            max-width: 62ch;
          }

          .pub-date {
            color: var(--muted);
            font-size: 0.84rem;
            white-space: nowrap;
          }

          footer {
            margin-top: 1.75rem;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 0.5rem;
            font-size: 0.82rem;
            color: var(--muted);
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="notice">
            <strong>RSS Feed</strong> - Copy this URL into your feed reader to subscribe automatically.
          </div>

          <header>
            <h1><xsl:value-of select="/rss/channel/title" /></h1>
            <p class="desc"><xsl:value-of select="/rss/channel/description" /></p>
            <div class="meta">
              <a href="{/rss/channel/link}"><xsl:value-of select="/rss/channel/link" /></a>
              <xsl:if test="/rss/channel/managingEditor">
                <span>Editor: <xsl:value-of select="/rss/channel/managingEditor" /></span>
              </xsl:if>
              <xsl:if test="/rss/channel/lastBuildDate">
                <span>Updated: <xsl:value-of select="/rss/channel/lastBuildDate" /></span>
              </xsl:if>
              <xsl:if test="/rss/channel/copyright">
                <span><xsl:value-of select="/rss/channel/copyright" /></span>
              </xsl:if>
            </div>
          </header>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Article</th>
                  <th>Summary</th>
                  <xsl:if test="/rss/channel/item/pubDate">
                    <th>Published</th>
                  </xsl:if>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="/rss/channel/item">
                  <tr>
                    <td>
                      <xsl:if test="category">
                        <span class="badge"><xsl:value-of select="category" /></span>
                      </xsl:if>
                    </td>
                    <td class="post-title">
                      <a href="{link}"><xsl:value-of select="title" /></a>
                    </td>
                    <td class="post-desc">
                      <xsl:value-of select="description" />
                    </td>
                    <xsl:if test="/rss/channel/item/pubDate">
                      <td class="pub-date">
                        <xsl:value-of select="pubDate" />
                      </td>
                    </xsl:if>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <footer>
            <span><xsl:value-of select="/rss/channel/copyright" /></span>
            <span><xsl:value-of select="/rss/channel/generator" /></span>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
