import type { Metadata } from "next"
import GitHubStats from "@/components/shared/live/GitHubStats"
import GitHubYearlyChart from "@/components/stats/GitHubYearlyChart"
import GitHubActivityChart from "@/components/stats/GitHubActivityChart"
import { StatsPageHeader } from "@/components/stats/StatsPageHeader"
import { AnalyticsPeriodProvider, PeriodSelector } from "@/components/analytics"
import { getPublicStats } from "@/lib/stats/public-stats"
import { getMilestones } from "@/lib/stats/stats-milestones"
import { RecordsRow, GitHubMonths } from "@/components/stats/StatsExtras"
import { GitHubPatterns } from "@/components/stats/StatsCharts"

export const metadata: Metadata = {
  title: "GitHub Stats",
  description: "My GitHub contribution history, top languages and top repos.",
  alternates: {
    canonical: "https://isaacadjei.me/stats/github",
  },
  openGraph: {
    images: ["/api/og?title=GitHub%20Stats&description=My%20GitHub%20contribution%20history%2C%20top%20languages%20and%20top%20repos."],
  },
}

export const revalidate = 3600

export default async function StatsGitHubPage() {
  const stats = await getPublicStats()
  return (
    <AnalyticsPeriodProvider defaultPeriod="30d">
      <div className="container max-w-3xl py-24 space-y-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <StatsPageHeader
            title="GitHub"
            description="A full year of contribution history, top languages and top repos, straight from my GitHub profile."
          />
          <PeriodSelector />
        </div>
        <RecordsRow s={stats} show={["githubWeek"]} />
        <GitHubMonths s={stats} milestones={getMilestones()} />
        <GitHubPatterns s={stats} />
        <GitHubActivityChart />
        <GitHubYearlyChart />
        <GitHubStats />
      </div>
    </AnalyticsPeriodProvider>
  )
}
