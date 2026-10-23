import { unstable_cache } from "next/cache"
import { supabase } from "@/lib/supabase"

export type PublicKind = "Pull request" | "Issue" | "Listing"

export type PublicContribution = {
  project: string
  kind: PublicKind
  number: number | null
  title: string
  summary: string
  url: string | null
  status: "Merged" | "Open"
  language: string | null
  date: string
  relation: { text: string; url: string | null } | null
}

export type Named = { name: string; value: number }

export type OpenSourceStats = {
  contributions: PublicContribution[]
  total: number
  merged: number
  pullRequests: number
  issues: number
  projects: number
  languages: number
  byProject: Named[]
  byLanguage: Named[]
  byStatus: Named[]
  byMonth: Named[]
}

const projectName = (repo: string) => (repo.includes("/") ? repo.split("/")[1] : repo)

const tally = (items: string[]): Named[] => {
  const m = new Map<string, number>()
  for (const i of items) m.set(i, (m.get(i) ?? 0) + 1)
  return [...m.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}

type Row = {
  id: string
  repo: string
  pr_title: string
  pr_url: string | null
  pr_number: number | null
  kind: "pr" | "issue" | "other"
  related_id: string | null
  is_private: boolean
  status: string
  language: string | null
  summary: string | null
  submitted_at: string
}

const KIND_LABEL: Record<Row["kind"], PublicKind> = { pr: "Pull request", issue: "Issue", other: "Listing" }

const numberOf = (r: Row) => r.pr_number ?? (Number(r.pr_url?.match(/\/(?:pull|issues)\/(\d+)/)?.[1]) || null)

const ref = (r: Row, from: Row) => {
  const n = numberOf(r)
  if (n == null) return r.pr_title
  return r.repo === from.repo ? `#${n}` : `${projectName(r.repo)}#${n}`
}

function relationText(self: Row, other: Row, outgoing: boolean): string {
  const target = ref(other, self)
  if (self.kind === "pr" && other.kind === "issue") return `Fixes ${target}`
  if (self.kind === "issue" && other.kind === "pr") return `Fixed by ${target}`
  return outgoing ? `Related to ${target}` : `Referenced by ${target}`
}

async function compute(): Promise<OpenSourceStats> {
  const { data } = await supabase
    .from("opensource_contributions")
    .select("id, repo, pr_title, pr_url, pr_number, kind, related_id, is_private, status, language, summary, submitted_at")
    .eq("show_public", true)
    .eq("is_private", false)
    .in("status", ["merged", "open", "draft"])
    .order("submitted_at", { ascending: false })
  const rows = ((data ?? []) as Row[]).filter((r) => !r.is_private)
  const byId = new Map(rows.map((r) => [r.id, r]))
  const pointedAtBy = new Map<string, Row>()
  for (const r of rows) if (r.related_id && byId.has(r.related_id) && !pointedAtBy.has(r.related_id)) pointedAtBy.set(r.related_id, r)
  const relationOf = (r: Row): PublicContribution["relation"] => {
    const out = r.related_id ? byId.get(r.related_id) : undefined
    if (out) return { text: relationText(r, out, true), url: out.pr_url }
    const back = pointedAtBy.get(r.id)
    if (back) return { text: relationText(r, back, false), url: back.pr_url }
    return null
  }
  const contributions: PublicContribution[] = rows.map((r) => ({
    project: projectName(r.repo),
    kind: KIND_LABEL[r.kind] ?? "Listing",
    number: numberOf(r),
    title: r.pr_title,
    summary: r.summary || r.pr_title,
    url: r.pr_url,
    status: r.status === "merged" ? "Merged" : "Open",
    language: r.language,
    date: r.submitted_at.slice(0, 10),
    relation: relationOf(r),
  }))
  const months = new Map<string, number>()
  for (const c of contributions) months.set(c.date.slice(0, 7), (months.get(c.date.slice(0, 7)) ?? 0) + 1)
  return {
    contributions,
    total: contributions.length,
    merged: contributions.filter((c) => c.status === "Merged").length,
    pullRequests: contributions.filter((c) => c.kind === "Pull request").length,
    issues: contributions.filter((c) => c.kind === "Issue").length,
    projects: new Set(contributions.map((c) => c.project)).size,
    languages: new Set(contributions.map((c) => c.language).filter(Boolean)).size,
    byProject: tally(contributions.map((c) => c.project)),
    byLanguage: tally(contributions.map((c) => c.language ?? "Other")),
    byStatus: tally(contributions.map((c) => c.status)),
    byMonth: [...months.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([name, value]) => ({ name, value })),
  }
}

export const getOpenSourceStats = unstable_cache(compute, ["open-source-v2"], { revalidate: 3600, tags: ["open-source"] })
