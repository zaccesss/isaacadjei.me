import type { Metadata } from "next"
import { StatsPageHeader } from "@/components/stats/StatsPageHeader"
import { ResearchStats } from "@/components/stats/ResearchStats"
import { getResearchStats } from "@/lib/stats/research-stats"

export const metadata: Metadata = {
  title: "Research Stats",
  description: "Numbers about my publications and how often they are read and how far each line of research has got.",
  alternates: { canonical: "https://isaacadjei.me/stats/research" },
  openGraph: { images: ["/api/og?title=Research&description=Publications%20and%20research%20in%20numbers."] },
}

export const revalidate = 86400

export default async function StatsResearchPage() {
  const stats = await getResearchStats()
  return (
    <div className="container max-w-3xl py-24 space-y-8">
      <StatsPageHeader title="Research" description="What I have published and how often it is read and how far each line of research has got." />
      <ResearchStats s={stats} />
    </div>
  )
}
