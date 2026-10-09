import type { BlogPost } from "@/data/blog"
import { POST_TYPES } from "@/data/blog/meta"
import type { NotePost } from "@/data/notes"
import type { TILEntry } from "@/data/til"
import type { NewsletterIssue } from "@/lib/newsletter"
import { escapeXml, type RssChannel, type RssItem } from "@/lib/rss"
import { kindHue, postTypeHue, tilCategoryHue } from "@/lib/feed-view"

export interface FeedInfo {
  id: "blog" | "til" | "notes" | "newsletter" | "all"
  title: string
  description: string
  href: string
}

export const FEEDS: FeedInfo[] = [
  { id: "blog", title: "Blog", description: "New writing: tutorials, project write-ups and essays.", href: "/blog/feed.xml" },
  { id: "til", title: "TIL", description: "Short things I learned while building and studying.", href: "/til/feed.xml" },
  { id: "notes", title: "Notes", description: "Dated notes from my public notebook.", href: "/notes/feed.xml" },
  { id: "newsletter", title: "Newsletter", description: "Every newsletter issue, as it goes out.", href: "/newsletter/feed.xml" },
  { id: "all", title: "Everything", description: "Blog posts, TILs, notes and newsletter issues in one feed.", href: "/feed.xml" },
]

export function feedAlternates(...ids: FeedInfo["id"][]) {
  return {
    "application/atom+xml": FEEDS.filter((f) => ids.includes(f.id)).map((f) => ({
      url: f.href,
      title: `${f.title}: Isaac Adjei`,
    })),
  }
}

export const blogChannel: RssChannel = {
  title: "Isaac Adjei",
  path: "/blog",
  feedPath: "/blog/feed.xml",
  description: "Engineering and tech write-ups, project breakdowns, research posts, journal entries, articles and curated resources by Isaac Adjei.",
  subtitle: "Engineering and tech write-ups, project breakdowns, journal entries and research notes.",
  sectionLabel: "Browse the blog",
  noun: "posts",
  perPage: 7,
}

export const tilChannel: RssChannel = {
  title: "TIL: Isaac Adjei",
  path: "/til",
  feedPath: "/til/feed.xml",
  description: "Short notes on things Isaac Adjei discovers while coding, building and learning.",
  subtitle: "Short notes on things I discover while coding, building and learning.",
  sectionLabel: "Browse TIL",
  noun: "entries",
}

export const newsletterChannel: RssChannel = {
  title: "Newsletter: Isaac Adjei",
  path: "/newsletter",
  feedPath: "/newsletter/feed.xml",
  description: "Dispatches from Isaac Adjei: writing, building and learning.",
  sectionLabel: "Browse the newsletter",
  noun: "issues",
}

export const notesChannel: RssChannel = {
  title: "Notes: Isaac Adjei",
  path: "/notes",
  feedPath: "/notes/feed.xml",
  description: "A public notebook from Isaac Adjei: what he is building, thinking about and planning.",
  sectionLabel: "Browse the notes",
  noun: "notes",
}

export const allChannel: RssChannel = {
  title: "Isaac Adjei: everything",
  path: "/feeds",
  feedPath: "/feed.xml",
  description: "Blog posts, TILs, notes and newsletter issues from Isaac Adjei in one feed.",
  sectionLabel: "Every feed",
  noun: "posts, TILs, notes and issues",
}

export function postTypeName(type: string) {
  return POST_TYPES.find((t) => t.value === type)?.label ?? type
}

function stripMarkdown(text: string) {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
}

export function blogItems(posts: BlogPost[], standalone = false): RssItem[] {
  return posts.map((p) => ({
    title: p.title,
    url: `/blog/${p.slug}`,
    date: p.date,
    description: p.description,
    tags: p.tags,
    section: "Blog",
    sublabel: postTypeName(p.type),
    label: standalone ? { text: postTypeName(p.type), hue: postTypeHue(p.type) } : undefined,
    discussion: true,
  }))
}

function tilContentHtml(body: string) {
  return `<p>${escapeXml(body).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2">$1</a>')}</p>`
}

export function tilItems(entries: TILEntry[], standalone = false): RssItem[] {
  return entries.map((e) => ({
    title: e.title,
    url: `/til/${e.id}`,
    date: e.date,
    description: stripMarkdown(e.body),
    tags: e.tags,
    section: "TIL",
    sublabel: e.category,
    label: standalone ? { text: e.category, hue: tilCategoryHue(e.category) } : undefined,
    contentHtml: tilContentHtml(e.body),
    source: e.source,
  }))
}

export function noteItems(posts: NotePost[]): RssItem[] {
  return posts.map((p) => ({
    title: p.title,
    url: `/notes/${p.slug}`,
    date: p.date,
    description: p.description,
    tags: p.tags,
    section: "Notes",
  }))
}

export function newsletterItems(issues: NewsletterIssue[]): RssItem[] {
  return issues.map((i) => ({
    id: i.webUrl,
    title: i.title,
    url: i.href,
    date: i.publishDate,
    description: i.subtitle ?? "",
    label: { text: "Newsletter", hue: kindHue("Newsletter") },
    image: i.thumbnailUrl ?? undefined,
  }))
}
