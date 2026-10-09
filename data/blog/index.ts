import { computeReadingTime } from "@/lib/utils"
import { isLive } from "@/lib/schedule"
import type { BlogCard } from "./meta"

export type PostType = "blog" | "journal" | "research" | "notes" | "report" | "article" | "resources"

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "ol-links"; items: { text: string; url?: string }[] }
  | { type: "code"; lang: string; text: string }
  | { type: "quote"; text: string; source?: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "video"; youtubeId: string; title: string; description?: string }
  | { type: "spotify"; episodeId: string; title: string; description?: string }
  | { type: "divider" }
  // a Mermaid flowchart, sequence, ER or state diagram drawn from text
  | { type: "diagram"; code: string; caption?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "callout"; tone: "note" | "tip" | "important" | "warning" | "caution"; text: string }
  // a local screen recording with a still frame for reduced motion
  | { type: "clip"; src: string; poster: string; alt: string; caption?: string }

export interface BlogPost {
  slug: string
  title: string
  date: string
  type: PostType
  description: string
  tags: string[]
  readingTime?: number
  published: boolean
  content: ContentBlock[]
  projectSlug?: string
  headerLinks?: { label: string; url: string }[]
  cover_image?: string
  cover_image_dark?: string
  series?: string
  seriesPart?: number
  featured?: boolean
}

export { POST_TYPES, SERIES_LABELS, type BlogCard } from "./meta"

import _0 from "./posts/my-journey-so-far"
import _1 from "./posts/two-stage-audio-amplifier"
import _2 from "./posts/avr-bare-metal-atmega644p"
import _3 from "./posts/neopixel-led-cube"
import _4 from "./posts/phaemos-predictive-maintenance"
import _5 from "./posts/git-unlocked-open-source-course"
import _6 from "./posts/british-airways-engineering-simulation"
import _7 from "./posts/yunex-traffic-virtual-experience"
import _8 from "./posts/business-analytics-data-to-decisions"
import _9 from "./posts/building-my-portfolio"
import _10 from "./posts/astoncv-full-stack-cv-database"
import _12 from "./posts/why-software-engineers-should-understand-hardware"
import _13 from "./posts/resources-engineering-and-technology"
import _14 from "./posts/iot-security-gaps"
import _15 from "./posts/spi-vs-i2c"
import _16 from "./posts/uart-bare-metal"
import _17 from "./posts/rtos-fundamentals"
import _18 from "./posts/ocular-prosthetics-bionic-vision"
import _19 from "./posts/typescript-patterns-that-actually-matter"
import _20 from "./posts/dma-bare-metal"
import _21 from "./posts/fpga-vhdl-introduction"
import _22 from "./posts/interrupt-driven-embedded-design"
import _23 from "./posts/real-time-web-data"
import _24 from "./posts/reading-datasheets"
import _25 from "./posts/international-student-engineering-uk"
import _26 from "./posts/javascript-event-loop"
import _27 from "./posts/my-development-setup-2026"
import _28 from "./posts/phaemos-engineering-decisions"
import _29 from "./posts/eleven-things-learning-to-code"
import _30 from "./posts/on-being-uncomfortable"
import _31 from "./posts/writing-for-engineers"
import _32 from "./posts/python-type-annotations"
import _33 from "./posts/competitive-programming-start"
import _34 from "./posts/open-source-contributing"
import _35 from "./posts/sky-black-heritage-celebration-day"
import _36 from "./posts/another-year-another-lesson"
import _37 from "./posts/bootstrap-any-machine-one-command"
import _38 from "./posts/accessibility-as-a-default-wcag-2-2"
import _39 from "./posts/one-palette-eight-terminals"
import _40 from "./posts/moving-a-production-database-to-tidb"

export const posts: BlogPost[] = [
  _0,
  _1,
  _2,
  _3,
  _4,
  _5,
  _6,
  _7,
  _8,
  _9,
  _10,
  _12,
  _13,
  _14,
  _15,
  _16,
  _17,
  _18,
  _19,
  _20,
  _21,
  _22,
  _23,
  _24,
  _25,
  _26,
  _27,
  _28,
  _29,
  _30,
  _31,
  _32,
  _33,
  _34,
  _35,
  _36,
  _37,
  _38,
  _39,
  _40,
]

function withReadingTime(p: BlogPost): BlogPost & { readingTime: number } {
  return { ...p, readingTime: computeReadingTime(p.content) }
}

export function getPublishedPosts(): (BlogPost & { readingTime: number })[] {
  if (process.env.NODE_ENV === "development") return posts.map(withReadingTime)
  return posts.filter((p) => p.published && isLive(p.date)).map(withReadingTime)
}

export function toCard(p: BlogPost & { readingTime: number }): BlogCard {
  const { content, ...card } = p
  return card
}

export function getFeaturedPosts(): BlogPost[] {
  return getPublishedPosts().filter((p) => p.featured)
}

export function getPostBySlug(slug: string): (BlogPost & { readingTime: number }) | undefined {
  const pool = process.env.NODE_ENV === "development" ? posts.map(withReadingTime) : getPublishedPosts()
  return pool.find((p) => p.slug === slug)
}

export function getSeriesPosts(series: string): Pick<BlogPost, "slug" | "title" | "seriesPart">[] {
  return getPublishedPosts()
    .filter((p) => p.series === series)
    .sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0))
    .map(({ slug, title, seriesPart }) => ({ slug, title, seriesPart }))
}

export function getAdjacentPosts(slug: string): {
  prev: Pick<BlogPost, "slug" | "title"> | null
  next: Pick<BlogPost, "slug" | "title"> | null
} {
  const published = getPublishedPosts().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const index = published.findIndex((p) => p.slug === slug)
  if (index === -1) return { prev: null, next: null }
  const prev = index < published.length - 1 ? published[index + 1] : null
  const next = index > 0 ? published[index - 1] : null
  return {
    prev: prev ? { slug: prev.slug, title: prev.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null,
  }
}
