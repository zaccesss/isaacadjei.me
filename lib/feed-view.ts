import { SITE_URL } from "@/lib/constants"

export interface FeedViewItem {
  title: string
  url: string
  date: string
  summary?: string | null
  label?: { text: string; hue: Hue }
  sublabel?: string
  tags?: string[]
  source?: { label: string; url: string }
  discussion?: boolean
  image?: { src: string; alt: string } | null
}

export interface FeedView {
  title: string
  subtitle: string
  feedPath: string
  sectionPath: string
  sectionLabel: string
  noun: string
  items: FeedViewItem[]
  page?: number
  perPage?: number
}

export type Hue =
  | "blue" | "sky" | "cyan" | "teal" | "emerald" | "green" | "amber" | "orange"
  | "red" | "rose" | "pink" | "violet" | "purple" | "indigo" | "slate"

export const HUE_COLOURS: Record<Hue, [light: string, dark: string]> = {
  blue: ["#1d4ed8", "#60a5fa"],
  sky: ["#0369a1", "#38bdf8"],
  cyan: ["#0e7490", "#22d3ee"],
  teal: ["#0f766e", "#2dd4bf"],
  emerald: ["#047857", "#34d399"],
  green: ["#15803d", "#4ade80"],
  amber: ["#b45309", "#fbbf24"],
  orange: ["#c2410c", "#fb923c"],
  red: ["#b91c1c", "#f87171"],
  rose: ["#be123c", "#fb7185"],
  pink: ["#be185d", "#f472b6"],
  violet: ["#6d28d9", "#a78bfa"],
  purple: ["#7e22ce", "#c084fc"],
  indigo: ["#4338ca", "#818cf8"],
  slate: ["#475569", "#cbd5e1"],
}

export const POST_TYPE_HUE: Record<string, Hue> = {
  blog: "blue", article: "violet", research: "emerald", journal: "amber",
  report: "rose", resources: "cyan", notes: "slate",
}

export const TIL_CATEGORY_HUE: Record<string, Hue> = {
  "C": "blue", "Embedded": "green", "Electronics": "cyan", "Hardware": "amber", "Robotics": "teal",
  "Git": "orange", "GitHub": "slate", "CSS": "sky", "Web": "sky", "Next.js": "slate", "TypeScript": "blue",
  "PHP": "indigo", "Python": "amber", "Rust": "orange", "OOP": "cyan", "Algorithms & Data Structures": "violet",
  "Security": "red", "AI/ML": "purple", "Linux": "amber", "DevOps": "teal", "Testing": "emerald",
  "Architecture": "orange", "Database": "emerald", "Accessibility": "indigo", "Music": "pink",
  "Fitness": "teal", "Cooking": "rose", "Faith": "amber", "Life": "indigo", "Culture": "purple",
}

export const KIND_HUE: Record<string, Hue> = { Blog: "blue", TIL: "emerald", Notes: "amber", Newsletter: "pink" }

export const postTypeHue = (type: string): Hue => POST_TYPE_HUE[type] ?? "blue"
export const tilCategoryHue = (category: string): Hue => TIL_CATEGORY_HUE[category] ?? "blue"
export const kindHue = (kind: string): Hue => KIND_HUE[kind] ?? "blue"

const PUBLIC_ORIGIN = SITE_URL.replace(/\/$/, "").replace("://www.", "://")

function esc(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "Europe/London",
  })
}

function hueCss() {
  const light = Object.entries(HUE_COLOURS).map(([h, [l]]) => `.hue-${h} { color: ${l}; }`).join("\n      ")
  const dark = Object.entries(HUE_COLOURS).map(([h, [, d]]) => `.hue-${h} { color: ${d}; }`).join("\n        ")
  return `${light}
      @media (prefers-color-scheme: dark) {
        ${dark}
      }`
}

