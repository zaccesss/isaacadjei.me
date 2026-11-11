import type { Metadata } from "next"
import { Separator } from "@/components/ui/separator"
import TimelineMarker from "@/components/changelog/TimelineMarker"
import { releases, type ChangeEntry } from "@/data/changelog/releases"
import { ScrollText, Plus, Wrench, Zap, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "Changelog",
  description: "What has changed on isaacadjei.me, from the first commit to the latest update.",
  alternates: {
    canonical: "https://isaacadjei.me/changelog",
  },
  openGraph: {
    images: ["/api/og?title=Changelog&description=What%20has%20changed%20on%20isaacadjei%2Eme%2C%20from%20the%20first%20commit%20to%20the%20latest%20update%2E"],
  },
}

const categoryConfig = {
  added:    { icon: Plus,   label: "Added",    colour: "text-green-700 dark:text-green-400" },
  changed:  { icon: Zap,    label: "Changed",  colour: "text-amber-700 dark:text-amber-400" },
  fixed:    { icon: Wrench, label: "Fixed",    colour: "text-sky-700 dark:text-sky-400" },
  security: { icon: Shield, label: "Security", colour: "text-rose-700 dark:text-rose-400" },
} as const

const KINDS = ["added", "changed", "fixed", "security"] as const
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

function longDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number)
  return year && month && day ? `${day} ${MONTHS[month - 1]} ${year}` : iso
}

const QUIET = /^small behind-the-scenes improvements?$/i
function isQuiet(release: ChangeEntry): boolean {
  const lines = KINDS.flatMap((kind) => release[kind] ?? [])
  return lines.length > 0 && lines.every((line) => QUIET.test(line.trim()))
}

function byMonth(list: ChangeEntry[]): { key: string; title: string; releases: ChangeEntry[] }[] {
  const months: { key: string; title: string; releases: ChangeEntry[] }[] = []
  for (const release of list) {
    const key = release.date ? release.date.slice(0, 7) : "undated"
    const [year, month] = key.split("-").map(Number)
    const title = year && month ? `${MONTHS[month - 1]} ${year}` : "Undated"
    const last = months.at(-1)
    if (last && last.key === key) last.releases.push(release)
    else months.push({ key, title, releases: [release] })
  }
  return months
}

export default function ChangelogPage() {
  const months = byMonth(releases)
  return (
    <div className="container max-w-3xl py-24 space-y-12">
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <ScrollText className="h-7 w-7 text-primary" aria-hidden="true" />
          <h1 className="text-4xl font-bold tracking-tight">Changelog</h1>
        </div>
        <p className="text-lg text-muted-foreground leading-relaxed">
          What has changed on this site from the first commit to the latest update.
          The public source is on{" "}
          <a
            href="https://github.com/zaccesss/isaacadjei.me"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
          >
            GitHub
          </a>
          .
        </p>
        <p className="text-sm text-muted-foreground">
          {releases.length} releases over {months.length} months.
        </p>
      </section>

      <nav aria-label="Jump to a month" className="flex flex-wrap gap-2">
        {months.map((m) => (
          <a
            key={m.key}
            href={`#${m.key}`}
            className="inline-flex min-h-11 items-center rounded-full border border-border px-4 text-sm font-medium hover:bg-muted transition-colors"
          >
            {m.title}
            <span className="ml-2 text-muted-foreground">{m.releases.length}</span>
          </a>
        ))}
      </nav>

      <Separator />

      <div className="space-y-16">
        {months.map((m) => (
          <section key={m.key} id={m.key} aria-labelledby={`${m.key}-title`} className="scroll-mt-24 space-y-8">
            <h2 id={`${m.key}-title`} className="text-2xl font-bold tracking-tight">
              {m.title}
              <span className="ml-3 text-sm font-normal text-muted-foreground">
                {m.releases.length} {m.releases.length === 1 ? "release" : "releases"}
              </span>
            </h2>

            <ol className="relative space-y-8 border-l-2 border-border pl-6 sm:pl-8">
              <li aria-hidden="true" role="presentation" className="!mt-0 list-none">
                <TimelineMarker />
              </li>
              {m.releases.map((release) => {
                const isUnreleased = release.version === "Unreleased"
                const quiet = isQuiet(release)
                return (
                  <li key={release.version} className="relative">
                    <span
                      aria-hidden="true"
                      data-timeline-mark
                      className={`absolute -left-[31px] sm:-left-[39px] top-1.5 h-3 w-3 rounded-full border-2 transition-colors duration-300 data-[reached=true]:border-primary ${quiet ? "border-muted-foreground bg-background" : "border-muted-foreground bg-muted-foreground data-[reached=true]:bg-primary motion-reduce:border-primary motion-reduce:bg-primary"}`}
                    />

                    {quiet ? (
                      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted-foreground">
                        <span className="font-mono font-semibold text-foreground">{release.version}</span>
                        {release.date && <time dateTime={release.date}>{longDate(release.date)}</time>}
                        <span>Behind-the-scenes improvements</span>
                      </p>
                    ) : (
                      <article className="space-y-4">
                        <header className="space-y-1">
                          <h3 className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                            <span className={`font-mono text-lg font-bold ${isUnreleased ? "text-primary" : ""}`}>{release.version}</span>
                            {release.label && <span className="text-lg font-semibold text-primary">{release.label}</span>}
                          </h3>
                          {release.date && (
                            <p className="text-sm text-muted-foreground">
                              <time dateTime={release.date}>{longDate(release.date)}</time>
                            </p>
                          )}
                          {isUnreleased && <p className="text-sm text-muted-foreground">Live on the site, not yet given a number.</p>}
                        </header>

                        <div className="space-y-4">
                          {KINDS.map((kind) => {
                            const items = (release[kind] ?? []).filter((item) => !QUIET.test(item.trim()))
                            if (items.length === 0) return null
                            const { icon: Icon, label, colour } = categoryConfig[kind]
                            return (
                              <div key={kind} className="space-y-2">
                                <p className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${colour}`}>
                                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                                  {label}
                                </p>
                                <ul className="space-y-2">
                                  {items.map((item, j) => (
                                    <li key={j} className="flex gap-3 text-[15px] leading-relaxed text-foreground">
                                      <span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          })}
                        </div>
                      </article>
                    )}
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  )
}
