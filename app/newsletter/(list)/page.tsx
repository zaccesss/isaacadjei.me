import type { Metadata } from "next"
import { feedAlternates } from "@/lib/feeds"
import { Rss } from "lucide-react"
import SubscribeBox from "@/components/shared/SubscribeBox"
import RecentIssues from "@/components/shared/RecentIssues"
import { fetchNewsletterIssues } from "@/lib/newsletter"

export const revalidate = 604800

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Subscribe to my newsletter: engineering write-ups, project breakdowns, tech reflections and things I am building and learning. Written by Isaac Adjei.",
  alternates: {
    canonical: "https://www.isaacadjei.me/newsletter",
    types: feedAlternates("newsletter"),
  },
  openGraph: {
    images: ["/api/og?title=Newsletter&description=Engineering%20write-ups%2C%20project%20breakdowns%20and%20things%20I%20am%20building%2E"],
  },
}

export default async function NewsletterPage() {
  const issues = await fetchNewsletterIssues()
  return (
    <div className="container max-w-4xl py-24 space-y-12">
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Newsletter</h1>
          <a
            href="/newsletter/feed.xml"
            title="RSS feed"
            aria-label="Newsletter RSS feed"
            className="inline-flex items-center gap-1.5 text-base font-medium text-primary hover:text-primary/70 transition-colors shrink-0"
          >
            <Rss className="h-5 w-5 shrink-0" />
            Feed
          </a>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          A letter every couple of weeks on what I have been building and learning, with everything I published in
          between. In the weeks without one, a short issue on an engineering story from outside my own work. Every other
          Wednesday a Midweek issue looks further out: the world, sport, people and culture. Midweek issues are on this page
          only for now, so your inbox gets one email a week at most. Every issue is here to read, react to and comment on.
        </p>
      </section>

      <SubscribeBox id="subscribe" />

      <RecentIssues issues={issues} />

    </div>
  )
}
