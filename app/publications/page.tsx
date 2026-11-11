import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, FileText, Mail } from "lucide-react"
import { SiOrcid, SiGooglescholar, SiResearchgate, SiZotero } from "react-icons/si"
import { publications } from "@/data/respub"
import { citationStyles } from "@/data/respub/cite"
import CitationPicker from "@/components/respub/CitationPicker"

export const metadata: Metadata = {
  title: "Publications",
  description:
    "What Isaac Adjei has formally published. Citable technical notes, hardware designs and software, each archived with a DOI and a citation in the style you need.",
  alternates: {
    canonical: "https://isaacadjei.me/publications",
  },
  openGraph: {
    images: [
      "/api/og?title=Publications&description=Citable%20work%20by%20Isaac%20Adjei%2C%20each%20archived%20with%20a%20DOI",
    ],
  },
}

const typeLabel: Record<string, string> = {
  "technical-note": "Technical Note",
  conference: "Conference Paper",
  journal: "Journal Article",
  preprint: "Preprint",
  "hardware-design": "Hardware Design",
  software: "Software",
}

import PublicationsPager from "./PublicationsPager"
import { LABEL_CLASS } from "@/components/shared/lists/Tag"

const ITEMS_PER_PAGE = 6

const SECTION_HEADING = "text-xs font-semibold uppercase tracking-widest text-muted-foreground"

export default function PublicationsPage() {

  return (
    <div className="container max-w-3xl py-24 space-y-16">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Publications</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
          Work I have finished and put on the record. Each piece is archived on Zenodo with a DOI and an open
          licence, so it can be read, cited in the style you need and built on.
        </p>
        <p className="text-muted-foreground leading-relaxed max-w-2xl">
          What is still in progress is on the{" "}
          <Link href="/research" className="text-primary underline underline-offset-4 hover:text-primary/80">Research page</Link>.
        </p>

        <div className="flex items-center gap-x-4 gap-y-2 flex-wrap">
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
                    <span className="text-xs text-muted-foreground">{pub.year}</span>
                  </div>

                  <Link href={`/publications/${pub.id}`} className="block group">
                    <h3 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">{pub.title}</h3>
                  </Link>
                  <p className="text-sm text-muted-foreground">{pub.authors.join(", ")}</p>

                  {pub.abstract && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{pub.abstract}</p>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <Link
                      href={`/publications/${pub.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                      Read details and citation
                    </Link>
                    <CitationPicker styles={citationStyles(pub)} title={pub.title} showText={false} />
                  </div>
                </div>
              ))}
            </PublicationsPager>
          </>
        )}
      </section>

      <p className="text-sm">
        <Link href="/research" className="inline-flex min-h-11 items-center gap-1.5 font-medium text-primary underline-offset-4 hover:underline">
          See the research behind these and what is in progress
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </p>
    </div>
  )
}
