import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Download, FileText } from "lucide-react"
import { SiZenodo, SiGooglescholar } from "react-icons/si"
import { publications } from "@/data/respub"
import { Separator } from "@/components/ui/separator"
import ShareButton from "@/components/shared/ShareButton"
import CodeBlock from "@/components/shared/CodeBlock"
import { highlightCode } from "@/lib/highlight"
import { CHIP_CLASS, LABEL_CLASS } from "@/components/shared/Tag"
import { apaCitation, bibtexCitation, highwireDate, zenodoRecordId } from "@/data/respub/cite"
import CopyCitationButtons from "@/components/respub/CopyCitationButtons"
import ZenodoStats from "@/components/respub/ZenodoStats"

const SITE = "https://www.isaacadjei.me"

const typeLabel: Record<string, string> = {
  "technical-note": "Technical Note",
  conference: "Conference Paper",
  journal: "Journal Article",
  preprint: "Preprint",
}

export async function generateStaticParams() {
  return publications.map((p) => ({ slug: p.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const pub = publications.find((p) => p.id === slug)
  if (!pub) return {}

  const description = pub.abstract ?? `${pub.venue}, ${pub.year}`

  return {
    title: `Research | ${pub.title}`,
    description,
    alternates: {
      canonical: `https://www.isaacadjei.me/respub/${slug}`,
    },
    openGraph: {
      title: `Research | ${pub.title}`,
      images: [`/api/og?title=${encodeURIComponent(pub.title)}&description=${encodeURIComponent(description)}`],
    },
    other: {
      citation_title: pub.title,
      citation_author: pub.authors,
      citation_publication_date: highwireDate(pub),
      citation_doi: pub.doi,
      citation_publisher: pub.venue,
      ...(pub.pdfUrl ? { citation_pdf_url: pub.pdfUrl.startsWith("http") ? pub.pdfUrl : `${SITE}${pub.pdfUrl}` } : {}),
    },
  }
}

export default async function PublicationSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const pub = publications.find((p) => p.id === slug)
  if (!pub) notFound()
  const apa = apaCitation(pub)
  const bibtex = bibtexCitation(pub)
  const recordId = zenodoRecordId(pub)

  return (
    <div className="container max-w-3xl py-24 space-y-10">
      <Link
        href="/respub"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Research &amp; Publications
      </Link>

      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={LABEL_CLASS}>
            {typeLabel[pub.type] ?? pub.type}
          </span>
          <span className="text-xs text-muted-foreground">
            {pub.venue} · {pub.year}
          </span>
        </div>

        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight leading-tight">{pub.title}</h1>
          <ShareButton title={`Research | ${pub.title}`} />
        </div>

        <p className="text-base text-muted-foreground">{pub.authors.join(", ")}</p>
        {recordId && <ZenodoStats recordId={recordId} />}
      </div>

      {pub.abstract && (
        <>
          <Separator />
          <section className="space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Abstract</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{pub.abstract}</p>
          </section>
        </>
      )}

      {pub.keywords && pub.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {pub.keywords.map((kw) => (
            <span key={kw} className={CHIP_CLASS}>
              {kw}
            </span>
          ))}
        </div>
      )}

      <Separator />

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Cite this work</h2>
          <CopyCitationButtons bibtex={bibtex} apa={apa} title={pub.title} />
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed font-mono">{apa}</p>
        <CodeBlock lang="bibtex" text={bibtex} html={await highlightCode(bibtex, "bibtex")} />
      </section>

      <Separator />

      <div className="flex items-center gap-4 flex-wrap">
        <Link
          href={`https://doi.org/${pub.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm font-mono text-primary hover:underline"
        >
          <FileText className="h-4 w-4" />
          {pub.doi}
        </Link>
        {pub.zenodoUrl && (
          <Link
            href={pub.zenodoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <SiZenodo className="h-4 w-4" />
            View on Zenodo
          </Link>
        )}
        {pub.scholarUrl && (
          <Link
            href={pub.scholarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <SiGooglescholar className="h-4 w-4" />
            Google Scholar
          </Link>
        )}
        {pub.pdfUrl && (
          <a
            href={pub.pdfUrl}
            download
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        )}
      </div>
    </div>
  )
}
