import type { Metadata } from "next"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { StatsPageHeader } from "@/components/stats/StatsPageHeader"
import { OpenSourceStats } from "@/components/stats/OpenSourceStats"
import { getOpenSourceStats, isMailedPatch, type PublicContribution } from "@/lib/opensource/open-source"
import { compareCategories } from "@/lib/opensource/open-source-categories"

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
  const pinned = (l: PublicContribution[]) => (l.some((c) => c.pinned) ? 1 : 0)
  return [...groups.entries()].sort((a, b) => pinned(b[1]) - pinned(a[1]) || b[1].length - a[1].length || a[0].localeCompare(b[0]))
}

const slug = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

function Item({ c }: { c: PublicContribution }) {
  const mailed = isMailedPatch(c.url)
  const what = mailed ? "patch" : c.kind === "Issue" ? "issue" : c.kind === "Pull request" ? "pull request" : "listing"
  const status = mailed && c.status === "Merged" ? "Applied" : c.status
  return (
    <li className="border-l-2 border-border pl-4">
      <p className="text-sm">{c.summary}</p>
      <p className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-x-2">
        <span className={c.status === "Merged" ? "font-medium text-foreground" : undefined}>{status}</span>
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

function CategorySection({ title, items }: { title: string; items: PublicContribution[] }) {
  const id = `os-${slug(title)}`
  return (
    <section className="space-y-6" aria-labelledby={id}>
      <h2 id={id} className="text-xl font-semibold tracking-tight">{title}</h2>
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
  const categories = new Map<string, PublicContribution[]>()
  for (const c of s.contributions) categories.set(c.category, [...(categories.get(c.category) ?? []), c])
  const hasPinned = (l: PublicContribution[]) => (l.some((c) => c.pinned) ? 1 : 0)
  const sections = [...categories.entries()]
    .map(([title, items]) => [title, [...items].sort((a, b) => Number(b.pinned) - Number(a.pinned))] as const)
    .sort((a, b) => hasPinned(b[1]) - hasPinned(a[1]) || compareCategories(a[0], b[0]))

  return (
    <div className="container max-w-3xl py-24 space-y-10">
      <StatsPageHeader
        title="Open source"
        description="Work I have contributed to other people's projects and to the tools I publish for everyone to use, all in the open. Each entry says what it changed and links to the work itself."
      />

      <OpenSourceStats s={s} />

      <div className="space-y-12">
        {sections.map(([title, items]) => <CategorySection key={title} title={title} items={items} />)}
      </div>

      <p className="text-sm text-muted-foreground">
        The numbers also sit with the rest of my stats on the <Link href="/stats#open-source" className="text-primary underline underline-offset-2">stats page</Link>.
      </p>
    </div>
  )
}
