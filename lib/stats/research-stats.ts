import { releases, type ChangeEntry } from "@/data/changelog/releases"
import { publications, type Publication } from "@/data/respub"
import { zenodoRecordId } from "@/data/respub/cite"
import { keyPapers, researchInterests, researchLines, type ResearchStatus } from "@/data/respub/research"
import { zenodoStats } from "@/lib/integrations/zenodo"

type Named = { name: string; value: number }

const KINDS = ["added", "changed", "fixed", "security"] as const
const KIND_NAME: Record<(typeof KINDS)[number], string> = { added: "Added", changed: "Changed", fixed: "Fixed", security: "Security" }
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const QUIET = /^small behind-the-scenes improvements?$/i

const linesOf = (r: ChangeEntry) => KINDS.flatMap((kind) => r[kind] ?? [])
export const isQuietRelease = (r: ChangeEntry) => {
  const lines = linesOf(r)
  return lines.length > 0 && lines.every((line) => QUIET.test(line.trim()))
}
const monthName = (key: string) => `${MONTHS[Number(key.slice(5, 7)) - 1]} ${key.slice(2, 4)}`

export type ReleaseStats = {
  total: number
  visible: number
  quiet: number
  lines: number
  first: string | null
  latest: { version: string; date: string } | null
  busiest: Named | null
  byMonth: { name: string; visible: number; quiet: number; total: number }[]
  growth: Named[]
  kinds: Named[]
  sizes: Named[]
  weekdays: Named[]
  linesByMonth: Named[]
}

export function releaseStats(list: ChangeEntry[] = releases): ReleaseStats {
  const dated = list.filter((r) => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && r.version !== "Unreleased")
  const months = new Map<string, { visible: number; quiet: number; lines: number }>()
  const kinds = new Map<string, number>(KINDS.map((k) => [KIND_NAME[k], 0]))
  const sizes = new Map<string, number>([["Major", 0], ["Minor", 0], ["Patch", 0]])
  const weekdays = WEEKDAYS.map((name) => ({ name, value: 0 }))
  let quiet = 0
  let lines = 0

  for (const r of dated) {
    const key = r.date.slice(0, 7)
    const month = months.get(key) ?? { visible: 0, quiet: 0, lines: 0 }
    const isQuiet = isQuietRelease(r)
    if (isQuiet) { month.quiet++; quiet++ } else month.visible++
    const count = isQuiet ? 0 : linesOf(r).length
    month.lines += count
    lines += count
    months.set(key, month)
    if (!isQuiet) for (const k of KINDS) kinds.set(KIND_NAME[k], (kinds.get(KIND_NAME[k]) ?? 0) + (r[k]?.length ?? 0))
    const [, minor, patch] = r.version.replace(/^v/, "").split(".").map(Number)
    const size = patch ? "Patch" : minor ? "Minor" : "Major"
    sizes.set(size, (sizes.get(size) ?? 0) + 1)
    weekdays[(new Date(`${r.date}T12:00:00Z`).getUTCDay() + 6) % 7].value++
  }

  const keys = [...months.keys()].sort()
  const byMonth = keys.map((key) => {
    const m = months.get(key)!
    return { name: monthName(key), visible: m.visible, quiet: m.quiet, total: m.visible + m.quiet }
  })
  let running = 0
  const growth = byMonth.map((m) => ({ name: m.name, value: (running += m.total) }))
  const busiest = byMonth.reduce<Named | null>((best, m) => (!best || m.total > best.value ? { name: m.name, value: m.total } : best), null)
  const sorted = [...dated].sort((a, b) => a.date.localeCompare(b.date))
  const last = dated[0]

  return {
    total: dated.length,
    visible: dated.length - quiet,
    quiet,
    lines,
    first: sorted[0]?.date ?? null,
    latest: last ? { version: last.version, date: last.date } : null,
    busiest,
    byMonth,
    growth,
    kinds: [...kinds].map(([name, value]) => ({ name, value })).filter((k) => k.value > 0),
    sizes: [...sizes].map(([name, value]) => ({ name, value })).filter((k) => k.value > 0),
    weekdays,
    linesByMonth: keys.map((key) => ({ name: monthName(key), value: months.get(key)!.lines })),
  }
}

export type ReleaseDetail = {
  days: { date: string; value: number }[]
  perRelease: number[]
  biggest: { version: string; label: string; date: string; lines: number }[]
  gaps: number[]
  kindsByMonth: { name: string; Added: number; Changed: number; Fixed: number; Security: number }[]
  longestRun: number
  releaseDays: number
}