function renderItem(item: FeedViewItem) {
  const label = item.label
    ? `<span class="label hue-${item.label.hue}">${esc(item.label.text)}</span>`
    : ""
  const showSub = item.sublabel && item.sublabel.toLowerCase() !== item.label?.text.toLowerCase()
  const sublabel = showSub ? `<span class="sublabel">${esc(item.sublabel as string)}</span>` : ""
  const tags = (item.tags ?? []).map((t) => `<li class="tag">${esc(t)}</li>`).join("")
  const source = item.source
    ? `<p class="source">Source: <a href="${esc(item.source.url)}" rel="noopener noreferrer">${esc(item.source.label)}</a></p>`
    : ""
  const image = item.image
    ? `<img class="thumb" src="${esc(item.image.src)}" alt="${esc(item.image.alt)}" width="112" height="72" loading="lazy" decoding="async" />`
    : ""
  return `
        <li class="item${image ? " has-thumb" : ""}">
          ${image}
          <article class="item-body">
            ${label || sublabel ? `<p class="labels">${label}${sublabel}</p>` : ""}
            <h2 class="item-title"><a href="${esc(item.url)}">${esc(item.title)}</a></h2>
            ${item.summary ? `<p class="summary">${esc(item.summary)}</p>` : ""}
            <p class="meta"><time datetime="${esc(item.date)}">${formatDate(item.date)}</time><span class="author">Isaac Adjei</span></p>
            ${tags ? `<ul class="tags" aria-label="Tags">${tags}</ul>` : ""}
            ${source}
            ${item.discussion ? `<p class="discussion"><a href="${esc(item.url)}#reactions">Reactions</a><a href="${esc(item.url)}#comments">Comments</a></p>` : ""}
          </article>
        </li>`
}

function renderPagination(current: number, total: number, count: number, perPage: number, noun: string) {
  if (total <= 1) return ""
  const link = (p: number, text: string, label: string, disabled: boolean) =>
    disabled
      ? `<span class="page-btn disabled" aria-hidden="true">${text}</span>`
      : `<a class="page-btn" href="?page=${p}" aria-label="${label}">${text}</a>`
  const numbers = Array.from({ length: total }, (_, i) => i + 1)
    .map((p) =>
      p === current
        ? `<span class="page-btn active" aria-current="page">${p}</span>`
        : `<a class="page-btn" href="?page=${p}" aria-label="Page ${p}">${p}</a>`,
    )
    .join("")
  const from = (current - 1) * perPage + 1
  const to = Math.min(current * perPage, count)
  return `
      <nav class="pagination" aria-label="Feed pages">
        ${link(1, "&#171;", "First page", current === 1)}
        ${link(current - 1, "&#8249;", "Previous page", current === 1)}
        ${numbers}
        ${link(current + 1, "&#8250;", "Next page", current === total)}
        ${link(total, "&#187;", "Last page", current === total)}
      </nav>
      <p class="showing">Showing ${from} to ${to} of ${count} ${esc(noun)}</p>`
}

