import type { Metadata } from "next"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "What the content on isaacadjei.me is and is not: personal views, information rather than advice and live data that can lag.",
  alternates: { canonical: "https://www.isaacadjei.me/disclaimer" },
}

const link = "text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"

export default function DisclaimerPage() {
  return (
    <div className="container max-w-3xl py-24 space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Disclaimer</h1>
        <p className="text-sm text-muted-foreground font-mono">Last updated: October 2026</p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          This is my personal site. It is here to share my work and what I am learning, in good faith.
        </p>
      </section>

      <Separator />

      <section className="space-y-10 text-muted-foreground [&_h2]:text-foreground [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mb-3 [&_p]:leading-relaxed [&_p]:text-[0.95rem]">
        <div>
          <h2>My views are my own</h2>
          <p>
            Everything here is written by me personally. It does not represent the views of my university, any
            employer, any organisation I volunteer with or any project team I am part of, unless a page clearly says
            otherwise.
          </p>
        </div>

        <div>
          <h2>Information, not advice</h2>
          <p>
            Project write-ups, research notes, tutorials and code are shared for learning and interest. They are not
            professional engineering, legal, financial or medical advice. Check anything important for yourself before
            relying on it, especially circuits and anything involving mains power or batteries.
          </p>
        </div>

        <div>
          <h2>Accuracy</h2>
          <p>
            I try to keep everything correct and up to date. Even so, pages can fall behind as projects change. If you spot
            a mistake, I would be glad to hear about it through the <Link href="/contact" className={link}>contact page</Link>.
          </p>
        </div>

        <div>
          <h2>Live data</h2>
          <p>
            Pages that show what I am listening to, playing or working on take their data from Spotify, PlayStation,
            Steam, GitHub and other services. That data can be delayed, incomplete or briefly unavailable when those
            services are.
          </p>
        </div>

        <div>
          <h2>Links to other sites</h2>
          <p>
            I link to other sites when they are useful. I do not control them and am not responsible for their
            content or how they handle your data.
          </p>
        </div>

        <div>
          <h2>Availability</h2>
          <p>
            I aim to keep the site running at all times. You can check it on the{" "}
            <a href="https://status.isaacadjei.me" className={link}>status page</a>. It may occasionally be
            unavailable for maintenance or reasons outside my control. Ownership of the content is covered on the{" "}
            <Link href="/copyright" className={link}>copyright page</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
