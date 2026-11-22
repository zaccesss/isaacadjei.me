"use client"

import { StatCard, BarChart, PieChart } from "@/components/analytics"
import { tableOf } from "@/components/analytics/chart-table"
import { Card } from "@/components/stats/StatsCharts"
import { listSummary, monthName, rangeSummary, relabel, topSummary } from "@/components/stats/chart-data"
import type { OpenSourceStats as Stats } from "@/lib/opensource/open-source"
import EmptyState from "@/components/shared/EmptyState"

export function OpenSourceStats({ s }: { s: Stats }) {
  if (s.total === 0) return <EmptyState title="No open source contributions yet" description="This fills in once the first contribution is logged." />
  const months = relabel(s.byMonth, monthName)
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="Contributions" value={s.total} />
        <StatCard label="Pull requests" value={s.pullRequests} />
        <StatCard label="Issues" value={s.issues} />
        <StatCard label="Merged" value={s.merged} />
        <StatCard label="Projects" value={s.projects} />
        <StatCard label="Languages" value={s.languages} />
      </div>
      <Card title="Categories" note="contributions per kind of work" alt={listSummary(s.byCategory, "contributions")} table={tableOf(s.byCategory, ["Kind of work", "Contributions"])}>
        <BarChart data={s.byCategory} dataKey="value" xKey="name" height={220} name="Contributions" />
      </Card>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card title="Projects" note="contributions per project" alt={topSummary(s.byProject, "contributions")} table={tableOf(s.byProject, ["Project", "Contributions"])}>
          <BarChart data={s.byProject} dataKey="value" xKey="name" height={220} name="Contributions" />
        </Card>
        <Card title="Languages" note="share of contributions" alt={topSummary(s.byLanguage, "contributions")} table={s.byLanguage.length > 6 ? tableOf(s.byLanguage, ["Language", "Contributions"]) : undefined}>
          <PieChart data={s.byLanguage} centreLabel="Contributions" />
        </Card>
        <Card title="Merged and open" note="contributions" alt={listSummary(s.byStatus, "contributions")}>
          <PieChart data={s.byStatus} centreLabel="Contributions" />
        </Card>
        <Card title="Contributions by month" note="contributions" alt={rangeSummary(months, "contributions")} table={tableOf(months, ["Month", "Contributions"])}>
          <BarChart data={months} dataKey="value" xKey="name" height={200} name="Contributions" />
        </Card>
      </div>
    </div>
  )
}
