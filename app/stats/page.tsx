import { getResearchStats } from "@/lib/stats/research-stats"
import type { Metadata } from "next"
import { getPublicStats } from "@/lib/stats/public-stats"
import { getContentStats, getRawContentItems } from "@/lib/content/content-stats"
import { writingExtra } from "@/components/stats/chart-data"
import { StatsTabs } from "@/components/stats/StatsTabs"
import { getOpenSourceStats } from "@/lib/opensource/open-source"
import { getMilestones } from "@/lib/stats/stats-milestones"
import PageHeader from "@/components/layout/PageHeader"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Stats",
  description: "Live and historical stats from isaacadjei.me - GitHub activity, coding hours, listening history, application geography and gaming status.",
  alternates: {
    canonical: "https://isaacadjei.me/stats",
  },
  openGraph: {
    images: ["/api/og?title=Stats&description=Live%20and%20historical%20stats%20from%20isaacadjei.me."],
  },
}

export default async function StatsPage() {
  const [stats, content, os, research] = [await getPublicStats(), getContentStats(), await getOpenSourceStats(), await getResearchStats()]
  const raw = getRawContentItems()
  return (
    <div className="container max-w-3xl py-24 space-y-10">
      <PageHeader
        title="Stats"
        description="Live and historical numbers from the services I use every day - what I code, what I listen to, where my applications have gone, what I am playing right now, what I have published and how this site has been released."
      />

      <StatsTabs s={stats} c={content} os={os} rs={research} milestones={getMilestones()} wx={writingExtra(raw.posts, raw.til, raw.notes, raw.issues)} />
    </div>
  )
}
