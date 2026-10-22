import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { StatsPageHeader } from "@/components/stats/StatsPageHeader"
import { OpenSourceStats } from "@/components/stats/OpenSourceStats"
import { getOpenSourceStats, type PublicContribution } from "@/lib/open-source"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "Open Source",
  description: "My contributions to open source projects: what each one changed, in which project and a link to the work.",
  alternates: { canonical: "https://www.isaacadjei.me/open-source" },
  openGraph: { images: ["/api/og?title=Open%20Source&description=My%20contributions%20to%20open%20source%20projects."] },
}

export default async function OpenSourcePage() {
  const s = await getOpenSourceStats()
  const groups = new Map<string, PublicContribution[]>()
  for (const c of s.contributions) groups.set(c.project, [...(groups.get(c.project) ?? []), c])
  const ordered = [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))

  return (
    <div className="container max-w-3xl py-24 space-y-10">
      <StatsPageHeader
        title="Open source"
        description="Work I have contributed to other people's projects and to the tools I publish for everyone to use, all in the open. Each entry says what it changed and links to the work itself."
      />

      <OpenSourceStats s={s} />

      <div className="space-y-8">
        {ordered.map(([project, items]) => (
          <section key={project} className="space-y-3" aria-labelledby={`os-${project}`}>
            <h2 id={`os-${project}`} className="text-lg font-semibold tracking-tight">{project}</h2>
            <ul className="space-y-3">
              {items.map((c) => (
                <li key={`${c.title}-${c.date}`} className="border-l-2 border-border pl-4">
                  <p className="text-sm">{c.summary}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2">
                    <span className={c.status === "Merged" ? "font-medium text-foreground" : undefined}>{c.status}</span>
                    {c.language && <span>· {c.language}</span>}
                    <span>· {c.date.slice(0, 7)}</span>
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary underline underline-offset-2">
                        View the work<span className="sr-only">: {c.title} (opens in a new tab)</span>
                        <ExternalLink className="h-3 w-3" aria-hidden />
                      </a>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="text-sm text-muted-foreground">
        The numbers also sit with the rest of my stats on the <Link href="/stats#open-source" className="text-primary underline underline-offset-2">stats page</Link>.
      </p>
    </div>
  )
}
