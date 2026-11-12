import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react"
import {
  getTILBySlug,
  getPublishedTILEntries,
  type TILBlock,
} from "@/data/til"
import CodeBlock from "@/components/shared/markdown/CodeBlock"
import Callout from "@/components/shared/markdown/Callout"
import Tag, { tilCategoryLabelClass } from "@/components/shared/lists/Tag"
import { highlightBlocks } from "@/lib/content/highlight"
import ShareButton from "@/components/shared/ShareButton"
import BlogReactions from "@/components/shared/BlogReactions"
import TableOfContents from "@/components/shared/markdown/TableOfContents"
import { hasToc, REACTIONS_SECTION, REPLY_SECTION, type TocHeading } from "@/lib/content/toc"
import { cn } from "@/lib/utils"
import { isLive } from "@/lib/time/schedule"
import ScrollDepthTracker from "@/components/blog/ScrollDepthTracker"
import TILFooter from "@/components/til/TILFooter"
import { ReplySection } from "@/components/blog/CommentOnLinks"
import { readLink, splitLinks, stripLinks } from "@/lib/content/markdown-links"
import { liveRelatedPost } from "@/lib/content/related-post"

export const revalidate = 604800

function renderInline(text: string): React.ReactNode {
  const parts = splitLinks(text)
  if (parts.length === 1) return text
  return parts.map((part, i) => {
    const link = readLink(part)
    if (link) {
      const isExternal = link.href.startsWith("http")
      return (
        <a
          key={i}
          href={link.href}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="body-link"
        >
          {link.text}
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
    description: plainText(entry.body),
    ...(isFuture && {
      robots: { index: false, follow: false },
    }),
    openGraph: {
      title: `TIL | ${entry.title}`,
      description: plainText(entry.body),
      type: "article",
      publishedTime: entry.date,
      images: [tilOgImage(entry.title, entry.body)],
    },
    twitter: {
      card: "summary_large_image",
      images: [tilOgImage(entry.title, entry.body)],
    },
  }
}

function plainText(body: string): string {
  return stripLinks(body).replace(/[`*_]/g, "").replace(/\s+/g, " ").trim()
}

function tilOgImage(title: string, body: string): string {
  const plain = plainText(body)
  const summary = plain.length > 160 ? `${plain.slice(0, 160).replace(/\s+\S*$/, "")}...` : plain
  return `/api/og?title=${encodeURIComponent(`TIL: ${title}`)}&description=${encodeURIComponent(summary)}`
}

function renderBlock(block: TILBlock, i: number, highlighted: Record<number, string>): React.ReactNode {
  switch (block.type) {
    case "h2":
      return (
        <h2 key={i} id={block.text.toLowerCase().replace(/\s+/g, "-")} className="text-base font-semibold mt-6 mb-2 scroll-mt-24">
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
            block.variant === "spotify" ? "h-38 rounded-xl" : "aspect-video rounded-lg border border-border"
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

  const relatedPost = liveRelatedPost(entry)

  const tocHeadings: TocHeading[] = (entry.detail ?? [])
    .filter((b): b is Extract<TILBlock, { type: "h2" }> => b.type === "h2")
    .map((b) => ({
      id: b.text.toLowerCase().replace(/\s+/g, "-"),
      text: b.text,
      level: 2,
    }))
  const showToC = hasToc(tocHeadings)

  return (
    <div className={cn("container py-24", showToC ? "max-w-2xl lg:max-w-5xl" : "max-w-2xl")}>
      {entry.published && !isFuture && <ScrollDepthTracker slug={entry.id} postType="til" />}

      <Link
        href="/til"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to TIL
      </Link>

      <div className={cn(showToC && "lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12 lg:items-start")}>
        {showToC && <TableOfContents headings={tocHeadings} sections={[REACTIONS_SECTION, REPLY_SECTION]} />}
        <div className={cn("space-y-8", showToC && "min-w-0 lg:col-start-1 lg:row-start-1")}>
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

            {entry.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {entry.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed">
            {renderInline(entry.body)}
          </p>

          {entry.detail && entry.detail.length > 0 && (
            <div className="space-y-4">
              {entry.detail.map((block, i) => renderBlock(block, i, highlighted))}
            </div>
          )}

          {entry.source && (
            <p className="pt-2 text-sm text-muted-foreground">
              Source:{" "}
              <a href={entry.source.url} target="_blank" rel="noopener noreferrer" className="body-link">
                {entry.source.label}
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </p>
          )}

          {relatedPost && (
            <Callout kind="note" className="my-0">
              This turned into a full post:{" "}
              <Link
                href={`/blog/${relatedPost.slug}`}
                className="body-link"
              >
                Read the full post
              </Link>
            </Callout>
          )}

          <section id="reactions" aria-label="Reactions" className="scroll-mt-24">
            <BlogReactions slug={`til-${entry.id}`} />
          </section>

          <ReplySection path={`/til/${entry.id}`} className="space-y-2 scroll-mt-24" />

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
      </div>
    </div>
  )
}
