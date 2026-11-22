import type { Metadata } from "next"
import { feedAlternates } from "@/lib/content/feeds"
import Link from "@/components/shared/IntentLink"
import { Separator } from "@/components/ui/separator"
import NotePostsList from "@/components/notes/NotePostsList"
import PageHeader from "@/components/layout/PageHeader"
import FeedLink from "@/components/shared/FeedLink"

export const revalidate = 604800

export const metadata: Metadata = {
  title: "Notes",
  description: "A public notebook of rough notes on what I am building and planning, updated as things change.",
  alternates: {
    canonical: "https://isaacadjei.me/notes",
    types: feedAlternates("notes", "all"),
  },
  openGraph: {
    images: ["/api/og?title=Notes&description=A%20public%20notebook%2E%20What%20I%20am%20building%2C%20thinking%20about%20and%20planning%2E"],
  },
}

export default function NotesPage() {
  return (
    <div className="container max-w-4xl py-24 space-y-12">
      <PageHeader
        title="Notes"
        actions={<FeedLink href="/notes/feed.xml" label="Notes RSS feed" />}
        description={
          <>
            A public notebook of rough notes on what I am building and planning, updated as things
            change. Finished write-ups go on the blog.
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          <span aria-hidden="true">💡 </span>Shorter, faster notes live on the{" "}
          <Link href="/til" className="body-link">TIL page</Link>: snippets from things I discover day to day.
        </p>
      </PageHeader>

      <Separator />

      <NotePostsList />

      <p className="text-sm text-muted-foreground">
        What I am building now and the projects I want to build next are on the{" "}
        <Link href="/now" className="body-link">Now page</Link>.
      </p>

    </div>
  )
}
