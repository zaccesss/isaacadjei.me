import type { PublicContribution } from "@/lib/opensource/open-source"
import { compareCategories } from "@/lib/opensource/open-source-categories"

export const isMailedPatch = (url: string | null) => !!url && url.startsWith("https://lore.kernel.org/")

export type ContributionKind = "pull request" | "issue" | "patch" | "listing"

export type ListedContribution = {
  id: string
  project: string
  category: string
  title: string
  summary: string
  state: string
  kind: ContributionKind
  number: number | null
  language: string | null
  month: string
  url: string | null
  linkWord: string
  relation: { text: string; url: string | null } | null
  commit: { url: string; tree: string } | null
  pinned: boolean
}

const slug = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

export const filterValue = slug

function kindOf(c: PublicContribution): ContributionKind {
  if (isMailedPatch(c.url)) return "patch"
  return c.kind === "Issue" ? "issue" : c.kind === "Pull request" ? "pull request" : "listing"
}

export function toListed(contributions: PublicContribution[]): ListedContribution[] {
  const taken = new Map<string, number>()
  const ids = new Array<string>(contributions.length)
  for (let i = contributions.length - 1; i >= 0; i--) {
    const c = contributions[i]
    const base = slug(c.number != null ? `${c.project}-${c.number}` : `${c.project}-${c.title}`) || "entry"
    const seen = (taken.get(base) ?? 0) + 1
    taken.set(base, seen)
    ids[i] = seen === 1 ? base : `${base}-${seen}`
  }
  return contributions.map((c, i) => {
    const kind = kindOf(c)
    return {
      id: ids[i],
      project: c.project,
      category: c.category,
      title: c.title,
      summary: c.summary,
      state: kind === "patch" && c.status === "Merged" ? "Applied" : c.status,
      kind,
      number: c.number,
      language: c.language,
      month: c.date.slice(0, 7),
      url: c.url,
      linkWord: kind === "patch" && c.commit ? "thread" : kind,
      relation: c.relation,
      commit: c.commit,
      pinned: c.pinned,
    }
  })
}

export function repoPath(url: string | null): string | null {
  return url?.match(/^https:\/\/github\.com\/([^/]+\/[^/]+)/)?.[1] ?? null
}

export function searchWords(c: ListedContribution): string {
  return [c.project, repoPath(c.url), c.title, c.summary, c.category, c.language, c.state, c.kind, c.number != null ? `#${c.number}` : null]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
}

export function matchesQuery(words: string, query: string): boolean {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  return terms.every((t) => words.includes(t))
}

export type ContributionFilters = {
  search: string
  projects: string[]
  state: string
  kind: string
}

export const isFiltering = (f: ContributionFilters) => f.search.trim() !== "" || f.projects.length > 0 || f.state !== "" || f.kind !== ""

function projectScore(c: ListedContribution, query: string): number {
  const p = c.project.toLowerCase()
  const q = query.toLowerCase().trim()
  if (p === q) return 3
  if (p.startsWith(q)) return 2
  return p.includes(q) ? 1 : 0
}

export function filterContributions(rows: ListedContribution[], f: ContributionFilters): ListedContribution[] {
  const q = f.search.trim()
  const matches = rows.filter(
    (c) =>
      (f.projects.length === 0 || f.projects.includes(c.project)) &&
      (!f.state || filterValue(c.state) === f.state) &&
      (!f.kind || filterValue(c.kind) === f.kind) &&
      (!q || matchesQuery(searchWords(c), q)),
  )
  return q ? [...matches].sort((a, b) => projectScore(b, q) - projectScore(a, q)) : matches
}

const STATE_ORDER = ["Merged", "Applied", "Open"]
const KIND_ORDER: ContributionKind[] = ["pull request", "issue", "patch", "listing"]
const capitalised = (v: string) => v.charAt(0).toUpperCase() + v.slice(1)

function presentOptions(values: string[], order: readonly string[]) {
  const counts = new Map<string, number>()
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1)
  const known = order.filter((v) => counts.has(v))
  const others = [...counts.keys()].filter((v) => !order.includes(v)).sort()
  return [...known, ...others].map((v) => ({ value: filterValue(v), label: capitalised(v), count: counts.get(v)! }))
}

export const stateOptions = (rows: ListedContribution[]) => presentOptions(rows.map((c) => c.state), STATE_ORDER)
export const kindOptions = (rows: ListedContribution[]) => presentOptions(rows.map((c) => c.kind), KIND_ORDER)

export type ProjectGroup = { project: string; items: ListedContribution[] }
export type CategoryGroup = { category: string; projects: ProjectGroup[] }

const hasPinned = (items: ListedContribution[]) => (items.some((c) => c.pinned) ? 1 : 0)

export function groupByCategory(rows: ListedContribution[]): CategoryGroup[] {
  const categories = new Map<string, ListedContribution[]>()
  for (const c of rows) categories.set(c.category, [...(categories.get(c.category) ?? []), c])
  return [...categories.entries()]
    .sort((a, b) => hasPinned(b[1]) - hasPinned(a[1]) || compareCategories(a[0], b[0]))
    .map(([category, items]) => {
      const projects = new Map<string, ListedContribution[]>()
      for (const c of items) projects.set(c.project, [...(projects.get(c.project) ?? []), c])
      return {
        category,
        projects: [...projects.entries()]
          .sort((a, b) => hasPinned(b[1]) - hasPinned(a[1]) || b[1].length - a[1].length || a[0].localeCompare(b[0]))
          .map(([project, list]) => ({ project, items: [...list].sort((a, b) => Number(b.pinned) - Number(a.pinned)) })),
      }
    })
}

export type ContributionHit = { href: string; project: string; title: string; summary: string; month: string; words: string }

export function toSearchHits(rows: ListedContribution[]): ContributionHit[] {
  return rows.map((c) => ({
    href: `/open-source#${c.id}`,
    project: c.project,
    title: c.title,
    summary: c.summary,
    month: c.month,
    words: searchWords(c),
  }))
}
