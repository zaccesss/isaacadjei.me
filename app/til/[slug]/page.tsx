import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import {
  getTILBySlug,
  getPublishedTILEntries,
  type TILBlock,
} from "@/data/til"
import CodeBlock from "@/components/shared/CodeBlock"
import Callout from "@/components/shared/Callout"
import Tag, { tilCategoryLabelClass } from "@/components/shared/Tag"
import { highlightBlocks } from "@/lib/highlight"
import ShareButton from "@/components/shared/ShareButton"
import TableOfContents, { type TocHeading } from "@/components/shared/TableOfContents"
import { cn } from "@/lib/utils"
import { isLive } from "@/lib/schedule"
import ScrollDepthTracker from "@/components/blog/ScrollDepthTracker"
import TILFooter from "@/components/til/TILFooter"

export const revalidate = 21600

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g)
  if (parts.length === 1) return text
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (match) {
      const isExternal = match[2].startsWith("http")
      return (
        <a
          key={i}
          href={match[2]}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {match[1]}
        </a>
      )
    }
    return part
  })
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export async function generateStaticParams() {
  return getPublishedTILEntries().map((e) => ({ slug: e.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getTILBySlug(slug)
  if (!entry) return {}

  const isFuture = !isLive(entry.date)

  return {
    title: `TIL | ${entry.title}`,
    description: entry.body,
    ...(isFuture && {
      robots: { index: false, follow: false },
    }),
    openGraph: {
      title: `TIL | ${entry.title}`,
      description: entry.body,
    },
  }
}

function renderBlock(block: TILBlock, i: number, highlighted: Record<number, string>): React.ReactNode {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} id={block.text.toLowerCase().replace(/\s+/g, "-")} className="text-base font-semibold mt-6 mb-2">
          {block.text}
        </h2>
      )
    case "p":
      return (
        <p key={i} className="text-sm text-muted-foreground leading-relaxed">
          {renderInline(block.text)}
        </p>
      )
    case "code":
      return (
        <div key={i} className="space-y-1">
          <CodeBlock lang={block.lang} text={block.code} html={highlighted[i]} />
          {block.caption && (
            <p className="text-xs text-muted-foreground text-center font-mono">{block.caption}</p>
          )}
        </div>
      )
    case "note":
      return (
        <Callout key={i} kind="note">
          {renderInline(block.text)}
        </Callout>
      )
    case "embed":
      return (
        <div key={i} className="space-y-1">
          <div className={cn(
            "w-full overflow-hidden",
            block.variant === "spotify" ? "h-[152px] rounded-xl" : "aspect-video rounded-lg border border-border"
          )}>
            <iframe
              src={block.url}
              className="w-full h-full"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              title={block.caption ?? "Embedded content"}
            />
          </div>
          {block.caption && (
            <p className="text-xs text-muted-foreground text-center">{block.caption}</p>
          )}
        </div>
      )
    case "link":
      return (
        <a
          key={i}
          href={block.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-start gap-3 rounded-lg border border-border bg-card p-4 hover:bg-muted/50 transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium group-hover:text-primary transition-colors">{block.label}</p>
            {block.description && (
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{block.description}</p>
            )}
            <p className="text-xs text-muted-foreground/60 mt-1 font-mono truncate">{block.url}</p>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        </a>
      )
    default:
      return null
  }
}

export default async function TILSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getTILBySlug(slug)

  if (!entry) notFound()

  if (!entry.published && process.env.NODE_ENV !== "development") notFound()

  const isFuture = !isLive(entry.date)
  const highlighted = await highlightBlocks(entry.detail, (b) => (b.type === "code" ? { code: b.code, lang: b.lang } : null))

  const sorted = getPublishedTILEntries().sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const idx = sorted.findIndex((e) => e.id === entry.id)
  const prev = idx > 0 ? sorted[idx - 1] : null
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : null

  const tocHeadings: TocHeading[] = (entry.detail ?? [])
    .filter((b): b is Extract<TILBlock, { type: "h2" }> => b.type === "h2")
    .map((b) => ({
      id: b.text.toLowerCase().replace(/\s+/g, "-"),
      text: b.text,
      level: 2,
    }))
  const showToC = tocHeadings.length >= 3

  return (
    <div className={cn("container py-24", showToC ? "max-w-2xl xl:max-w-5xl" : "max-w-2xl")}>
      {entry.published && !isFuture && <ScrollDepthTracker slug={entry.id} postType="til" />}

      <Link
        href="/til"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to TIL
      </Link>

      <div className={cn(showToC && "xl:grid xl:grid-cols-[1fr_220px] xl:gap-12 xl:items-start")}>
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={tilCategoryLabelClass(entry.category)}>{entry.category}</span>
              <time dateTime={entry.date} className="text-xs text-muted-foreground font-mono">
                {formatDate(entry.date)}
              </time>
            </div>

            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold tracking-tight leading-snug">{entry.title}</h1>
              <ShareButton title={`TIL | ${entry.title}`} />
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {renderInline(entry.body)}
          </p>

          {entry.detail && entry.detail.length > 0 && (
            <div className="space-y-4">
              {entry.detail.map((block, i) => renderBlock(block, i, highlighted))}
            </div>
          )}

          {((entry.tags && entry.tags.length > 0) || entry.source) && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {entry.tags?.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
              {entry.source && (
                <a
                  href={entry.source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline ml-auto"
                >
                  {entry.source.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          {entry.relatedPost && (
            <div className="rounded-lg border border-border bg-muted/30 px-4 py-3">
              <p className="text-xs text-muted-foreground">
                This turned into a full post:{" "}
                <Link href={`/blog/${entry.relatedPost}`} className="text-primary hover:underline">
                  Read the full post
                </Link>
              </p>
            </div>
          )}

          <TILFooter entry={entry} visibleEntries={sorted} />

          {(prev || next) && (
            <>
              <nav className="flex items-start justify-between gap-4 text-sm">
                {prev ? (
                  <Link href={`/til/${prev.id}`} className="flex flex-col gap-1 group max-w-[45%]">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <ArrowLeft className="h-3 w-3" /> Previous
                    </span>
                    <span className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {prev.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
                {next ? (
                  <Link href={`/til/${next.id}`} className="flex flex-col gap-1 group items-end text-right max-w-[45%] ml-auto">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      Next <ArrowRight className="h-3 w-3" />
                    </span>
                    <span className="text-xs font-medium group-hover:text-primary transition-colors line-clamp-2">
                      {next.title}
                    </span>
                  </Link>
                ) : (
                  <div />
                )}
              </nav>
            </>
          )}
        </div>

        {showToC && <TableOfContents headings={tocHeadings} />}
      </div>
    </div>
  )
}
