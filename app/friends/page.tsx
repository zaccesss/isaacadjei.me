import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { FRIENDS } from "@/lib/friends"

export const metadata: Metadata = {
  title: "Friends",
  description: "Personal websites of people I know online. Part of the /friends project.",
  alternates: { canonical: "https://www.isaacadjei.me/friends" },
  openGraph: {
    images: ["/api/og?title=Friends&description=Personal%20websites%20of%20people%20I%20know%20online%2E"],
  },
}

const link = "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"

function FriendCards({ list }: { list: typeof FRIENDS }) {
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
            <span className="text-sm leading-relaxed text-muted-foreground">{friend.about}</span>
            {friend.place && <span className="text-xs text-muted-foreground">{friend.place}</span>}
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function FriendsPage() {
  return (
    <div className="container max-w-3xl py-24 space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Friends</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Personal websites of people I know online. Small, independent sites are what make the web worth exploring.
          This page is part of <a href="https://slashfriends.org" className={link}>/friends</a>, a project by{" "}
          <a href="https://nickgray.net" className={link}>Nick Gray</a> that helps
          people find each other through pages like this one.
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

      <p className="text-sm text-muted-foreground">
        Have a personal site and know me? Say hello through the <a href="/contact" className={link}>contact page</a> and
        I will add you.
      </p>
    </div>
  )
}
