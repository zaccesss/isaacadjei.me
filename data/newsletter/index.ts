import type { ContentBlock } from "@/data/blog"
import { posts } from "@/data/blog"
import { tilEntries } from "@/data/til"
import { notePosts } from "@/data/notes"
import { videos, podcasts, books, articles, resources, others, MONTH_NUMBER, type Month } from "@/data/consumed"
import { isLive } from "@/lib/schedule"

export interface NewsletterIssueFile {
  kind?: "letter" | "outside"
  number: number
  slug: string
  title: string
  subtitle: string
  tags: string[]
  date: string
  intro: ContentBlock[]
  outro?: ContentBlock[]
  outside?: { title: string; blocks: ContentBlock[] }
  greeting?: string
  signOff?: string
  skip?: string[]
  published: boolean
}

export const EMAIL_FROM_DATE = "2026-10-16"

export const GREETINGS = ["Hi,", "Hello,", "Hi there,", "Hello again,"]
export const SIGN_OFFS = ["Speak soon,", "Until next time,", "Thanks for reading,", "Talk soon,", "All the best,"]
export const SIGN_OFF_NAME = "Zac"

export const SIGNATURE = {
  name: "Isaac Adjei",
  lines: ["Electronic Engineering and Computer Science, Aston University", "Founder and developer: PHAEMOS, MELOPHOS and Vitafolio"],
  logo: "/brand/png/ia-email-256.png",
  emailLogo: "https://raw.githubusercontent.com/zaccesss/isaacadjei.me/main/public/brand/png/ia-email-256.png",
  links: [
    { label: "isaacadjei.me", href: "https://isaacadjei.me" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/isaacadjei" },
    { label: "GitHub", href: "https://github.com/zaccesss" },
  ],
  booking: {
    label: "Book a call with me",
    href: "https://isaacadjei.me/book",
    emailIcon: "https://raw.githubusercontent.com/zaccesss/isaacadjei.me/main/public/brand/png/booking-icon-40.png",
  },
}

const FIRST_WINDOW_START = "2026-05-01"

export type GatheredKind = "blog" | "til" | "note"

export interface GatheredItem {
  kind: GatheredKind
  key: string
  title: string
  description: string
  href: string
  date: string
  image?: string
}

export interface WorthItem {
  kind: string
  title: string
  by: string
  url: string
  date: string
}

export interface Issue extends NewsletterIssueFile {
  greeting: string
  signOff: string
  worth: WorthItem[]
  emailed: boolean
  items: GatheredItem[]
}

import _0 from "./issues/issue-00"
import _1 from "./issues/issue-01"
import _2 from "./issues/issue-02"
import _3 from "./issues/issue-03"
import _4 from "./issues/issue-04"
import _5 from "./issues/issue-05"
import _6 from "./issues/issue-06"
import _7 from "./issues/issue-07"
import _8 from "./issues/issue-08"
import _9 from "./issues/issue-09"
import _10 from "./issues/issue-10"
import _11 from "./issues/issue-11"
import _o1 from "./issues/outside-01"
import _o2 from "./issues/outside-02"
import _o3 from "./issues/outside-03"
import _o4 from "./issues/outside-04"
import _o5 from "./issues/outside-05"
import _o6 from "./issues/outside-06"
import _o7 from "./issues/outside-07"
import _o8 from "./issues/outside-08"
import _o9 from "./issues/outside-09"
import _o10 from "./issues/outside-10"
import _o11 from "./issues/outside-11"

const files: NewsletterIssueFile[] = [_0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _o1, _o2, _o3, _o4, _o5, _o6, _o7, _o8, _o9, _o10, _o11, ]

function dayAfter(date: string): string {
  const [y, m, d] = date.split("-").map(Number)
  return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10)
}

