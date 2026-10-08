"use client"

import { type Project, CATEGORY_LABELS } from "@/data/projects"
import ProjectCard from "./ProjectCard"
import { relevanceScore } from "@/lib/search"
import ProjectFilter from "./ProjectFilter"
import { Pagination, usePageSize } from "@/components/shared/Pagination"
import ListControls, { type FilterGroup } from "@/components/shared/ListControls"
import { countedOptions, sortItems, useListQuery, yearOptions } from "@/components/shared/useListQuery"

type Category = Project["category"] | "all"

const PAGE_SIZES = [12, 24, 48]
const LIST_ID = "project-list"

function projectYear(dateStr: string): number {
  return parseInt(dateStr.split(" - ")[0].trim(), 10)
}

interface Props {
  projects: Project[]
}

export default function ProjectGrid({ projects }: Props) {
  const query = useListQuery("default")
  const [perPage, setPerPage] = usePageSize("projects", PAGE_SIZES)

  const category = (query.get("category") || "all") as Category
  const techs = query.getAll("tech")
  const year = query.get("year")
  const q = query.search.toLowerCase().trim()

  const matches = projects
    .filter((p) => category === "all" || p.category === category)
    .filter((p) => !year || String(projectYear(p.date)) === year)
    .filter((p) => techs.length === 0 || techs.every((t) => p.technologies.includes(t)))
    .filter((p) => !q || p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.technologies.some((t) => t.toLowerCase().includes(q)))
  const filtered =
    q && query.sort === "default"
      ? [...matches].sort((a, b) => relevanceScore(b.title, b.description, q) - relevanceScore(a.title, a.description, q))
      : sortItems(matches, query.sort, (p) => projectYear(p.date) || 0, (p) => p.title)

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const page = Math.min(query.page, totalPages)
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  const categoriesPresent = [...new Set(projects.map((p) => p.category))]
  const groups: FilterGroup[] = [
    {
      key: "category",
      label: "Category",
      kind: "single",
      options: categoriesPresent.map((c) => ({ value: c, label: CATEGORY_LABELS[c] ?? c })),
    },
    { key: "tech", label: "Tech", kind: "multi", chips: true, options: countedOptions(projects.flatMap((p) => p.technologies)) },
    { key: "year", label: "Year", kind: "single", options: yearOptions(projects.map((p) => projectYear(p.date))) },
  ]

  return (
    <div className="space-y-8">
      <ListControls
        query={query}
        groups={groups}
        sortOptions={["default", "newest", "oldest", "az", "za"]}
        searchLabel="Search projects"
        searchPlaceholder="Search projects…"
        resultCount={filtered.length}
        itemLabel={{ one: "project", many: "projects" }}
      />
      <ProjectFilter active={category} onChange={(next) => query.update({ category: next === "all" ? null : next })} />

      <div id={LIST_ID} className="scroll-mt-24">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-16">No projects match these filters.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginated.map((project, i) => (
              <ProjectCard key={project.id} project={project} priority={page === 1 && i === 0} />
            ))}
          </div>
        )}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={query.setPage}
        totalItems={filtered.length}
        pageSize={perPage}
        pageSizeOptions={PAGE_SIZES}
        onPageSizeChange={(n) => {
          setPerPage(n)
          query.setPage(1)
        }}
        scrollTargetId={LIST_ID}
        itemLabel="projects"
        label="Project pages"
        className="pt-4"
      />
    </div>
  )
}
