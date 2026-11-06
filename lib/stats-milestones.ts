import { projects } from "@/data/projects"
import type { Milestone } from "@/lib/stats-milestone-place"

export type { Milestone }

const LAUNCHES: (Milestone & { project: string })[] = [
  { project: "vitafolio", date: "2026-10-08", label: "Vitafolio", detail: "Vitafolio gets its project page on this site" },
  { project: "zacess", date: "2026-10-13", label: "Zacess", detail: "Zacess launches at zacess.com" },
  { project: "footprints", date: "2026-11-05", label: "Footprints", detail: "Footprints 0.1.0 to 0.4.0 are released" },
]

export function getMilestones(today = new Date()): Milestone[] {
  const live = new Set(projects.filter((p) => p.status === "live").map((p) => p.id))
  const todayIso = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(today)
  return LAUNCHES.filter((l) => live.has(l.project) && l.date <= todayIso).map(({ date, label, detail }) => ({ date, label, detail }))
}
