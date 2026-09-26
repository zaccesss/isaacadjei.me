import type { Metadata } from "next"
import { StatsPageHeader } from "@/components/stats/StatsPageHeader"
import { WritingStats } from "@/components/stats/StatsCharts"
import { getContentStats } from "@/lib/content-stats"

export const metadata: Metadata = {
  title: "Writing and Projects Stats",
  description: "Numbers about what I publish: posts and TILs by month, what I write about, my projects and what I read and watch.",
  alternates: { canonical: "https://www.isaacadjei.me/stats/writing" },
  openGraph: { images: ["/api/og?title=Writing%20and%20Projects&description=Numbers%20about%20what%20I%20publish."] },
}

export default function StatsWritingPage() {
  return (
    <div className="container max-w-3xl py-24 space-y-8">
      <StatsPageHeader title="Writing and projects" description="What I publish, what I write about, what I build and what I read and watch, counted from my own content." />
      <WritingStats c={getContentStats()} />
    </div>
  )
}
