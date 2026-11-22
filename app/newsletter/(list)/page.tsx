import type { Metadata } from "next"
import { feedAlternates } from "@/lib/content/feeds"
import SubscribeBox from "@/components/shared/newsletter/SubscribeBox"
import RecentIssues from "@/components/shared/newsletter/RecentIssues"
import { fetchNewsletterIssues } from "@/lib/newsletter/newsletter"
import PageHeader from "@/components/layout/PageHeader"
import FeedLink from "@/components/shared/FeedLink"

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
      <PageHeader
        title="Newsletter"
        actions={<FeedLink href="/newsletter/feed.xml" label="Newsletter RSS feed" />}
        description={
          <>
            A letter goes out every second Friday, on what I have been building and learning, with everything I published
            since the last one. A shorter issue goes out on Wednesdays. One week it is Midweek, which looks further out: the world, sport,
            people and culture. The next week it is Outside, an engineering story from beyond my own work. Each letter
            links the Wednesday issues again in case you missed one. Every issue is here to read and react to.
          </>
        }
      >
      </PageHeader>

      <SubscribeBox id="subscribe" />

      <RecentIssues issues={issues} />

    </div>
  )
}
