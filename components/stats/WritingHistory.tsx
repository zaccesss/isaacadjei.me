"use client"

import { useMemo } from "react"
import { useAnalyticsPeriod, filterByPeriod } from "@/components/analytics"
import { computeContentStats, type Named, type RawPost, type RawTIL, type RawProject, type RawDated } from "@/lib/content-stats-compute"
import { WritingStats } from "@/components/stats/StatsCharts"
import { writingExtra } from "@/components/stats/chart-data"
import type { Milestone } from "@/lib/stats-milestone-place"

export function WritingHistory({
  posts, til, projects, notes, issues, consumed, milestones = [],
}: {
  posts: RawPost[]
  til: RawTIL[]
  notes: RawDated[]
  issues: RawDated[]
  projects: RawProject[]
  consumed: Named[]
  milestones?: Milestone[]
}) {
  const { period } = useAnalyticsPeriod()
  const periodPosts = useMemo(() => filterByPeriod(posts, period, (p) => p.date), [posts, period])
  const periodTil = useMemo(() => filterByPeriod(til, period, (t) => t.date), [til, period])
  const periodProjects = useMemo(() => filterByPeriod(projects, period, (p) => p.date), [projects, period])
  const periodNotes = useMemo(() => filterByPeriod(notes, period, (n) => n.date), [notes, period])
  const periodIssues = useMemo(() => filterByPeriod(issues, period, (i) => i.date), [issues, period])
  const c = useMemo(
    () => ({ ...computeContentStats(periodPosts, periodTil, periodProjects, periodNotes, periodIssues), consumed }),
    [periodPosts, periodTil, periodProjects, periodNotes, periodIssues, consumed],
  )
  const extra = useMemo(() => writingExtra(periodPosts, periodTil, periodNotes, periodIssues), [periodPosts, periodTil, periodNotes, periodIssues])
  return <WritingStats c={c} milestones={milestones} extra={extra} />
}
