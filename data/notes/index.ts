import type { ContentBlock } from "@/data/blog"
import { isLive } from "@/lib/schedule"

export interface NotePost {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  published: boolean
  content: ContentBlock[]
}

import _p0 from "./posts/how-i-organise-a-week"
import _p2 from "./posts/taking-lecture-notes-with-low-vision-in-mind"
import _p6 from "./posts/reading-list-autumn-term"
import _p10 from "./posts/why-i-keep-a-til-log"
import _p11 from "./posts/what-i-want-from-this-summer"
import _p12 from "./posts/how-i-decide-what-to-build-next"
import _p13 from "./posts/writing-down-why"
import _p14 from "./posts/getting-ready-for-a-new-term"
import _p15 from "./posts/plans-for-autumn-2026"
import _p16 from "./posts/prosthetics-health-tech"
import _p17 from "./posts/codeforces-auto-push"
import _p18 from "./posts/multi-sport-ai-predictor"
import _p19 from "./posts/one-eye-vision-research"
import _p21 from "./posts/fedora-beside-windows-on-my-thinkpad"

export const notePosts: NotePost[] = [_p0, _p2, _p6, _p10, _p11, _p12, _p13, _p14, _p15, _p16, _p17, _p18, _p19, _p21]

export function getPublishedNotes(): NotePost[] {
  const pool =
    process.env.NODE_ENV === "development" ? notePosts : notePosts.filter((p) => p.published && isLive(p.date))
  return [...pool].sort((a, b) => b.date.localeCompare(a.date))
}

export function getNotePostBySlug(slug: string): NotePost | undefined {
  return getPublishedNotes().find((p) => p.slug === slug)
}

export function getAdjacentNotes(slug: string): {
  prev: Pick<NotePost, "slug" | "title"> | null
  next: Pick<NotePost, "slug" | "title"> | null
} {
  const published = getPublishedNotes()
  const index = published.findIndex((p) => p.slug === slug)
  if (index === -1) return { prev: null, next: null }
  const prev = published[index + 1] ?? null
  const next = index > 0 ? published[index - 1] : null
  return {
    prev: prev ? { slug: prev.slug, title: prev.title } : null,
    next: next ? { slug: next.slug, title: next.title } : null,
  }
}
