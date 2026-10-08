"use client"

import { useMemo } from "react"
import { useAnalyticsPeriod, filterByPeriod } from "@/components/analytics"
import { computeContentStats, type Named, type RawPost, type RawTIL, type RawProject } from "@/lib/content-stats-compute"
import { WritingStats } from "@/components/stats/StatsCharts"

export function WritingHistory({
  posts, til, projects, consumed,
}: {
  posts: RawPost[]
  til: RawTIL[]
  projects: RawProject[]
  consumed: Named[]
}) {
  const { period } = useAnalyticsPeriod()
  const periodPosts = useMemo(() => filterByPeriod(posts, period, (p) => p.date), [posts, period])
  const periodTil = useMemo(() => filterByPeriod(til, period, (t) => t.date), [til, period])
  const periodProjects = useMemo(() => filterByPeriod(projects, period, (p) => p.date), [projects, period])
  const c = useMemo(
    () => ({ ...computeContentStats(periodPosts, periodTil, periodProjects), consumed }),
    [periodPosts, periodTil, periodProjects, consumed],
  )
  return <WritingStats c={c} />
}
