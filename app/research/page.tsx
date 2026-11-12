import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { keyPapers, researchInterests, researchLines, type ResearchLink } from "@/data/respub/research"
import ResearchStatusBadge from "@/components/respub/ResearchStatusBadge"

export const metadata: Metadata = {
  title: "Research",
  description:
    "What Isaac Adjei is researching: the questions, the methods and what each line of work has shown so far, with the papers behind it and the open materials.",
  alternates: {
    canonical: "https://isaacadjei.me/research",
  },
  openGraph: {
    images: [
      "/api/og?title=Research&description=The%20questions%20I%20am%20working%20on%2C%20how%20and%20what%20they%20have%20shown%20so%20far",
    ],
  },
}

const SECTION_HEADING = "text-xs font-semibold uppercase tracking-widest text-muted-foreground"

function ResearchAnchor({ link, className }: { link: ResearchLink; className?: string }) {
  const cls = className ?? "inline-flex items-center gap-1 text-xs font-medium body-link"
  if (link.href.startsWith("/")) {
    return (
      <Link href={link.href} className={cls}>
        {link.label}
      </Link>
    )
  }
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {link.label}
      <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

export default function ResearchPage() {
  return (
    <div className="container max-w-3xl py-24 space-y-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Research</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          What I am looking into, how I am going about it and what each line of work has shown so far. Every line
          below starts from a question I could not find a good answer to. Each one says plainly how far it has got:
          in simulation, on hardware or in use.
        </p>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          Work that is finished and archived with a DOI is on the{" "}
          <Link href="/publications" className="body-link">Publications page</Link>.
        </p>
      </div>

      <section aria-labelledby="current-research" className="space-y-6">
        <h2 id="current-research" className={SECTION_HEADING}>
          Current research
        </h2>
        <div className="space-y-6">
          {researchLines.map((line) => (
            <article key={line.id} id={line.id} className="scroll-mt-24 rounded-xl border bg-card p-6 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-base font-semibold leading-snug">
                  <Link href={`/projects/${line.projectSlug}`} className="hover:text-primary transition-colors">
                    {line.name}
                  </Link>
                </h3>
                <ResearchStatusBadge status={line.status} />
              </div>

              <dl className="space-y-3 text-sm">
                <div className="space-y-1">
                  <dt className="font-medium">Question</dt>
                  <dd className="text-muted-foreground leading-relaxed">{line.question}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-medium">Method</dt>
                  <dd className="text-muted-foreground leading-relaxed">{line.method}</dd>
                </div>
                <div className="space-y-1">
                  <dt className="font-medium">Found so far</dt>
                  <dd className="text-muted-foreground leading-relaxed">{line.found}</dd>
                </div>
              </dl>

              <ul className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label={`${line.name} links`}>
                {line.links.map((link) => (
                  <li key={link.href}>
                    <ResearchAnchor link={link} />
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="key-papers" className="space-y-6">
        <h2 id="key-papers" className={SECTION_HEADING}>
          Papers that shaped my work
        </h2>
        <div className="space-y-6">
          {keyPapers.map((group) => (
            <div key={group.line} className="space-y-3">
              <h3 className="text-sm font-semibold">{group.line}</h3>
              <ul className="space-y-3">
                {group.papers.map((paper) => (
                  <li key={paper.href} className="space-y-1 border-l-2 border-border pl-4">
                    <p className="text-sm leading-relaxed">{paper.citation}</p>
                    <p className="text-xs text-muted-foreground">{paper.why}</p>
                    <ResearchAnchor
                      link={{ label: paper.identifier, href: paper.href }}
                      className="inline-flex items-center gap-1 text-xs font-mono body-link"
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="open-materials" className="space-y-6">
        <h2 id="open-materials" className={SECTION_HEADING}>
          Open materials
        </h2>
        <ul className="space-y-5">
          {researchLines.map((line) => (
            <li key={line.id} className="space-y-2">
              <p className="text-sm font-semibold">{line.name}</p>
              {line.materialsNote && (
                <p className="text-sm text-muted-foreground leading-relaxed">{line.materialsNote}</p>
              )}
              {line.materials.length > 0 && (
                <ul className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label={`${line.name} open materials`}>
                  {line.materials.map((m) => (
                    <li key={m.href}>
                      <ResearchAnchor link={m} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="research-interests" className="space-y-6">
        <h2 id="research-interests" className={SECTION_HEADING}>
          Research interests
        </h2>
        <ul className="space-y-6">
          {researchInterests.map(({ area, detail, links }) => (
            <li key={area} className="space-y-1">
              <p className="text-sm font-semibold">{area}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{detail}</p>
              {links && links.length > 0 && (
                <p className="flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                  {links.map((link) => (
                    <ResearchAnchor key={link.href} link={link} />
                  ))}
                </p>
              )}
            </li>
          ))}
        </ul>
      </section>

      <p className="text-sm">
        <Link href="/publications" className="inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline">
          See what has been published
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </p>
    </div>
  )
}
