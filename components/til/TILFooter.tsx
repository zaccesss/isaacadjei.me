import Link from "next/link"
import type { TILEntry } from "@/data/til"
import { socialLinks } from "@/data/social"

const linkClass = "text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"

function formatDate(iso: string) {
  return new Date(`${iso.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

interface Props {
  entry: TILEntry
  visibleEntries: TILEntry[]
}

export default function TILFooter({ entry, visibleEntries }: Props) {
  const github = socialLinks.find((l) => l.name === "GitHub")
  const linkedin = socialLinks.find((l) => l.name === "LinkedIn")
  const newsletter = socialLinks.find((l) => l.name === "Newsletter")

  const series = entry.series
    ? visibleEntries
        .filter((e) => e.series === entry.series)
        .sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0) || a.date.localeCompare(b.date))
    : []
  if (entry.series && !series.some((e) => e.id === entry.id)) series.push(entry)

  const project = entry.project
  const projectHref = project ? (project.slug ? `/projects/${project.slug}` : project.url) : null
  const showProjectSite = project && project.slug && !project.url.startsWith("https://isaacadjei.me")

  return (
    <footer className="space-y-4 border-t border-border pt-6 text-sm text-muted-foreground leading-relaxed">
      <p>
        Posted <time dateTime={entry.date}>{formatDate(entry.date)}</time> in{" "}
        <span className="font-medium text-foreground">{entry.category}</span>
      </p>

      {project && projectHref && (
        <p>
          Learned while building{" "}
          {projectHref.startsWith("/") ? (
            <Link href={projectHref} className={linkClass}>
              {project.name}
            </Link>
          ) : (
            <ExternalLink href={projectHref}>{project.name}</ExternalLink>
          )}
          {showProjectSite && (
            <>
              {" "}
              (<ExternalLink href={project.url}>project site</ExternalLink>)
            </>
          )}
        </p>
      )}

      {entry.series && series.length > 0 && (
        <nav aria-label={`${entry.series} series`} className="rounded-lg border border-border bg-muted/30 px-4 py-3">
          <p className="text-xs">
            {entry.seriesPart ? `Part ${entry.seriesPart} of the ` : "Part of the "}
            <span className="font-medium text-foreground">{entry.series}</span> series
          </p>
          {series.length > 1 && (
            <ol className="mt-2 space-y-1 list-decimal pl-5 text-xs">
              {series.map((e) => (
                <li key={e.id}>
                  {e.id === entry.id ? (
                    <span aria-current="page" className="font-medium text-foreground">
                      {e.title}
                    </span>
                  ) : (
                    <Link href={`/til/${e.id}`} className={linkClass}>
                      {e.title}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          )}
        </nav>
      )}

      <p>
        Follow me on {github && <ExternalLink href={github.url}>GitHub</ExternalLink>}
        {", "}
        {linkedin && <ExternalLink href={linkedin.url}>LinkedIn</ExternalLink>} or{" "}
        <Link href="/newsletter#subscribe" className={linkClass}>
          subscribe to the newsletter
        </Link>
        .
      </p>
    </footer>
  )
}
