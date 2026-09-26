import type { Metadata } from "next"
import { getPublicStats } from "@/lib/public-stats"
import { getContentStats } from "@/lib/content-stats"
import { StatsTabs } from "@/components/stats/StatsTabs"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Stats",
  description: "Live and historical stats from isaacadjei.me - GitHub activity, coding hours, listening history, application geography and gaming status.",
  alternates: {
    canonical: "https://www.isaacadjei.me/stats",
  },
  openGraph: {
    images: ["/api/og?title=Stats&description=Live%20and%20historical%20stats%20from%20isaacadjei.me."],
  },
}

export default async function StatsPage() {
  const [stats, content] = [await getPublicStats(), getContentStats()]
  return (
    <div className="container max-w-3xl py-24 space-y-10">
      <div className="space-y-3">
        <h1 className="text-4xl font-bold tracking-tight">Stats</h1>
        <p className="text-lg text-muted-foreground">
          Live and historical numbers pulled straight from my own dashboard - what I code, what I
          listen to, where my applications have gone and what I am playing right now.
        </p>
      </div>

      <StatsTabs s={stats} c={content} />
    </div>
  )
}
