import type { Metadata } from "next"
import GamingPanel from "@/components/lab/GamingPanel"
import { StatsPageHeader } from "@/components/stats/StatsPageHeader"
import { GamingHistory } from "@/components/stats/GamingHistory"
import { GamingMore } from "@/components/stats/StatsCharts"
import { getPublicStats } from "@/lib/public-stats"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Gaming Status",
  description: "Live PS5 and gaming PC status - what I am playing right now or last played, plus my play history.",
  alternates: {
    canonical: "https://www.isaacadjei.me/stats/gaming",
  },
  openGraph: {
    images: ["/api/og?title=Gaming%20Status&description=Live%20PS5%20and%20gaming%20PC%20status."],
  },
}

export default async function StatsGamingPage() {
  const stats = await getPublicStats()
  return (
    <div className="container max-w-3xl py-24 space-y-8">
      <StatsPageHeader
        title="Gaming"
        description="Live status for my PS5 and gaming PC, plus how I have been playing lately."
      />
      <GamingPanel />
      <GamingHistory summary={stats.gaming} />
      <GamingMore s={stats} />
    </div>
  )
}
