"use client"
import { ExternalLink } from "lucide-react"
import ListControls, { type FilterGroup } from "@/components/shared/lists/ListControls"
import { countedOptions, useListQuery } from "@/components/shared/lists/useListQuery"
import {
  filterContributions,
  groupByCategory,
  isFiltering,
  kindOptions,
  stateOptions,
  type ListedContribution,
} from "@/lib/opensource/open-source-list"

const slug = (v: string) => v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")

const LINK = "body-link inline-flex min-h-11 items-center gap-1 text-sm"

function Item({ c, showProject = false }: { c: ListedContribution; showProject?: boolean }) {
  return (
    <li id={c.id} className="scroll-mt-24 border-l-2 border-border pl-4">
      {showProject && <p className="text-sm font-semibold">{c.project}</p>}
      <p className="text-sm">{c.summary}</p>
      <p className="mt-1 flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
        <span className={c.state === "Open" ? undefined : "font-medium text-foreground"}>{c.state}</span>
        {c.number != null && <span>· #{c.number}</span>}
        {c.language && <span>· {c.language}</span>}
        <span>· {c.month}</span>
        {c.relation && !c.relation.url && <span>· {c.relation.text}</span>}
      </p>
      {(c.relation?.url || c.url || c.commit) && (
        <p className="flex flex-wrap items-center gap-x-4">
          {c.relation?.url && (
            <a href={c.relation.url} target="_blank" rel="noopener noreferrer" className={LINK}>
              {c.relation.text}
              <span className="sr-only"> (opens the linked work in a new tab)</span>
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          )}
          {c.url && (
            <a href={c.url} target="_blank" rel="noopener noreferrer" className={LINK}>
              View the {c.linkWord}
              <span className="sr-only">: {c.title} (opens in a new tab)</span>
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          )}
          {c.commit && (
            <a href={c.commit.url} target="_blank" rel="noopener noreferrer" className={LINK}>
              View the commit in {c.commit.tree}
              <span className="sr-only">: {c.title} (opens in a new tab)</span>
              <ExternalLink className="h-3 w-3" aria-hidden />
            </a>
          )}
        </p>
      )}
    </li>
  )
}

export default function OpenSourceList({ rows }: { rows: ListedContribution[] }) {
  const query = useListQuery("newest")
  const filters = {
    search: query.search,
    projects: query.getAll("project"),
    state: query.get("state"),
    kind: query.get("kind"),
  }
  const filtering = isFiltering(filters)
  const matches = filtering ? filterContributions(rows, filters) : rows

  const groups: FilterGroup[] = [
    { key: "project", label: "Projects", kind: "multi", options: countedOptions(rows.map((c) => c.project)) },
    { key: "state", label: "State", kind: "single", options: stateOptions(rows) },
    { key: "kind", label: "Kind", kind: "single", options: kindOptions(rows) },
  ]

  return (
    <div className="space-y-10">
      <ListControls
        query={query}
        groups={groups}
        sortOptions={["newest"]}
        searchLabel="Search contributions"
        searchPlaceholder="Search contributions…"
        resultCount={matches.length}
        itemLabel={{ one: "contribution", many: "contributions" }}
      />

      {!filtering && (
        <div className="space-y-12">
          {groupByCategory(rows).map(({ category, projects }) => {
            const id = `os-${slug(category)}`
            return (
              <section key={category} className="space-y-6" aria-labelledby={id}>
                <h2 id={id} className="text-xl font-semibold tracking-tight">{category}</h2>
                {projects.map(({ project, items }) => (
                  <section key={project} className="space-y-3" aria-labelledby={`${id}-${slug(project)}`}>
                    <h3 id={`${id}-${slug(project)}`} className="text-lg font-semibold tracking-tight">{project}</h3>
                    <ul className="space-y-3">
                      {items.map((c) => <Item key={c.id} c={c} />)}
                    </ul>
                  </section>
                ))}
              </section>
            )
          })}
        </div>
      )}

      {filtering && matches.length > 0 && (
        <section className="space-y-4" aria-labelledby="os-matches">
          <h2 id="os-matches" className="sr-only">Matching contributions</h2>
          <ul className="space-y-4">
            {matches.map((c) => <Item key={c.id} c={c} showProject />)}
          </ul>
        </section>
      )}

      {filtering && matches.length === 0 && (
        <div className="space-y-2 rounded-lg border border-dashed border-border/60 p-12 text-center">
          <p className="text-sm font-medium">No contributions match.</p>
          <p className="text-xs text-muted-foreground">Try a shorter search. Clearing a filter also helps.</p>
        </div>
      )}
    </div>
  )
}