export function releaseDetail(list: ChangeEntry[] = releases): ReleaseDetail {
  const dated = list.filter((r) => /^\d{4}-\d{2}-\d{2}$/.test(r.date) && r.version !== "Unreleased")
  const perDay = new Map<string, number>()
  const months = new Map<string, { Added: number; Changed: number; Fixed: number; Security: number }>()
  for (const r of dated) {
    perDay.set(r.date, (perDay.get(r.date) ?? 0) + 1)
    const key = r.date.slice(0, 7)
    const m = months.get(key) ?? { Added: 0, Changed: 0, Fixed: 0, Security: 0 }
    for (const k of KINDS) m[KIND_NAME[k] as keyof typeof m] += r[k]?.length ?? 0
    months.set(key, m)
  }
  const dates = [...perDay.keys()].sort()
  const dayNumber = (iso: string) => Math.round(Date.parse(`${iso}T12:00:00Z`) / 86_400_000)
  const gaps = dates.slice(1).map((d, i) => dayNumber(d) - dayNumber(dates[i]))
  let run = dates.length ? 1 : 0
  let longestRun = run
  for (const gap of gaps) {
    run = gap === 1 ? run + 1 : 1
    longestRun = Math.max(longestRun, run)
  }
  return {
    days: dates.map((date) => ({ date, value: perDay.get(date)! })),
    perRelease: dated.map((r) => linesOf(r).length),
    biggest: dated
      .map((r) => ({ version: r.version, label: r.label ?? "", date: r.date, lines: linesOf(r).length }))
      .sort((a, b) => b.lines - a.lines)
      .slice(0, 10),
    gaps,
    kindsByMonth: [...months.keys()].sort().map((key) => ({ name: monthName(key), ...months.get(key)! })),
    longestRun,
    releaseDays: dates.length,
  }
}

const TYPE_NAME: Record<Publication["type"], string> = {
  "technical-note": "Technical note",
  conference: "Conference paper",
  journal: "Journal article",
  preprint: "Preprint",
  "hardware-design": "Hardware design",
  software: "Software",
}
const STAGE_NAME: Record<ResearchStatus, string> = { simulation: "In simulation", hardware: "Hardware phase", live: "In use" }

export type PublicationRow = { id: string; name: string; kind: string; year: number; views: number | null; downloads: number | null; uniqueViews: number | null; uniqueDownloads: number | null }

export type ResearchStats = {
  publications: {
    count: number
    views: number | null
    downloads: number | null
    rows: PublicationRow[]
    kinds: Named[]
    keywords: Named[]
    byYear: Named[]
  }
  research: {
    lines: number
    interests: number
    papers: number
    materials: number
    stages: Named[]
    depth: { name: string; references: number; materials: number }[]
    papersByGroup: Named[]
  }
  releases: ReleaseStats
}

const tally = (items: string[]): Named[] => {
  const counts = new Map<string, number>()
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1)
  return [...counts].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}

export async function getResearchStats(): Promise<ResearchStats> {
  const counted = await Promise.all(
    publications.map(async (pub) => {
      const id = zenodoRecordId(pub)
      return { pub, stats: id ? await zenodoStats(id) : null }
    }),
  )
  const rows: PublicationRow[] = counted.map(({ pub, stats }) => ({
    id: pub.id,
    name: pub.title,
    kind: TYPE_NAME[pub.type],
    year: pub.year,
    views: stats?.views ?? null,
    downloads: stats?.downloads ?? null,
    uniqueViews: stats?.unique_views ?? null,
    uniqueDownloads: stats?.unique_downloads ?? null,
  }))
  const any = rows.some((r) => r.views !== null)
  const sum = (pick: (r: PublicationRow) => number | null) => (any ? rows.reduce((n, r) => n + (pick(r) ?? 0), 0) : null)

  return {
    publications: {
      count: publications.length,
      views: sum((r) => r.views),
      downloads: sum((r) => r.downloads),
      rows,
      kinds: tally(publications.map((p) => TYPE_NAME[p.type])),
      keywords: tally(publications.flatMap((p) => p.keywords ?? [])),
      byYear: tally(publications.map((p) => String(p.year))).sort((a, b) => a.name.localeCompare(b.name)),
    },
    research: {
      lines: researchLines.length,
      interests: researchInterests.length,
      papers: keyPapers.reduce((n, group) => n + group.papers.length, 0),
      materials: researchLines.reduce((n, line) => n + line.materials.length, 0),
      stages: tally(researchLines.map((line) => STAGE_NAME[line.status])),
      depth: researchLines.map((line) => ({ name: line.name, references: line.links.length, materials: line.materials.length })),
      papersByGroup: keyPapers.map((group) => ({ name: group.line, value: group.papers.length })),
    },
    releases: releaseStats(),
  }
}
