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

function byProject(items: PublicContribution[]) {
  const groups = new Map<string, PublicContribution[]>()
  for (const c of items) groups.set(c.project, [...(groups.get(c.project) ?? []), c])
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]))
}

const slug = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

function Item({ c }: { c: PublicContribution }) {
  const what = c.kind === "Issue" ? "issue" : c.kind === "Pull request" ? "pull request" : "listing"
  return (
    <li className="border-l-2 border-border pl-4">
      <p className="text-sm">{c.summary}</p>
      <p className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2">
        <span className={c.status === "Merged" ? "font-medium text-foreground" : undefined}>{c.status}</span>
        {c.number != null && <span>· #{c.number}</span>}
        {c.language && <span>· {c.language}</span>}
        <span>· {c.date.slice(0, 7)}</span>
        {c.relation && (
          <span>
            ·{" "}
            {c.relation.url ? (
              <a href={c.relation.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
                {c.relation.text}
                <span className="sr-only"> (opens the linked work in a new tab)</span>
              </a>
            ) : (
              c.relation.text
            )}
          </span>
        )}
        {c.url && (
          <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary underline underline-offset-2">
            View the {what}<span className="sr-only">: {c.title} (opens in a new tab)</span>
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        )}
      </p>
    </li>
  )
}

function KindSection({ id, title, intro, items }: { id: string; title: string; intro: string; items: PublicContribution[] }) {
  if (items.length === 0) return null
  return (
    <section className="space-y-6" aria-labelledby={id}>
      <div className="space-y-1">
        <h2 id={id} className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{intro}</p>
      </div>
      {byProject(items).map(([project, list]) => (
        <section key={project} className="space-y-3" aria-labelledby={`${id}-${slug(project)}`}>
          <h3 id={`${id}-${slug(project)}`} className="text-lg font-semibold tracking-tight">{project}</h3>
          <ul className="space-y-3">
            {list.map((c) => <Item key={`${c.kind}-${c.title}-${c.date}`} c={c} />)}
          </ul>
        </section>
      ))}
    </section>
  )
}

export default async function OpenSourcePage() {
  const s = await getOpenSourceStats()
  const pulls = s.contributions.filter((c) => c.kind === "Pull request")
  const issues = s.contributions.filter((c) => c.kind === "Issue")
  const listings = s.contributions.filter((c) => c.kind === "Listing")

  return (
    <div className="container max-w-3xl py-24 space-y-10">
      <StatsPageHeader
        title="Open source"
        description="Work I have contributed to other people's projects and to the tools I publish for everyone to use, all in the open. Each entry says what it changed and links to the work itself."
      />

      <OpenSourceStats s={s} />

      <div className="space-y-12">
        <KindSection id="os-pull-requests" title="Pull requests" intro="Changes I have proposed to other projects, merged or still in review." items={pulls} />
        <KindSection id="os-issues" title="Issues" intro="Bugs and gaps I have reported to other projects." items={issues} />
        <KindSection id="os-listings" title="Listings" intro="Tools I publish in other people's directories and marketplaces." items={listings} />
      </div>

      <p className="text-sm text-muted-foreground">
        The numbers also sit with the rest of my stats on the <Link href="/stats#open-source" className="text-primary underline underline-offset-2">stats page</Link>.
      </p>
    </div>
  )
}
