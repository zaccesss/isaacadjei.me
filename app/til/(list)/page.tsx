import type { Metadata } from "next"
import { feedAlternates } from "@/lib/content/feeds"
import { getPublishedTILEntries } from "@/data/til"
import TILList from "@/components/til/TILList"
import PageHeader from "@/components/layout/PageHeader"
import FeedLink from "@/components/shared/FeedLink"

export const revalidate = 604800

export const metadata: Metadata = {
  title: "TIL | Today I Learned",
  description:
    "Things I learned today, kept short: firmware, algorithms, the web, AI, Linux and more. If it surprised me or would have saved me time, it ends up here.",
  alternates: {
    canonical: "https://isaacadjei.me/til",
    types: feedAlternates("til", "all"),
  },
  openGraph: {
    images: [
      "/api/og?title=TIL%3A%20Today%20I%20Learned&description=Short%20notes%20on%20things%20I%20discover%20while%20coding%20and%20building",
    ],
  },
}

export default function TILPage() {
  const entries = getPublishedTILEntries().sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="container max-w-4xl py-24 space-y-12">
      <PageHeader title="TIL" description="Today I Learned" actions={<FeedLink href="/til/feed.xml" label="TIL RSS feed" />}>
        <p className="max-w-[68ch] text-lg text-muted-foreground leading-relaxed">
          Things that surprised me, things I had to look up twice, things I wish I had known sooner.
          One discovery at a time.
        </p>
      </PageHeader>

      <TILList entries={entries} />
    </div>
  )
}
