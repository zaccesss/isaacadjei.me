import type { Metadata } from "next"
import { feedAlternates } from "@/lib/content/feeds"
import { Rss } from "lucide-react"
import SubscribeBox from "@/components/shared/newsletter/SubscribeBox"
import RecentIssues from "@/components/shared/newsletter/RecentIssues"
import { fetchNewsletterIssues } from "@/lib/newsletter/newsletter"

export const revalidate = 604800

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Subscribe to my newsletter: engineering write-ups, project breakdowns, tech reflections and things I am building and learning. Written by Isaac Adjei.",
  alternates: {
    canonical: "https://isaacadjei.me/newsletter",
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
          A letter goes out every second Friday, on what I have been building and learning, with everything I published
          since the last one. A shorter issue goes out on Wednesdays. One week it is Midweek, which looks further out: the world, sport,
          people and culture. The next week it is Outside, an engineering story from beyond my own work. Each letter
          links the Wednesday issues again in case you missed one. Every issue is here to read and react to.
        </p>
      </section>

      <SubscribeBox id="subscribe" />

      <RecentIssues issues={issues} />

    </div>
  )
}
