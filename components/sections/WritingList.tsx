import Link from "next/link"
import { Section, SectionHeading } from "@/components/layout/Section"
import ArrowLink from "@/components/shared/ArrowLink"
import { getMainListPosts } from "@/data/blog"
import { PINNED_POSTS, postTypeLabel } from "@/data/blog/meta"
import { getPublishedTILEntries } from "@/data/til"
import { getPublishedNotes } from "@/data/notes"
import { fetchNewsletterIssues } from "@/lib/newsletter/newsletter"
import { ukShortDate } from "@/lib/time/short-date"
import { firstSentence, pickWriting, type WritingItem } from "@/lib/content/writing-list"

export async function getWritingItems(): Promise<WritingItem[]> {
  const issues = await fetchNewsletterIssues().catch(() => [])
  const posts = getMainListPosts()
  const pinned = PINNED_POSTS.flatMap((slug) => posts.filter((p) => p.slug === slug))
  const toItem = (p: (typeof posts)[number], isPinned: boolean): WritingItem => ({
    kind: postTypeLabel(p.type), title: p.title, summary: p.description, date: p.date, href: `/blog/${p.slug}`, pinned: isPinned,
  })
  return [
    ...pinned.map((p) => toItem(p, true)),
    ...posts.filter((p) => !PINNED_POSTS.includes(p.slug)).map((p) => toItem(p, false)),
    ...issues.map((i) => ({ kind: "Newsletter" as const, title: i.title, summary: i.subtitle ?? "", date: i.publishDate.slice(0, 10), href: i.href })),
    ...getPublishedTILEntries().map((t) => ({ kind: "TIL" as const, title: t.title, summary: firstSentence(t.body), date: t.date, href: `/til/${t.id}` })),
    ...getPublishedNotes().map((n) => ({ kind: "Note" as const, title: n.title, summary: n.description, date: n.date, href: `/notes/${n.slug}` })),
  ]
}

const ARCHIVES = [
  { href: "/blog", label: "All blog posts" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/til", label: "TIL" },
  { href: "/notes", label: "Notes" },
]

export default async function WritingList() {
  const rows = pickWriting(await getWritingItems())
  if (rows.length === 0) return null
  return (
    <Section labelledBy="writing">
      <SectionHeading id="writing" title="Writing" />
      <ol className="divide-y border-y">
        {rows.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group grid gap-x-6 gap-y-1 py-5 outline-offset-4 sm:grid-cols-[7.5rem_6.5rem_minmax(0,1fr)] focus-visible:outline-2 focus-visible:outline-ring"
            >
              <span className="text-sm text-muted-foreground tabular-nums sm:pt-0.5">
                <time dateTime={item.date}>{ukShortDate(item.date)}</time>
              </span>
              <span className="text-sm font-medium text-muted-foreground sm:pt-0.5">
                {item.kind}
                {item.pinned && <span className="ml-2 sm:ml-0 sm:block">Pinned</span>}
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-semibold leading-snug underline-offset-4 group-hover:underline motion-safe:transition-colors">
                  {item.title}
                </span>
                {item.summary && <span className="mt-1 block text-base text-muted-foreground leading-relaxed line-clamp-2">{item.summary}</span>}
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <nav aria-label="Writing archives" className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
        {ARCHIVES.map((a) => (
          <ArrowLink key={a.href} href={a.href}>{a.label}</ArrowLink>
        ))}
      </nav>
    </Section>
  )
}
