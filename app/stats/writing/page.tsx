import type { Metadata } from "next"
import { StatsPageHeader } from "@/components/stats/StatsPageHeader"
import { WritingHistory } from "@/components/stats/WritingHistory"
import { getRawContentItems, getConsumedStats } from "@/lib/content-stats"
import { AnalyticsPeriodProvider, PeriodSelector } from "@/components/analytics"

export const metadata: Metadata = {
  title: "Writing and Projects Stats",
  description: "Numbers about what I publish: posts, TILs, notes and newsletter issues by month, what I write about, my projects and what I read and watch.",
  alternates: { canonical: "https://www.isaacadjei.me/stats/writing" },
  openGraph: { images: ["/api/og?title=Writing%20and%20Projects&description=Numbers%20about%20what%20I%20publish."] },
}

export default function StatsWritingPage() {
  const { posts, til, projects, notes, issues } = getRawContentItems()
  const consumed = getConsumedStats()
  return (
    <AnalyticsPeriodProvider defaultPeriod="1y">
      <div className="container max-w-3xl py-24 space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <StatsPageHeader title="Writing and projects" description="What I publish, what I write about, what I build and what I read and watch, counted from my own content." />
          <PeriodSelector />
        </div>
        <WritingHistory posts={posts} til={til} projects={projects} notes={notes} issues={issues} consumed={consumed} />
      </div>
    </AnalyticsPeriodProvider>
  )
}
