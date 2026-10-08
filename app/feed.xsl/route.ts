import { POST_TYPES } from "@/data/blog/meta"
import { HUE_COLOURS, KIND_HUE, POST_TYPE_HUE, TIL_CATEGORY_HUE, type Hue } from "@/lib/feed-view"
import { escapeXml } from "@/lib/rss"

export const dynamic = "force-static"

const POST_TYPE_LABELS: [string, Hue][] = POST_TYPES.filter((t) => t.value !== "all").map((t) => [
  t.label,
  POST_TYPE_HUE[t.value] ?? "blue",
])

function hueChoose(pairs: [string, Hue][]) {
  const whens = pairs
    .map(([name, hue]) => `<xsl:when test="$name = '${escapeXml(name)}'">${hue}</xsl:when>`)
    .join("\n          ")
  return `<xsl:choose>
          ${whens}
          <xsl:otherwise>blue</xsl:otherwise>
        </xsl:choose>`
}

const isPostType = POST_TYPE_LABELS.map(([label]) => `$name = '${escapeXml(label)}'`).join(" or ")

function hueCss() {
  const entries = Object.entries(HUE_COLOURS) as [Hue, [string, string]][]
  const light = entries.map(([h, [l]]) => `.hue-${h} { color: ${l}; }`).join("\n          ")
  const dark = entries.map(([h, [, d]]) => `.hue-${h} { color: ${d}; }`).join("\n            ")
  return `${light}
          @media (prefers-color-scheme: dark) {
            ${dark}
          }`
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function buildXsl() {
  const monthChoose = MONTHS.map((m, i) => `<xsl:when test="$m = ${i + 1}">${m}</xsl:when>`).join("\n          ")

  return `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  exclude-result-prefixes="atom">
  <xsl:output method="html" encoding="UTF-8" indent="yes" doctype-system="about:legacy-compat" />

  <!-- which feed this is, from its self link: the blog and TIL feeds label items by post type and category -->
  <xsl:variable name="self" select="/atom:feed/atom:link[@rel='self']/@href" />
  <xsl:variable name="kind">
    <xsl:choose>
      <xsl:when test="contains($self, '/blog/feed.xml')">blog</xsl:when>
      <xsl:when test="contains($self, '/til/feed.xml')">til</xsl:when>
      <xsl:when test="contains($self, '/notes/feed.xml')">notes</xsl:when>
      <xsl:when test="contains($self, '/newsletter/feed.xml')">newsletter</xsl:when>
      <xsl:otherwise>all</xsl:otherwise>
    </xsl:choose>
  </xsl:variable>
  <xsl:variable name="noun">
    <xsl:choose>
      <xsl:when test="$kind = 'blog'">posts</xsl:when>
      <xsl:when test="$kind = 'til'">entries</xsl:when>
      <xsl:when test="$kind = 'notes'">notes</xsl:when>
      <xsl:when test="$kind = 'newsletter'">issues</xsl:when>
      <xsl:otherwise>posts, TILs and notes</xsl:otherwise>
    </xsl:choose>
  </xsl:variable>
  <xsl:variable name="sectionLabel">
    <xsl:choose>
      <xsl:when test="$kind = 'blog'">Browse the blog</xsl:when>
      <xsl:when test="$kind = 'til'">Browse TIL</xsl:when>
      <xsl:when test="$kind = 'notes'">Browse the notes</xsl:when>
      <xsl:when test="$kind = 'newsletter'">Browse the newsletter</xsl:when>
    </xsl:choose>
  </xsl:variable>
  <!-- the address people paste into a reader: the canonical id without www, never the host a local run answers on -->
  <xsl:variable name="feedId" select="/atom:feed/atom:id" />
  <xsl:variable name="publicUrl">
    <xsl:choose>
      <xsl:when test="contains($feedId, '://www.')">
        <xsl:value-of select="concat(substring-before($feedId, '://www.'), '://', substring-after($feedId, '://www.'))" />
      </xsl:when>
      <xsl:otherwise><xsl:value-of select="$feedId" /></xsl:otherwise>
    </xsl:choose>
  </xsl:variable>
  <!-- the feed's own path, so the designed page link works on whichever host served it -->
  <xsl:variable name="feedPath" select="concat('/', substring-after(substring-after($self, '://'), '/'))" />

  <xsl:template name="post-type-hue">
    <xsl:param name="name" />
    ${hueChoose(POST_TYPE_LABELS)}
  </xsl:template>

  <xsl:template name="til-hue">
    <xsl:param name="name" />
    ${hueChoose(Object.entries(TIL_CATEGORY_HUE) as [string, Hue][])}
  </xsl:template>

  <xsl:template name="kind-hue">
    <xsl:param name="name" />
    ${hueChoose(Object.entries(KIND_HUE) as [string, Hue][])}
  </xsl:template>

  <!-- 2026-10-08T00:00:00.000Z as 8 October 2026; item dates are London calendar dates written at midnight -->
  <xsl:template name="date">
    <xsl:param name="iso" />
    <xsl:variable name="m" select="number(substring($iso, 6, 2))" />
    <xsl:value-of select="number(substring($iso, 9, 2))" />
    <xsl:text> </xsl:text>
    <xsl:choose>
          ${monthChoose}
    </xsl:choose>
    <xsl:text> </xsl:text>
    <xsl:value-of select="substring($iso, 1, 4)" />
  </xsl:template>

  <xsl:template match="/">
    <html lang="en-GB">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="color-scheme" content="light dark" />
        <meta name="robots" content="noindex" />
        <title><xsl:value-of select="/atom:feed/atom:title" /> feed source</title>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <style>
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
          :root {
            --bg: #ffffff; --fg: #18181b; --muted: #52525b; --border: #e4e4e7;
            --card: #f4f4f5; --card-border: #d4d4d8; --heading: #09090b; --link: #1d4ed8;
            --chip: #f4f4f5; --chip-fg: #3f3f46; --focus: #1d4ed8; --rss: #c2410c;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #09090b; --fg: #e4e4e7; --muted: #a1a1aa; --border: #27272a;
              --card: #18181b; --card-border: #3f3f46; --heading: #fafafa; --link: #60a5fa;
              --chip: #27272a; --chip-fg: #d4d4d8; --focus: #93c5fd; --rss: #fb923c;
            }
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            background: var(--bg); color: var(--fg); line-height: 1.6; padding: 2rem 1rem;
          }
          .container { max-width: 720px; margin: 0 auto; }
          a { color: var(--link); text-underline-offset: 2px; }
          a:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; border-radius: 0.25rem; }
          header { border-bottom: 1px solid var(--border); padding-bottom: 1.75rem; margin-bottom: 0.5rem; }
          .identity { display: flex; align-items: center; gap: 1rem; }
          .avatar { width: 56px; height: 56px; border-radius: 50%; border: 1px solid var(--card-border); flex-shrink: 0; }
          h1 { font-size: 1.375rem; line-height: 1.3; color: var(--heading); }
          .subtitle { font-size: 0.9375rem; color: var(--muted); margin-top: 0.25rem; }
          .subscribe {
            background: var(--card); border: 1px solid var(--card-border); border-radius: 0.5rem;
            padding: 1rem; margin-top: 1.25rem; font-size: 0.875rem; color: var(--muted);
          }
          .subscribe p + p { margin-top: 0.5rem; }
          .subscribe-title { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: var(--heading); }
          .rss-mark { width: 1rem; height: 1rem; color: var(--rss); flex-shrink: 0; }
          .feed-url {
            display: block; margin: 0.625rem 0; padding: 0.5rem 0.75rem; border-radius: 0.375rem;
            background: var(--bg); border: 1px solid var(--card-border); color: var(--fg);
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 0.8125rem;
            overflow-wrap: anywhere; user-select: all;
          }
          .header-links { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem 1.25rem; margin-top: 1rem; }
          .raw-btn {
            display: inline-flex; align-items: center; gap: 0.5rem;
            background: var(--card); border: 1px solid var(--card-border); border-radius: 0.5rem;
            padding: 0.5rem 1rem; font-size: 0.875rem; color: var(--fg); text-decoration: none;
            font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          }
          .raw-btn:hover { border-color: var(--muted); text-decoration: underline; }
          .header-links .text-link { font-size: 0.875rem; }
          ol, ul { list-style: none; }
          .item { border-bottom: 1px solid var(--border); padding: 1.5rem 0; }
          .item:last-child { border-bottom: none; }
          .item.has-thumb { display: flex; gap: 1rem; align-items: flex-start; }
          .thumb {
            width: 112px; height: 72px; object-fit: cover; flex-shrink: 0;
            border-radius: 0.375rem; border: 1px solid var(--card-border); background: var(--card);
          }
          .item-body { flex: 1; min-width: 0; }
          .labels { display: flex; flex-wrap: wrap; align-items: baseline; gap: 0.5rem; margin-bottom: 0.25rem; }
          .label, .sublabel { font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
          .sublabel { color: var(--muted); }
          .label + .sublabel::before { content: "/"; margin-right: 0.5rem; color: var(--muted); }
          ${hueCss()}
          .item-title { font-size: 1.0625rem; line-height: 1.4; font-weight: 600; color: var(--heading); }
          .item-title a { color: inherit; text-decoration: none; }
          .item-title a:hover { color: var(--link); text-decoration: underline; }
          .summary { font-size: 0.875rem; color: var(--muted); margin-top: 0.375rem; }
          .meta {
            display: flex; flex-wrap: wrap; gap: 0.25rem 1rem; margin-top: 0.5rem;
            font-size: 0.75rem; color: var(--muted); font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          }
          .author { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
          .tags { display: flex; flex-wrap: wrap; gap: 0.375rem; margin-top: 0.625rem; }
          .tag {
            display: inline-flex; align-items: center; border-radius: 0.375rem; background: var(--chip);
            padding: 0.0625rem 0.5rem; font-size: 0.75rem; font-weight: 500; line-height: 1.25rem; color: var(--chip-fg);
          }
          .tag::before { content: "#"; margin-right: 0.125rem; color: var(--muted); }
          .discussion { display: flex; gap: 1rem; font-size: 0.8125rem; margin-top: 0.5rem; }
          .empty { padding: 2rem 0; color: var(--muted); }
          .showing { text-align: center; font-size: 0.75rem; color: var(--muted); margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
          footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--border); font-size: 0.8125rem; color: var(--muted); }
          @media (max-width: 480px) {
            .item.has-thumb { flex-direction: column; }
            .thumb { width: 100%; height: auto; aspect-ratio: 16 / 9; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="identity">
              <img class="avatar" src="/images/avatar.webp" alt="Isaac Adjei" width="56" height="56" />
              <div>
                <h1><xsl:value-of select="/atom:feed/atom:title" /></h1>
                <p class="subtitle"><xsl:value-of select="/atom:feed/atom:subtitle" /></p>
              </div>
            </div>
            <section class="subscribe" aria-labelledby="subscribe-title">
              <p class="subscribe-title" id="subscribe-title">
                <svg xmlns="http://www.w3.org/2000/svg" class="rss-mark" role="img" aria-label="Feed" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="19" r="2.5" /><path d="M3 10.5v3a7.5 7.5 0 0 1 7.5 7.5h3A10.5 10.5 0 0 0 3 10.5Zm0-6v3A13.5 13.5 0 0 1 16.5 21h3A16.5 16.5 0 0 0 3 4.5Z" /></svg>
                This is the feed's source XML
              </p>
              <p>You are looking at the Atom XML a feed reader receives, laid out for reading. To subscribe, copy this address into any RSS or Atom reader:</p>
              <a class="feed-url" href="{$publicUrl}"><xsl:value-of select="$publicUrl" /></a>
              <p>Your browser's View Source shows the unstyled XML.</p>
            </section>
            <div class="header-links">
              <a class="raw-btn" href="{$feedPath}">View the feed page</a>
              <xsl:if test="string($sectionLabel)">
                <a class="text-link" href="{/atom:feed/atom:link[@rel='alternate']/@href}"><xsl:value-of select="$sectionLabel" /></a>
              </xsl:if>
              <a class="text-link" href="/feeds">See every feed</a>
            </div>
          </header>
          <main>
            <xsl:choose>
              <xsl:when test="/atom:feed/atom:entry">
                <ol class="items">
                  <xsl:apply-templates select="/atom:feed/atom:entry" />
                </ol>
                <p class="showing">
                  <xsl:value-of select="count(/atom:feed/atom:entry)" /><xsl:text> </xsl:text><xsl:value-of select="$noun" /> in this feed
                </p>
              </xsl:when>
              <xsl:otherwise>
                <p class="empty">Nothing here yet. New <xsl:value-of select="$noun" /> will appear as soon as they go live.</p>
              </xsl:otherwise>
            </xsl:choose>
          </main>
          <footer>
            <a href="/">isaacadjei.me</a> &#183; <a href="mailto:contact@isaacadjei.me">contact@isaacadjei.me</a>
          </footer>
        </div>
      </body>
    </html>
  </xsl:template>

  <xsl:template match="atom:entry">
    <xsl:variable name="first" select="string(atom:category[1]/@term)" />
    <xsl:variable name="second" select="string(atom:category[2]/@term)" />
    <!-- a post of type Blog writes its type once, since the feed drops a category repeating the section -->
    <xsl:variable name="secondIsType">
      <xsl:call-template name="is-post-type"><xsl:with-param name="name" select="$second" /></xsl:call-template>
    </xsl:variable>
    <xsl:variable name="label">
      <xsl:choose>
        <xsl:when test="$kind = 'newsletter'">Newsletter</xsl:when>
        <xsl:when test="$kind = 'blog' and $secondIsType = 'yes'"><xsl:value-of select="$second" /></xsl:when>
        <xsl:when test="$kind = 'blog'">Blog</xsl:when>
        <xsl:when test="$kind = 'til'"><xsl:value-of select="$second" /></xsl:when>
        <xsl:otherwise><xsl:value-of select="$first" /></xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="hue">
      <xsl:choose>
        <xsl:when test="$kind = 'blog'">
          <xsl:call-template name="post-type-hue"><xsl:with-param name="name" select="$label" /></xsl:call-template>
        </xsl:when>
        <xsl:when test="$kind = 'til'">
          <xsl:call-template name="til-hue"><xsl:with-param name="name" select="$label" /></xsl:call-template>
        </xsl:when>
        <xsl:otherwise>
          <xsl:call-template name="kind-hue"><xsl:with-param name="name" select="$label" /></xsl:call-template>
        </xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <!-- the combined feed's quieter second label: the post type or the TIL category -->
    <xsl:variable name="sublabel">
      <xsl:if test="$kind = 'all' and (($first = 'Blog' and $secondIsType = 'yes') or $first = 'TIL')">
        <xsl:value-of select="$second" />
      </xsl:if>
    </xsl:variable>
    <!-- how many leading categories are labels rather than tags -->
    <xsl:variable name="skip">
      <xsl:choose>
        <xsl:when test="$kind = 'newsletter'">0</xsl:when>
        <xsl:when test="$kind = 'til'">2</xsl:when>
        <xsl:when test="$kind = 'blog' and $secondIsType = 'yes'">2</xsl:when>
        <xsl:when test="string($sublabel)">2</xsl:when>
        <xsl:otherwise>1</xsl:otherwise>
      </xsl:choose>
    </xsl:variable>
    <xsl:variable name="link" select="atom:link[@rel='alternate']/@href" />
    <xsl:variable name="image" select="atom:link[@rel='enclosure']/@href" />

    <li>
      <xsl:attribute name="class">item<xsl:if test="$image"> has-thumb</xsl:if></xsl:attribute>
      <xsl:if test="$image">
        <img class="thumb" src="{$image}" alt="Cover image for {atom:title}" width="112" height="72" loading="lazy" decoding="async" />
      </xsl:if>
      <article class="item-body">
        <xsl:if test="string($label)">
          <p class="labels">
            <span class="label hue-{$hue}"><xsl:value-of select="$label" /></span>
            <xsl:if test="string($sublabel) and translate($sublabel, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz') != translate($label, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')">
              <span class="sublabel"><xsl:value-of select="$sublabel" /></span>
            </xsl:if>
          </p>
        </xsl:if>
        <h2 class="item-title"><a href="{$link}"><xsl:value-of select="atom:title" /></a></h2>
        <xsl:if test="string(atom:summary)">
          <p class="summary"><xsl:value-of select="atom:summary" /></p>
        </xsl:if>
        <p class="meta">
          <time datetime="{atom:published}">
            <xsl:call-template name="date"><xsl:with-param name="iso" select="atom:published" /></xsl:call-template>
          </time>
          <span class="author"><xsl:value-of select="atom:author/atom:name" /></span>
        </p>
        <xsl:if test="atom:category[position() &gt; $skip]">
          <ul class="tags" aria-label="Tags">
            <xsl:for-each select="atom:category[position() &gt; $skip]">
              <li class="tag"><xsl:value-of select="@term" /></li>
            </xsl:for-each>
          </ul>
        </xsl:if>
        <xsl:if test="atom:link[@rel='replies']">
          <p class="discussion">
            <a href="{$link}#reactions">Reactions</a>
            <a href="{atom:link[@rel='replies']/@href}">Comments</a>
          </p>
        </xsl:if>
      </article>
    </li>
  </xsl:template>

  <xsl:template name="is-post-type">
    <xsl:param name="name" />
    <xsl:if test="${isPostType}">yes</xsl:if>
  </xsl:template>
</xsl:stylesheet>
`
}

const XSL = buildXsl()

export function GET() {
  return new Response(XSL, {
    headers: {
      "Content-Type": "text/xsl; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  })
}
