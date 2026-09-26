import type { Metadata } from "next"
import SpotifyAnalytics from "@/components/lab/SpotifyAnalytics"
import MusicHistory from "@/components/stats/MusicHistory"
import { StatsPageHeader } from "@/components/stats/StatsPageHeader"
import { MusicMore } from "@/components/stats/StatsCharts"
import { getPublicStats } from "@/lib/public-stats"
import { AnalyticsPeriodProvider, PeriodSelector } from "@/components/analytics"

export const metadata: Metadata = {
  title: "Music Stats",
  description: "My top tracks and artists, plus a year of listening history by day and hour.",
  alternates: {
    canonical: "https://www.isaacadjei.me/stats/music",
  },
  openGraph: {
    images: ["/api/og?title=Music%20Stats&description=My%20top%20tracks%20and%20artists%2C%20plus%20a%20year%20of%20listening%20history."],
  },
}

export const revalidate = 3600

export default async function StatsMusicPage() {
  const stats = await getPublicStats()
  return (
    <AnalyticsPeriodProvider defaultPeriod="30d">
      <div className="container max-w-3xl py-24 space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <StatsPageHeader
            title="Music"
            description="What I listen to, from my top tracks and artists down to when in the day I actually play them."
          />
          <PeriodSelector />
        </div>
        <MusicMore s={stats} />
        <MusicHistory />
        <SpotifyAnalytics />
      </div>
    </AnalyticsPeriodProvider>
  )
}
