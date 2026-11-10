import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { FRIENDS, type Friend } from "@/lib/content/friends"
import { supabase } from "@/lib/core/supabase"
import FriendRequestForm from "@/components/friends/FriendRequestForm"

export const metadata: Metadata = {
  title: "Friends",
  description: "Personal websites of people I know online. Part of the /friends project.",
  alternates: { canonical: "https://isaacadjei.me/friends" },
  openGraph: {
    images: ["/api/og?title=Friends&description=Personal%20websites%20of%20people%20I%20know%20online%2E"],
  },
}

const link = "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"

function FriendCards({ list }: { list: Friend[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {list.map((friend) => (
        <li key={friend.url}>
          <a
            href={friend.url}
            className="group flex h-full flex-col gap-2 rounded-xl border p-5 transition-colors hover:border-primary/60 hover:bg-accent/40"
          >
            <span className="flex items-center justify-between gap-2 font-semibold text-foreground">
              {friend.name}
              <ArrowUpRight
                className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </span>
            <span className="text-sm text-muted-foreground">{new URL(friend.url).hostname.replace(/^www\./, "")}</span>
            {friend.about && <span className="text-sm leading-relaxed text-muted-foreground">{friend.about}</span>}
            {friend.place && <span className="text-xs text-muted-foreground">{friend.place}</span>}
          </a>
        </li>
      ))}
    </ul>
  )
}

async function siteFriends(): Promise<Friend[]> {
  const { data } = await supabase.from("friend_requests").select("name,website").eq("status", "approved").eq("show_on_page", true)
    .not("website", "is", null).order("decided_at", { ascending: true })
  return (data ?? []).flatMap((r) => {
    try {
      return [{ name: r.name as string, url: new URL(r.website as string).toString(), about: "" }]
    } catch {
      return []
    }
  })
}

const LETTER_STATUS: Record<string, string> = {
  ok: "You are on the list. The next letter will reach you.",
  invalid: "That link has expired or is not valid. Send a new request below and I will send a fresh one.",
  error: "Something went wrong adding you. Please try the link again later.",
}

export default async function FriendsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const q = await searchParams
  const one = (k: string) => (typeof q[k] === "string" ? (q[k] as string) : "")
  const letters = one("letters")
  const met = await siteFriends()
  return (
    <div className="container max-w-3xl py-24 space-y-12">
      {letters === "confirm" && (
        <form action="/api/friends/confirm" method="post" className="space-y-3 rounded-xl border border-primary p-6" role="region" aria-label="Confirm the letters">
          <p className="font-semibold">Confirm the monthly letters</p>
          <p className="text-sm text-muted-foreground">Press the button to confirm this address and join the letters.</p>
          {["e", "x", "s"].map((k) => <input key={k} type="hidden" name={k} value={one(k)} />)}
          <button type="submit" className="min-h-11 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">Send me the letters</button>
        </form>
      )}
      {LETTER_STATUS[letters] && <p role="status" className="rounded-xl border p-4 text-sm">{LETTER_STATUS[letters]}</p>}

      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Friends</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Personal websites of people I know online. Small, independent sites are what make the web worth exploring.
          This page is part of <a href="https://slashfriends.org" className={link}>/friends</a>, a project by{" "}
          <a href="https://nickgray.net" className={link}>Nick Gray</a> that helps
          people find each other through pages like this one.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Want to be listed or become pen pals? <a href="#become-friends" className={link}>Go to the form</a>.
        </p>
      </section>

      <Separator />

      <FriendCards list={FRIENDS.filter((f) => f.group !== "learn")} />

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight">People I learn from</h2>
        <p className="text-muted-foreground leading-relaxed">
          I have not met these people, but their writing, code and teaching shape how I work. Their sites are worth
          exploring.
        </p>
        <FriendCards list={FRIENDS.filter((f) => f.group === "learn")} />
      </section>

      {met.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">Met through this site</h2>
          <p className="text-muted-foreground leading-relaxed">People who found this site and said hello.</p>
          <FriendCards list={met} />
        </section>
      )}

      <section className="space-y-4" aria-labelledby="become-friends">
        <h2 id="become-friends" className="text-2xl font-bold tracking-tight">Be friends or pen pals</h2>
        <p className="text-muted-foreground leading-relaxed">
          Ask to be friends and I can list your site here. Or become pen pals and get a letter from me once a month. I read
          every request myself. Just want to say hello? Sign the <a href="/guestbook" className={link}>guestbook</a>.
        </p>
        <FriendRequestForm />
      </section>
    </div>
  )
}
