import type { Metadata } from "next"
import { unstable_cache } from "next/cache"
import { Separator } from "@/components/ui/separator"
import GuestbookForm from "@/components/guestbook/GuestbookForm"
import { supabase } from "@/lib/supabase"

export const metadata: Metadata = {
  title: "Guestbook",
  description: "Leave a message for Isaac Adjei and read what other visitors have written.",
  alternates: { canonical: "https://www.isaacadjei.me/guestbook" },
}

type Entry = { id: string; name: string; message: string; website: string | null; created_at: string }

const getEntries = unstable_cache(
  async (): Promise<Entry[]> => {
    const { data } = await supabase
      .from("guestbook_entries")
      .select("id, name, message, website, created_at")
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
          them.
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
              <p className="leading-relaxed">{entry.message}</p>
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
