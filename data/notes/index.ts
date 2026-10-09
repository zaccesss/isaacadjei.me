import type { ContentBlock } from "@/data/blog"
import { isLive } from "@/lib/schedule"

export type NoteBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "pre"; text: string }

export interface NoteReference {
  text: string
  url: string
}

export interface NoteEntry {
  slug: string
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  tags: string[]
  lead: string
  body: NoteBlock[]
  references: NoteReference[]
}

export function getNoteBySlug(slug: string): NoteEntry | undefined {
  return notes.find((n) => n.slug === slug)
}

import multiSportAiPredictor from "./entries/multi-sport-ai-predictor"
import prostheticsHealthTech from "./entries/prosthetics-health-tech"
import codeforcesAutoPush from "./entries/codeforces-auto-push"
import oneEyeVisionResearch from "./entries/one-eye-vision-research"

export const notes: NoteEntry[] = [
  multiSportAiPredictor,
  prostheticsHealthTech,
  codeforcesAutoPush,
  oneEyeVisionResearch,
]

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
import _p10 from "./posts/why-i-keep-a-til-log"
import _p11 from "./posts/what-i-want-from-this-summer"
import _p12 from "./posts/how-i-decide-what-to-build-next"
import _p13 from "./posts/writing-down-why"
import _p14 from "./posts/getting-ready-for-a-new-term"
import _p15 from "./posts/plans-for-autumn-2026"

export const notePosts: NotePost[] = [_p0, _p10, _p11, _p12, _p13, _p14, _p15]

export function getPublishedNotes(): NotePost[] {
  const pool =
    process.env.NODE_ENV === "development" ? notePosts : notePosts.filter((p) => p.published && isLive(p.date))
  return [...pool].sort((a, b) => b.date.localeCompare(a.date))
}

export function getNotePostBySlug(slug: string): NotePost | undefined {
  return getPublishedNotes().find((p) => p.slug === slug)
}
