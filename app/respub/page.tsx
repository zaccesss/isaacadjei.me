import type { Metadata } from "next"
import Link from "next/link"
import { ArrowUpRight, FileText, Mail } from "lucide-react"
import { FaLinkedin } from "react-icons/fa6"
import { SiOrcid, SiGooglescholar, SiResearchgate, SiZotero } from "react-icons/si"
import { publications } from "@/data/respub"
import { apaCitation, bibtexCitation } from "@/data/respub/cite"
import { keyPapers, researchInterests, researchLines, type ResearchLink } from "@/data/respub/research"
import ResearchStatusBadge from "@/components/respub/ResearchStatusBadge"
import CopyCitationButtons from "@/components/respub/CopyCitationButtons"

export const metadata: Metadata = {
  title: "Research & Publications",
  description:
    "What Isaac Adjei researches, writes up and formally publishes. Citable papers, technical notes and open-source curricula, with links to every record.",
  alternates: {
    canonical: "https://www.isaacadjei.me/respub",
  },
  openGraph: {
    images: [
      "/api/og?title=Research%20%26%20Publications&description=Academic%20publications%20and%20research%20by%20Isaac%20Adjei",
    ],
  },
}

const typeLabel: Record<string, string> = {
  "technical-note": "Technical Note",
  conference: "Conference Paper",
  journal: "Journal Article",
  preprint: "Preprint",
}

import PublicationsPager from "./PublicationsPager"
import { LABEL_CLASS } from "@/components/shared/Tag"

const ITEMS_PER_PAGE = 6

const SECTION_HEADING = "text-xs font-semibold uppercase tracking-widest text-muted-foreground"

function ResearchAnchor({ link, className }: { link: ResearchLink; className?: string }) {
  const cls = className ?? "inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
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

export default function ResearchPublicationsPage() {

  return (
    <div className="container max-w-3xl py-24 space-y-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Research &amp; Publications</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          What I research, write up and formally publish. Citable papers, technical notes and
          open-source curricula, with links to every record so you can find, cite or build on
          the work.
        </p>

        <div className="flex items-center gap-4 flex-wrap">
          <a
            href="mailto:academic@isaacadjei.me"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Mail className="h-5 w-5 shrink-0" />
            <span className="text-primary hover:underline">academic@isaacadjei.me</span>
          </a>
          {([
            { Icon: SiOrcid,        label: "ORCID",         href: "https://orcid.org/0009-0001-8298-5098" },
            { Icon: SiGooglescholar,label: "Google Scholar", href: "https://scholar.google.com/citations?user=YZq0XuMAAAAJ" },
            { Icon: SiResearchgate, label: "ResearchGate",  href: "https://www.researchgate.net/profile/Isaac-Adjei-15" },
            { Icon: SiZotero,       label: "Zotero",        href: "https://www.zotero.org/zaccesss" },
            { Icon: FaLinkedin,     label: "LinkedIn",      href: "https://www.linkedin.com/in/isaacadjei" },
          ] as const).map(({ Icon, label, href }) => (
            <Link
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon className="h-5 w-5 shrink-0" />
              <span className="text-primary hover:underline">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <section aria-labelledby="publications" className="space-y-6">
        <h2 id="publications" className={SECTION_HEADING}>
          Publications
        </h2>

        {publications.length === 0 ? (
          <p className="text-sm text-muted-foreground">No publications yet.</p>
        ) : (
          <>
            <PublicationsPager perPage={ITEMS_PER_PAGE}>
              {publications.map((pub) => (
                <div key={pub.id} className="rounded-xl border bg-card p-6 space-y-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={LABEL_CLASS}>
                      {typeLabel[pub.type] ?? pub.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {pub.venue} · {pub.year}
                    </span>
                  </div>

                  <Link href={`/respub/${pub.id}`} className="block group">
                    <h3 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">{pub.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{pub.authors.join(", ")}</p>

                  {pub.abstract && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{pub.abstract}</p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <Link
                      href={`/respub/${pub.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      Read details and citation
                    </Link>
                    <CopyCitationButtons bibtex={bibtexCitation(pub)} apa={apaCitation(pub)} title={pub.title} />
                  </div>
                </div>
              ))}
            </PublicationsPager>
          </>
        )}
      </section>

      <section aria-labelledby="current-research" className="space-y-6">
        <h2 id="current-research" className={SECTION_HEADING}>
          Current research
        </h2>
        <div className="space-y-6">
          {researchLines.map((line) => (
            <article key={line.id} className="rounded-xl border bg-card p-6 space-y-4">
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
                      className="inline-flex items-center gap-1 text-xs font-mono text-primary hover:underline"
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
    </div>
  )
}
