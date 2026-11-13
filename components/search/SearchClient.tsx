"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ExternalLink, Search } from "lucide-react"
import type { BlogPost } from "@/data/blog"
import type { TILEntry } from "@/data/til"
import type { Project } from "@/data/projects"
import type { Publication } from "@/data/respub"
import type { NewsletterIssue } from "@/app/api/newsletter-issues/route"
import { relevanceScore, fieldScore } from "@/lib/content/search"
import { matchesQuery, type ContributionHit } from "@/lib/opensource/open-source-list"

interface NoteEntry {
  href: string
  title: string
  description: string
}

interface ConsumedEntry {
  href: string
  title: string
  body: string
  badge: string
  tags: string[]
}

interface Props {
  posts: (BlogPost & { readingTime: number })[]
  tils: TILEntry[]
  projects: Project[]
  publications: Publication[]
  research: { href: string; title: string; body: string }[]
  notes: NoteEntry[]
  consumed: ConsumedEntry[]
}

function fmtDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

function fmtMonth(month: string) {
  return new Date(`${month}-01`).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const parts = text.split(new RegExp(`(${escaped})`, "gi"))
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-primary/20 text-foreground rounded-sm not-italic">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

export default function SearchClient({ posts, tils, projects, publications, research, notes, consumed }: Props) {
  const initial = useSearchParams().get("q") ?? ""
  const [query, setQuery] = useState(initial)
  const [debounced, setDebounced] = useState(initial.trim())
  const [issues, setIssues] = useState<NewsletterIssue[]>([])
  const [issuesLoading, setIssuesLoading] = useState(true)
  const [contributions, setContributions] = useState<ContributionHit[] | null>(null)
  const contributionsAsked = useRef(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query.trim()), 250)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    fetch("/api/newsletter-issues")
      .then((r) => r.json())
      .then((data) => {
        setIssues(Array.isArray(data) ? data : [])
        setIssuesLoading(false)
      })
      .catch(() => setIssuesLoading(false))
  }, [])

  const hasQuery = debounced.length > 0
  useEffect(() => {
    if (!hasQuery || contributionsAsked.current) return
    contributionsAsked.current = true
    fetch("/open-source/search-index")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setContributions(Array.isArray(data) ? data : []))
      .catch(() => setContributions([]))
  }, [hasQuery])
  const contributionsLoading = hasQuery && contributions === null

  const q = debounced.toLowerCase()

  const byRelevance = <T,>(arr: T[], title: (t: T) => string, body: (t: T) => string) =>
    arr.sort((a, b) => relevanceScore(title(b), body(b), debounced) - relevanceScore(title(a), body(a), debounced))

  const matchedPosts = q
    ? byRelevance(
        posts.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        ),
        (p) => p.title,
        (p) => p.description
      )
    : []

  const matchedTils = q
    ? byRelevance(
        tils.filter(
          (e) =>
            e.title.toLowerCase().includes(q) ||
            e.body.toLowerCase().includes(q) ||
            e.category.toLowerCase().includes(q) ||
            e.tags?.some((t) => t.toLowerCase().includes(q))
        ),
        (e) => e.title,
        (e) => e.body
      )
    : []

  const matchedProjects = q
    ? byRelevance(
        projects.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.longDescription.toLowerCase().includes(q) ||
            p.technologies.some((t) => t.toLowerCase().includes(q)) ||
            p.category.toLowerCase().includes(q)
        ),
        (p) => p.title,
        (p) => p.description
      )
    : []

  const matchedPubs = q
    ? byRelevance(
        publications.filter(
          (p) =>
            p.title.toLowerCase().includes(q) ||
            p.venue.toLowerCase().includes(q) ||
            p.abstract?.toLowerCase().includes(q) ||
            p.keywords?.some((k) => k.toLowerCase().includes(q))
        ),
        (p) => p.title,
        (p) => p.abstract ?? p.venue
      )
    : []

  const matchedResearch = q
    ? byRelevance(
        research.filter((r) => r.title.toLowerCase().includes(q) || r.body.toLowerCase().includes(q)),
        (r) => r.title,
        (r) => r.body
      )
    : []

  const matchedNotes = q
    ? byRelevance(
        notes.filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            n.description.toLowerCase().includes(q)
        ),
        (n) => n.title,
        (n) => n.description
      )
    : []

  const matchedConsumed = q
    ? byRelevance(
        consumed.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.body.toLowerCase().includes(q) ||
            c.badge.toLowerCase().includes(q) ||
            c.tags.some((t) => t.toLowerCase().includes(q))
        ),
        (c) => c.title,
        (c) => c.body
      )
    : []

  const matchedIssues = q
    ? issues
        .filter(
          (i) =>
            i.title.toLowerCase().includes(q) ||
            (i.subtitle ?? "").toLowerCase().includes(q) ||
            (i.tags ?? []).some((t) => t.toLowerCase().includes(q))
        )
        .sort(
          (a, b) =>
            fieldScore(b.title, debounced) - fieldScore(a.title, debounced)
        )
    : []

  const matchedContributions = q
    ? byRelevance(
        (contributions ?? []).filter((c) => matchesQuery(c.words, q)),
        (c) => c.project,
        (c) => c.title
      )
    : []

  const hasResults =
    matchedContributions.length > 0 ||
    matchedPosts.length > 0 ||
    matchedTils.length > 0 ||
    matchedProjects.length > 0 ||
    matchedPubs.length > 0 ||
    matchedResearch.length > 0 ||
    matchedNotes.length > 0 ||
    matchedConsumed.length > 0 ||
    matchedIssues.length > 0

  const newsletterHint = issuesLoading
    ? "loading newsletter issues..."
    : `${issues.length} newsletter ${issues.length === 1 ? "issue" : "issues"}`

  return (
    <div className="container max-w-2xl py-24 space-y-10">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Search</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Search across everything on the site.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          autoFocus
          type="search"
          placeholder="Search everything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {hasQuery && (
        <div className="space-y-10">
          {!hasResults && !issuesLoading && !contributionsLoading && (
            <p className="text-sm text-muted-foreground">
              No results for{" "}
              <span className="text-foreground font-medium">&ldquo;{debounced}&rdquo;</span>.
            </p>
          )}

          {matchedPosts.length > 0 && (
            <ResultSection heading={`Blog Posts (${matchedPosts.length})`}>
              {matchedPosts.map((post) => (
                <ResultCard
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  badge={post.type}
                  title={post.title}
                  body={post.description}
                  date={fmtDate(post.date)}
                  query={debounced}
                />
              ))}
            </ResultSection>
          )}

          {matchedTils.length > 0 && (
            <ResultSection heading={`TIL Entries (${matchedTils.length})`}>
              {matchedTils.map((entry) => (
                <ResultCard
                  key={entry.id}
                  href={`/til/${entry.id}`}
                  badge={entry.category}
                  title={entry.title}
                  body={entry.body}
                  date={fmtDate(entry.date)}
                  query={debounced}
                />
              ))}
            </ResultSection>
          )}

          {matchedProjects.length > 0 && (
            <ResultSection heading={`Projects (${matchedProjects.length})`}>
              {matchedProjects.map((project) => (
                <ResultCard
                  key={project.id}
                  href={`/projects/${project.id}`}
                  badge={project.category}
                  title={project.title}
                  body={project.description}
                  query={debounced}
                />
              ))}
            </ResultSection>
          )}

          {matchedPubs.length > 0 && (
            <ResultSection heading={`Publications (${matchedPubs.length})`}>
              {matchedPubs.map((pub) => (
                <ResultCard
                  key={pub.id}
                  href={`/publications/${pub.id}`}
                  badge={pub.type}
                  title={pub.title}
                  body={pub.abstract ?? pub.venue}
                  date={String(pub.year)}
                  query={debounced}
                />
              ))}
            </ResultSection>
          )}

          {matchedResearch.length > 0 && (
            <ResultSection heading={`Research (${matchedResearch.length})`}>
              {matchedResearch.map((line) => (
                <ResultCard key={line.href} href={line.href} badge="research" title={line.title} body={line.body} query={debounced} />
              ))}
            </ResultSection>
          )}

          {matchedContributions.length > 0 && (
            <ResultSection heading={`Open Source (${matchedContributions.length})`}>
              {matchedContributions.map((c) => (
                <ResultCard
                  key={c.href}
                  href={c.href}
                  badge={c.project}
                  title={c.title}
                  body={c.summary}
                  date={fmtMonth(c.month)}
                  query={debounced}
                />
              ))}
            </ResultSection>
          )}

          {matchedNotes.length > 0 && (
            <ResultSection heading={`Notes (${matchedNotes.length})`}>
              {matchedNotes.map((note) => (
                <ResultCard
                  key={note.href}
                  href={note.href}
                  badge="note"
                  title={note.title}
                  body={note.description}
                  query={debounced}
                />
              ))}
            </ResultSection>
          )}

          {matchedConsumed.length > 0 && (
            <ResultSection heading={`Consumed (${matchedConsumed.length})`}>
              {matchedConsumed.map((item) => (
                <ResultCard
                  key={item.href}
                  href={item.href}
                  badge={item.badge}
                  title={item.title}
                  body={item.body}
                  query={debounced}
                />
              ))}
            </ResultSection>
          )}

          {(matchedIssues.length > 0 || issuesLoading) && (
            <section className="space-y-4">
              <h2 className="text-sm font-mono text-primary uppercase tracking-widest">
                {issuesLoading
                  ? "Newsletter Issues (loading...)"
                  : `Newsletter Issues (${matchedIssues.length})`}
              </h2>
              {issuesLoading ? (
                <div className="space-y-3">
                  <div className="h-16 rounded-lg bg-muted/40 animate-pulse" />
                  <div className="h-16 rounded-lg bg-muted/40 animate-pulse" />
                </div>
              ) : matchedIssues.length > 0 ? (
                <ul className="space-y-3">
                  {matchedIssues.map((issue) => (
                    <li key={issue.id}>
                      <a
                        href={issue.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/60 hover:border-primary/40 p-4 transition-all"
                      >
                        <div className="space-y-1 min-w-0">
                          <p className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            <Highlight text={issue.title} query={debounced} />
                          </p>
                          {issue.subtitle && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              <Highlight text={issue.subtitle} query={debounced} />
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <p className="text-[11px] font-mono text-muted-foreground/70">
                            {fmtDate(issue.publishDate)}
                          </p>
                          <ExternalLink className="h-3 w-3 text-muted-foreground/50" />
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No newsletter issues match.</p>
              )}
            </section>
          )}
        </div>
      )}

      {!hasQuery && (
        <p className="text-sm text-muted-foreground">
          {posts.length} blog posts, {tils.length} TIL entries, {projects.length} projects,{" "}
          {publications.length} {publications.length === 1 ? "publication" : "publications"},{" "}
          {research.length} research lines,{" "}
          {consumed.length} consumed items, {notes.length} notes and {newsletterHint}.
        </p>
      )}
    </div>
  )
}

function ResultSection({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-mono text-primary uppercase tracking-widest">{heading}</h2>
      <ul className="space-y-3">{children}</ul>
    </section>
  )
}

function ResultCard({
  href,
  badge,
  title,
  body,
  date,
  query,
}: {
  href: string
  badge: string
  title: string
  body: string
  date?: string
  query: string
}) {
  return (
    <li>
      <Link
        href={href}
        className="group flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/60 hover:border-primary/40 p-4 transition-all"
      >
        <div className="space-y-1.5 min-w-0">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border border-border/60 rounded px-1.5 py-0.5">
            {badge}
          </span>
          <p className="font-semibold text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
            <Highlight text={title} query={query} />
          </p>
          <p className="text-xs text-muted-foreground line-clamp-2">
            <Highlight text={body} query={query} />
          </p>
        </div>
        {date && (
          <p className="text-[11px] font-mono text-muted-foreground/70 shrink-0">{date}</p>
        )}
      </Link>
    </li>
  )
}
