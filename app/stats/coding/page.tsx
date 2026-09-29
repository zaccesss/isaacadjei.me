import type { Metadata } from "next"
import WakatimeStats from "@/components/lab/WakatimeStats"
import { StatsPageHeader } from "@/components/stats/StatsPageHeader"
import { CodingMore } from "@/components/stats/StatsCharts"
import { getPublicStats } from "@/lib/public-stats"
import { AnalyticsPeriodProvider, PeriodSelector } from "@/components/analytics"

export const metadata: Metadata = {
  title: "Coding Stats",
  description: "My WakaTime coding stats - daily trend, languages, projects, editors and when I actually code.",
  alternates: {
    canonical: "https://www.isaacadjei.me/stats/coding",
  },
  openGraph: {
    images: ["/api/og?title=Coding%20Stats&description=My%20WakaTime%20coding%20stats%20-%20languages%2C%20projects%2C%20editors%20and%20when%20I%20actually%20code."],
  },
}

export const revalidate = 3600

export default async function StatsCodingPage() {
  const stats = await getPublicStats()
  return (
    <AnalyticsPeriodProvider defaultPeriod="30d">
      <div className="container max-w-3xl py-24 space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <StatsPageHeader
            title="Coding"
            description="Live WakaTime data - how much I code, in what, in which editor and when."
          />
          <PeriodSelector />
        </div>
        <CodingMore s={stats} />
        <WakatimeStats />
      </div>
    </AnalyticsPeriodProvider>
  )
}
