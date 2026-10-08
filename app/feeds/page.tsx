import type { Metadata } from "next"
import type { LucideIcon } from "lucide-react"
import { Lightbulb, Newspaper, NotebookPen, PenLine, Rss } from "lucide-react"
import { FEEDS, feedAlternates, type FeedInfo } from "@/lib/feeds"

export const metadata: Metadata = {
  title: "Feeds",
  description: "Follow the blog, TIL, notes and newsletter from isaacadjei.me in any RSS or Atom reader.",
  alternates: {
    canonical: "https://www.isaacadjei.me/feeds",
    types: feedAlternates("all", "blog", "til", "notes", "newsletter"),
  },
  openGraph: {
    images: ["/api/og?title=Feeds&description=Follow%20the%20blog%2C%20TIL%2C%20notes%20and%20newsletter%20in%20any%20feed%20reader%2E"],
  },
}

const ICONS: Record<FeedInfo["id"], LucideIcon> = {
  blog: PenLine,
  til: Lightbulb,
  notes: NotebookPen,
  newsletter: Newspaper,
  all: Rss,
}

export default function FeedsPage() {
  return (
    <div className="container max-w-3xl py-24 space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Feeds</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Follow new writing without social media or an inbox. Paste any feed URL below into a feed reader and new
          posts show up there as they go live.
        </p>
        <p className="text-sm text-muted-foreground">
          New to feeds? They are a free, open way to follow websites in one app. Every feed here is Atom, which any RSS and Atom reader understands.{" "}
          <a
            href="https://aboutfeeds.com/"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/70"
          >
            Read the beginner guide at About Feeds
          </a>
          .
        </p>
      </section>

      <ul className="grid gap-4 sm:grid-cols-2">
        {FEEDS.map((feed) => {
          const Icon = ICONS[feed.id]
          return (
            <li key={feed.id}>
              <a
                href={feed.href}
                aria-label={`${feed.title} feed: ${feed.description}`}
                className="group flex h-full flex-col gap-3 rounded-lg border bg-card p-5 transition-colors hover:border-primary/50 hover:bg-muted/40 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="text-lg font-semibold group-hover:text-primary transition-colors">{feed.title}</h2>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{feed.description}</p>
                <p className="mt-auto break-all font-mono text-xs text-muted-foreground">
                  isaacadjei.me{feed.href}
                </p>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
