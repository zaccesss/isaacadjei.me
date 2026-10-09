import type { Metadata } from "next"
import { feedAlternates } from "@/lib/feeds"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Rss } from "lucide-react"
import NotePostsList from "@/components/notes/NotePostsList"

export const revalidate = 21600

export const metadata: Metadata = {
  title: "Notes",
  description: "A public notebook. What I am building, thinking about and planning.",
  alternates: {
    canonical: "https://www.isaacadjei.me/notes",
    types: feedAlternates("notes", "all"),
  },
  openGraph: {
    images: ["/api/og?title=Notes&description=A%20public%20notebook%2E%20What%20I%20am%20building%2C%20thinking%20about%20and%20planning%2E"],
  },
}

export default function NotesPage() {
  return (
    <div className="container max-w-4xl py-24 space-y-12">
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight">Notes</h1>
          <a
            href="/notes/feed.xml"
            title="RSS feed"
            aria-label="Notes RSS feed"
            className="inline-flex items-center gap-1.5 text-base font-medium text-primary hover:text-primary/70 transition-colors shrink-0"
          >
            <Rss className="h-5 w-5 shrink-0" />
            Feed
          </a>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A public notebook. Not polished posts, just honest notes on what I am building, thinking
          about and planning. Updated as things change.
        </p>
        <p className="text-sm text-muted-foreground">
          <span aria-hidden="true">💡 </span>Shorter, faster notes live on the{" "}
          <Link href="/til" className="text-primary underline underline-offset-4 hover:opacity-80">TIL page</Link>: snippets from things I discover day to day.
        </p>
      </section>

      <Separator />

      <NotePostsList />

      <p className="text-sm text-muted-foreground">
        What I am building now and the projects I want to build next are on the{" "}
        <Link href="/now" className="text-primary underline underline-offset-4 hover:opacity-80">Now page</Link>.
      </p>

    </div>
  )
}
