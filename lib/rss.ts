import { SITE_URL } from "@/lib/constants"
import { buildFeedHtml, kindHue, type Hue } from "@/lib/feed-view"

export interface RssItem {
  title: string
  url: string
  date: string
  description: string
  id?: string
  contentHtml?: string
  tags?: string[]
  section?: string
  sublabel?: string
  label?: { text: string; hue: Hue }
  source?: { label: string; url: string }
  discussion?: boolean
  image?: string
}

export interface RssChannel {
  title: string
  path: string
  feedPath: string
  description: string
  subtitle?: string
  sectionLabel?: string
  noun?: string
  perPage?: number
}

const CANONICAL = SITE_URL.replace(/\/$/, "")
const AUTHOR = `<author><name>Isaac Adjei</name><uri>https://isaacadjei.me</uri></author>`

export function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function sortNewest(items: RssItem[]) {
  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

const absolute = (url: string, base: string) => (url.startsWith("/") ? `${base}${url}` : url)

const rfc3339 = (date: string) => new Date(date).toISOString()

function imageType(url: string) {
  if (url.endsWith(".png")) return "image/png"
  if (url.endsWith(".svg")) return "image/svg+xml"
  if (url.endsWith(".webp")) return "image/webp"
  return "image/jpeg"
}

export function buildAtomXml(channel: RssChannel, items: RssItem[], baseUrl: string, stylesheet = false) {
  const sorted = sortNewest(items)
  const updated = sorted.length ? rfc3339(sorted[0].date) : new Date(0).toISOString()
  const entries = sorted
    .map((item) => {
      const link = absolute(item.url, baseUrl)
      const id = item.id ?? absolute(item.url, CANONICAL)
      const when = rfc3339(item.date)
      const categories = [...new Set([item.section, item.sublabel, ...(item.tags ?? [])].filter((c): c is string => Boolean(c)))]
        .map((c) => `\n    <category term="${escapeXml(c)}" />`)
        .join("")
      const image = item.image ? absolute(item.image, baseUrl) : null
      const enclosure = image
        ? `\n    <link rel="enclosure" type="${imageType(image)}" href="${escapeXml(image)}" />`
        : ""
      const content = item.contentHtml ? `\n    <content type="html">${escapeXml(item.contentHtml)}</content>` : ""
      return `
  <entry>
    <id>${escapeXml(id)}</id>
    <title type="text">${escapeXml(item.title)}</title>
    <link rel="alternate" type="text/html" href="${escapeXml(link)}" />${enclosure}${item.discussion ? `\n    <link rel="replies" type="text/html" href="${escapeXml(`${link}#comments`)}" />` : ""}
    <published>${when}</published>
    <updated>${when}</updated>
    ${AUTHOR}
    ${item.description ? `<summary type="text">${escapeXml(item.description)}</summary>` : ""}${content}${categories}
  </entry>`
    })
    .join("")

  return `<?xml version="1.0" encoding="UTF-8"?>${stylesheet ? `\n<?xml-stylesheet type="text/xsl" href="/feed.xsl"?>` : ""}
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="en-GB">
  <id>${escapeXml(`${CANONICAL}${channel.feedPath}`)}</id>
  <title type="text">${escapeXml(channel.title)}</title>
  <subtitle type="text">${escapeXml(channel.description)}</subtitle>
  <updated>${updated}</updated>
  ${AUTHOR}
  <link rel="self" type="application/atom+xml" href="${escapeXml(`${baseUrl}${channel.feedPath}`)}" />
  <link rel="alternate" type="text/html" href="${escapeXml(`${baseUrl}${channel.path}`)}" />
  <icon>${baseUrl}/icon.svg</icon>
  <logo>${baseUrl}/images/avatar.webp</logo>
  <generator uri="https://isaacadjei.me">isaacadjei.me</generator>
  <rights>Copyright Isaac Adjei</rights>
${entries}
</feed>`
}

export function buildRssHtml(channel: RssChannel, items: RssItem[], baseUrl: string, page = 1) {
  return buildFeedHtml({
    title: channel.title,
    subtitle: channel.subtitle ?? channel.description,
    feedPath: channel.feedPath,
    sectionPath: channel.path,
    sectionLabel: channel.sectionLabel ?? "Browse the section",
    noun: channel.noun ?? "items",
    page,
    perPage: channel.perPage,
    items: sortNewest(items).map((item) => ({
      title: item.title,
      url: absolute(item.url, baseUrl),
      date: item.date,
      summary: item.description,
      label: item.label ?? (item.section ? { text: item.section, hue: kindHue(item.section) } : undefined),
      sublabel: item.sublabel,
      tags: item.tags,
      source: item.source,
      discussion: item.discussion,
      image: item.image ? { src: absolute(item.image, baseUrl), alt: `Cover image for ${item.title}` } : null,
    })),
  })
}

type CacheControl = string | { xml: string; html: string }

export function rssResponse(request: Request, channel: RssChannel, items: RssItem[], cacheControl: CacheControl) {
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`
  const accept = request.headers.get("accept") ?? ""
  const xmlCache = typeof cacheControl === "string" ? cacheControl : cacheControl.xml
  const htmlCache = typeof cacheControl === "string" ? cacheControl : cacheControl.html
  const vary = { Vary: "Accept" }

  if (url.searchParams.has("raw")) {
    return new Response(buildAtomXml(channel, items, baseUrl, true), {
      headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": xmlCache, ...vary },
    })
  }
  if (accept.includes("text/html")) {
    const page = parseInt(url.searchParams.get("page") ?? "1", 10)
    return new Response(buildRssHtml(channel, items, baseUrl, page), {
      headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": htmlCache, ...vary },
    })
  }
  return new Response(buildAtomXml(channel, items, baseUrl), {
    headers: { "Content-Type": "application/atom+xml; charset=utf-8", "Cache-Control": xmlCache, ...vary },
  })
}