export function buildFeedHtml(view: FeedView) {
  const perPage = view.perPage ?? 20
  const total = Math.ceil(view.items.length / perPage)
  const current = Math.max(1, Math.min(Number.isFinite(view.page) ? (view.page as number) : 1, total || 1))
  const pageItems = view.items.slice((current - 1) * perPage, current * perPage)
  const publicFeedUrl = `${PUBLIC_ORIGIN}${view.feedPath}`
  const hasSection = view.sectionPath !== "/feeds"

  const list = pageItems.length
    ? `<ol class="items">${pageItems.map(renderItem).join("")}
      </ol>`
    : `<p class="empty">Nothing here yet. New ${esc(view.noun)} will appear as soon as they go live.</p>`

  return `<!DOCTYPE html>
<html lang="en-GB">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="color-scheme" content="light dark" />
    <meta name="robots" content="noindex" />
    <title>${esc(view.title)} feed</title>
    <link rel="icon" type="image/svg+xml" href="/icon.svg" />
    <link rel="alternate" type="application/atom+xml" title="${esc(view.title)}" href="${esc(view.feedPath)}" />
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
      a:focus-visible, .page-btn:focus-visible { outline: 2px solid var(--focus); outline-offset: 2px; border-radius: 0.25rem; }
      header { border-bottom: 1px solid var(--border); padding-bottom: 1.75rem; margin-bottom: 0.5rem; }
      .identity { display: flex; align-items: center; gap: 1rem; }
      .avatar { width: 56px; height: 56px; border-radius: 50%; border: 1px solid var(--card-border); flex-shrink: 0; }
      h1 { font-size: 1.375rem; line-height: 1.3; color: var(--heading); }
      .subtitle { font-size: 0.9375rem; color: var(--muted); margin-top: 0.25rem; }
      .subscribe {
        background: var(--card); border: 1px solid var(--card-border); border-radius: 0.5rem;
        padding: 1rem; margin-top: 1.25rem; font-size: 0.875rem; color: var(--muted);
      }
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
      .source { font-size: 0.8125rem; color: var(--muted); margin-top: 0.5rem; }
      .discussion { display: flex; gap: 1rem; font-size: 0.8125rem; margin-top: 0.5rem; }
      .empty { padding: 2rem 0; color: var(--muted); }
      .pagination { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 0.375rem; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid var(--border); }
      .page-btn {
        display: inline-flex; align-items: center; justify-content: center; min-width: 2.25rem; height: 2.25rem;
        padding: 0 0.5rem; border: 1px solid var(--card-border); border-radius: 0.375rem;
        background: var(--card); color: var(--fg); font-size: 0.875rem; text-decoration: none;
      }
      a.page-btn:hover { border-color: var(--muted); text-decoration: underline; }
      .page-btn.active { background: var(--link); border-color: var(--link); color: var(--bg); font-weight: 600; }
      .page-btn.disabled { opacity: 0.45; }
      .showing { text-align: center; font-size: 0.75rem; color: var(--muted); margin-top: 0.5rem; }
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
            <h1>${esc(view.title)}</h1>
            <p class="subtitle">${esc(view.subtitle)}</p>
          </div>
        </div>
        <section class="subscribe" aria-labelledby="subscribe-title">
          <p class="subscribe-title" id="subscribe-title">
            <svg class="rss-mark" role="img" aria-label="Feed" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="19" r="2.5"/><path d="M3 10.5v3a7.5 7.5 0 0 1 7.5 7.5h3A10.5 10.5 0 0 0 3 10.5Zm0-6v3A13.5 13.5 0 0 1 16.5 21h3A16.5 16.5 0 0 0 3 4.5Z"/></svg>
            This is a web feed
          </p>
          <p>Copy this address into any RSS or Atom reader to get new ${esc(view.noun)} as they go live:</p>
          <a class="feed-url" href="${esc(publicFeedUrl)}">${esc(publicFeedUrl)}</a>
          <p>New to feeds? A reader such as NetNewsWire, Feedly or Inoreader checks the feed for you, with no account on this site.</p>
        </section>
        <div class="header-links">
          <a class="raw-btn" href="${esc(view.feedPath)}?raw">&lt;/&gt; View source XML</a>
          ${hasSection ? `<a class="text-link" href="${esc(view.sectionPath)}">${esc(view.sectionLabel)}</a>` : ""}
          <a class="text-link" href="/feeds">See every feed</a>
        </div>
      </header>
      <main>
      ${list}
      ${renderPagination(current, total, view.items.length, perPage, view.noun)}
      </main>
      <footer>
        <a href="/">isaacadjei.me</a> &#183; <a href="mailto:contact@isaacadjei.me">contact@isaacadjei.me</a>
      </footer>
    </div>
  </body>
</html>`
}

export function feedHtmlResponse(view: FeedView, headers: Record<string, string>) {
  return new Response(buildFeedHtml(view), {
    headers: { ...headers, "Content-Type": "text/html; charset=utf-8" },
  })
}
