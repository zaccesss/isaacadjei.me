import { unstable_cache } from "next/cache"
import { supabase } from "@/lib/supabase"

export type PublicContribution = {
  project: string
  title: string
  summary: string
  url: string | null
  status: "Merged" | "Open"
  language: string | null
  date: string
}

export type Named = { name: string; value: number }

export type OpenSourceStats = {
  contributions: PublicContribution[]
  total: number
  merged: number
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

async function compute(): Promise<OpenSourceStats> {
  const { data } = await supabase
    .from("opensource_contributions")
    .select("repo, pr_title, pr_url, status, language, summary, submitted_at")
    .eq("show_public", true)
    .in("status", ["merged", "open", "draft"])
    .order("submitted_at", { ascending: false })
  const rows = (data ?? []) as { repo: string; pr_title: string; pr_url: string | null; status: string; language: string | null; summary: string | null; submitted_at: string }[]
  const contributions: PublicContribution[] = rows.map((r) => ({
    project: projectName(r.repo),
    title: r.pr_title,
    summary: r.summary || r.pr_title,
    url: r.pr_url,
    status: r.status === "merged" ? "Merged" : "Open",
    language: r.language,
    date: r.submitted_at.slice(0, 10),
  }))
  const months = new Map<string, number>()
  for (const c of contributions) months.set(c.date.slice(0, 7), (months.get(c.date.slice(0, 7)) ?? 0) + 1)
  return {
    contributions,
    total: contributions.length,
    merged: contributions.filter((c) => c.status === "Merged").length,
    projects: new Set(contributions.map((c) => c.project)).size,
    languages: new Set(contributions.map((c) => c.language).filter(Boolean)).size,
    byProject: tally(contributions.map((c) => c.project)),
    byLanguage: tally(contributions.map((c) => c.language ?? "Other")),
    byStatus: tally(contributions.map((c) => c.status)),
    byMonth: [...months.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([name, value]) => ({ name, value })),
  }
}

export const getOpenSourceStats = unstable_cache(compute, ["open-source-v1"], { revalidate: 3600, tags: ["open-source"] })
