import type { Metadata } from "next"
import { StatsPageHeader } from "@/components/stats/StatsPageHeader"
import { ReleaseStats } from "@/components/stats/ResearchStats"
import { releaseStats } from "@/lib/stats/research-stats"

export const metadata: Metadata = {
  title: "Release Stats",
  description: "Numbers about how this site has been released: releases by month, the running total, kinds of change, size of release and the days I release.",
  alternates: { canonical: "https://isaacadjei.me/stats/releases" },
  openGraph: { images: ["/api/og?title=Releases&description=How%20this%20site%20has%20been%20released%2C%20in%20numbers."] },
}

export default function StatsReleasesPage() {
  return (
    <div className="container max-w-3xl py-24 space-y-8">
      <StatsPageHeader title="Releases" description="How this site has been released since its first commit, counted from its own changelog." />
      <ReleaseStats releases={releaseStats()} />
    </div>
  )
}
