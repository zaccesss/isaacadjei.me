"use client"

import { StatCard, BarChart, PieChart } from "@/components/analytics"
import type { OpenSourceStats as Stats } from "@/lib/open-source"

function Card({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4">
      <div className="flex items-baseline justify-between gap-2 mb-3">
        <h3 className="text-sm font-semibold">{title}</h3>
        {note && <span className="text-[11px] text-muted-foreground">{note}</span>}
      </div>
      {children}
    </div>
  )
}

export function OpenSourceStats({ s }: { s: Stats }) {
  if (s.total === 0) return null
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard label="Contributions" value={s.total} />
        <StatCard label="Pull requests" value={s.pullRequests} />
        <StatCard label="Issues" value={s.issues} />
        <StatCard label="Merged" value={s.merged} />
        <StatCard label="Projects" value={s.projects} />
        <StatCard label="Languages" value={s.languages} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card title="Projects" note="contributions per project">
          <BarChart data={s.byProject.map((p) => ({ name: p.name, count: p.value }))} dataKey="count" xKey="name" height={220} />
        </Card>
        <Card title="Languages" note="share of contributions">
          <PieChart data={s.byLanguage} height={220} />
        </Card>
        <Card title="Merged and open">
          <PieChart data={s.byStatus} height={200} />
        </Card>
        <Card title="Contributions by month">
          <BarChart data={s.byMonth.map((m) => ({ name: m.name, count: m.value }))} dataKey="count" xKey="name" height={200} />
        </Card>
      </div>
    </div>
  )
}
