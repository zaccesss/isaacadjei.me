import type { Metadata } from "next"
import SketchView from "@/components/guestbook/SketchView"
import { sketchHasInk, type Sketch } from "@/lib/content/sketch"
import { unstable_cache } from "next/cache"
import { Separator } from "@/components/ui/separator"
import GuestbookForm from "@/components/guestbook/GuestbookForm"
import { supabase } from "@/lib/core/supabase"

export const metadata: Metadata = {
  title: "Guestbook",
  description: "Leave a message for Isaac Adjei and read what other visitors have written.",
  alternates: { canonical: "https://isaacadjei.me/guestbook" },
  openGraph: {
    images: ["/api/og?title=Guestbook&description=Leave%20me%20a%20message%20and%20read%20what%20other%20visitors%20have%20written%2E"],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/api/og?title=Guestbook&description=Leave%20me%20a%20message%20and%20read%20what%20other%20visitors%20have%20written%2E"],
  },
}

type Entry = { id: string; name: string; message: string; website: string | null; created_at: string; signature: Sketch | null; drawing: Sketch | null }

const getEntries = unstable_cache(
  async (): Promise<Entry[]> => {
    const { data } = await supabase
      .from("guestbook_entries")
      .select("id, name, message, website, created_at, signature, drawing")
      .eq("approved", true)
      .order("created_at", { ascending: false })
      .limit(200)
    return (data as Entry[] | null) ?? []
  },
  ["guestbook-entries"],
  { tags: ["guestbook"], revalidate: 3600 }
)

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" })

export default async function GuestbookPage() {
  const entries = await getEntries()

  return (
    <div className="container max-w-4xl py-24 space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Guestbook</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Say hello, share what brought you here or leave a note for the next visitor. Messages appear once I have read
          them. Want your site listed or a letter from me once a month? See the{" "}
          <a href="/friends" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">friends page</a> or{" "}
          <a href="/friends#become-friends" className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors">go to the form</a>.
        </p>
      </section>

      <GuestbookForm />

      <Separator />

      {entries.length === 0 ? (
        <p className="text-muted-foreground">No messages yet. Be the first to sign.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {entries.map((entry) => (
            <li key={entry.id} className="flex flex-col gap-3 rounded-xl border p-5 transition-colors hover:border-primary/40">
              {sketchHasInk(entry.drawing) && (
                <SketchView sketch={entry.drawing!} label={`Drawing by ${entry.name}`} className="w-full rounded-md border bg-white" />
              )}
              <p className="leading-relaxed">{entry.message}</p>
              {sketchHasInk(entry.signature) && (
                <SketchView sketch={entry.signature!} label={`Signature of ${entry.name}`} className="h-16 w-auto max-w-full self-start rounded bg-white" />
              )}
              <p className="mt-auto text-sm text-muted-foreground">
                {entry.website ? (
                  <a href={entry.website} rel="nofollow ugc noopener" className="font-medium text-foreground underline underline-offset-4 hover:text-primary">
                    {entry.name}
                  </a>
                ) : (
                  <span className="font-medium text-foreground">{entry.name}</span>
                )}
                {" · "}
                <time dateTime={entry.created_at}>{dateFormat.format(new Date(entry.created_at))}</time>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