export function gatherBetween(start: string, end: string, skip: string[] = []): GatheredItem[] {
  const inWindow = (date: string) => date.slice(0, 10) >= start && date.slice(0, 10) <= end
  const items: GatheredItem[] = [
    ...posts
      .filter((p) => p.published && inWindow(p.date))
      .map((p) => ({
        kind: "blog" as const,
        key: `blog:${p.slug}`,
        title: p.title,
        description: p.description,
        href: `/blog/${p.slug}`,
        date: p.date,
        image: p.cover_image,
      })),
    ...tilEntries
      .filter((t) => t.published && inWindow(t.date))
      .map((t) => ({
        kind: "til" as const,
        key: `til:${t.id}`,
        title: t.title,
        description: t.body,
        href: `/til/${t.id}`,
        date: t.date,
      })),
    ...notePosts
      .filter((n) => n.published && inWindow(n.date))
      .map((n) => ({
        kind: "note" as const,
        key: `note:${n.slug}`,
        title: n.title,
        description: n.description,
        href: `/notes/${n.slug}`,
        date: n.date,
      })),
  ]
  return items.filter((i) => !skip.includes(i.key)).sort((a, b) => b.date.localeCompare(a.date))
}

const pad = (n: number) => String(n).padStart(2, "0")
const consumedDate = (e: { year: number; month: Month; day?: number }) =>
  e.day ? `${e.year}-${pad(MONTH_NUMBER[e.month] + 1)}-${pad(e.day)}` : null

export function worthBetween(start: string, end: string): WorthItem[] {
  const all: (Omit<WorthItem, "date"> & { date: string | null })[] = [
    ...books.map((b) => ({ kind: "Book", title: b.title, by: b.author, url: b.link ?? "https://www.isaacadjei.me/consumed/books", date: consumedDate(b) })),
    ...articles.map((a) => ({ kind: "Article", title: a.title, by: a.source, url: a.url, date: consumedDate(a) })),
    ...videos.map((v) => ({
      kind: "Video",
      title: v.title,
      by: v.channel,
      url: v.isPlaylist ? `https://www.youtube.com/playlist?list=${v.id}` : `https://www.youtube.com/watch?v=${v.id}`,
      date: consumedDate(v),
    })),
    ...podcasts.map((p) => ({ kind: "Podcast", title: p.title, by: p.show, url: `https://open.spotify.com/${p.embedType}/${p.spotifyId}`, date: consumedDate(p) })),
    ...resources.map((r) => ({ kind: "Resource", title: r.title, by: r.category, url: r.url, date: consumedDate(r) })),
    ...others.map((o) => ({ kind: "Link", title: o.title, by: o.source, url: o.url, date: consumedDate(o) })),
  ]
  return all
    .filter((w): w is WorthItem => w.date !== null && w.date >= start && w.date <= end)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5)
}

export function issueLabel(issue: Pick<NewsletterIssueFile, "kind" | "number">): string {
  return `${issue.kind === "outside" ? "Outside" : "Issue"} ${issue.number}`
}

export function allIssues(): Issue[] {
  const sorted = [...files].sort((a, b) => a.date.localeCompare(b.date))
  const letters = sorted.filter((f) => f.kind !== "outside")
  return sorted.map((file) => {
    if (file.kind === "outside") {
      return {
        ...file,
        emailed: file.date >= EMAIL_FROM_DATE,
        items: [],
        worth: [],
        greeting: file.greeting ?? GREETINGS[file.number % GREETINGS.length],
        signOff: file.signOff ?? SIGN_OFFS[file.number % SIGN_OFFS.length],
      }
    }
    const i = letters.indexOf(file)
    const start = i === 0 ? FIRST_WINDOW_START : dayAfter(letters[i - 1].date)
    return {
      ...file,
      emailed: file.date >= EMAIL_FROM_DATE,
      items: gatherBetween(start, file.date, file.skip),
      worth: worthBetween(start, file.date),
      greeting: file.greeting ?? GREETINGS[file.number % GREETINGS.length],
      signOff: file.signOff ?? SIGN_OFFS[file.number % SIGN_OFFS.length],
    }
  })
}

export function getPublishedIssues(now: Date = new Date()): Issue[] {
  const all = allIssues()
  const pool = process.env.NODE_ENV === "development" ? all : all.filter((i) => i.published && isLive(i.date, now))
  return [...pool].reverse()
}

export function getIssueBySlug(slug: string): Issue | undefined {
  return getPublishedIssues().find((i) => i.slug === slug)
}

export function issueForDate(date: string): Issue | undefined {
  return allIssues().find((i) => i.published && i.date === date)
}
