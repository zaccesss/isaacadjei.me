import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Clock, Calendar, ExternalLink } from "lucide-react"
import { getPostBySlug, getPublishedPosts, getAdjacentPosts, getSeriesPosts, SERIES_LABELS, type PostType } from "@/data/blog"
import { projects } from "@/data/projects"
import Tag, { postTypeLabelClass } from "@/components/shared/Tag"
import { highlightBlocks } from "@/lib/highlight"
import ReadingProgress from "@/components/shared/ReadingProgress"
import ScrollDepthTracker from "@/components/blog/ScrollDepthTracker"
import { renderBlock, buildHeadingIds } from "@/components/shared/ContentBlocks"
import TableOfContents, { type TocHeading } from "@/components/shared/TableOfContents"
import BlogReactions from "@/components/shared/BlogReactions"
import SeriesBanner from "@/components/shared/SeriesBanner"
import ShareButton from "@/components/shared/ShareButton"
import GiscusComments from "@/components/blog/GiscusComments"
import AuthorCard from "@/components/blog/AuthorCard"
import ThemedCover from "@/components/shared/ThemedCover"

export const revalidate = 21600

const TYPE_LABELS: Record<PostType, string> = {
  blog: "Blog",
  journal: "Journal",
  research: "Research",
  notes: "Notes",
  report: "Report",
  article: "Article",
  resources: "Resources",
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export async function generateStaticParams() {
  return getPublishedPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}
  if (!post.published) {
    return {
      robots: {
        index: false,
        follow: false,
      },
    }
  }
  return {
    title: `Blog | ${post.title}`,
    description: post.description,
    alternates: {
      canonical: `https://www.isaacadjei.me/blog/${slug}`,
    },
    openGraph: {
      title: `Blog | ${post.title}`,
      images: [
        post.cover_image
          ? `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.isaacadjei.me"}${post.cover_image}`
          : `/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}`,
      ],
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()
  if (!post.published && process.env.NODE_ENV !== "development") notFound()
  const linkedProject = post.projectSlug ? projects.find((p) => p.id === post.projectSlug) : null

  const relatedPosts = getPublishedPosts()
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      ...p,
      sharedTags: p.tags.filter((t) => post.tags.includes(t)).length,
    }))
    .filter((p) => p.sharedTags > 0)
    .sort((a, b) => b.sharedTags - a.sharedTags)
    .slice(0, 3)

  const { prev, next } = getAdjacentPosts(slug)
  const seriesPosts = post.series ? getSeriesPosts(post.series) : []
  const seriesLabel = post.series ? (SERIES_LABELS[post.series] ?? post.series) : null
  const headingIds = buildHeadingIds(post.content)
  const highlighted = await highlightBlocks(post.content, (b) => (b.type === "code" ? { code: b.text, lang: b.lang } : null))
  const tocHeadings: TocHeading[] = post.content
    .map((block, i) => {
      if (block.type !== "h2" && block.type !== "h3") return null
      return { id: headingIds.get(i)!, text: block.text, level: block.type === "h2" ? 2 : 3 } as TocHeading
    })
    .filter(Boolean) as TocHeading[]

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: "Isaac Adjei",
      url: "https://www.isaacadjei.me",
    },
    publisher: {
      "@type": "Person",
      name: "Isaac Adjei",
    },
    url: `https://www.isaacadjei.me/blog/${slug}`,
    keywords: post.tags.join(", "),
    timeRequired: `PT${post.readingTime}M`,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <ReadingProgress />
      {post.published && <ScrollDepthTracker slug={slug} />}
    <div className="container max-w-2xl py-24 xl:max-w-5xl">
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All writing
      </Link>

      <div className="space-y-4 mb-10">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={postTypeLabelClass(post.type)}
          >
            {TYPE_LABELS[post.type]}
          </span>
          {!post.published && (
            <span className="inline-flex items-center font-mono text-xs uppercase tracking-wider text-muted-foreground">
              draft
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold tracking-tight leading-snug">{post.title}</h1>

        <p className="text-base text-muted-foreground leading-relaxed">{post.description}</p>

        <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3" />
            {formatDate(post.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            {post.readingTime} min read
          </span>
          <div className="ml-auto">
            <ShareButton title={`Blog | ${post.title}`} />
          </div>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </div>
        )}

        {post.cover_image && (
          <div className="relative w-full aspect-4/3 sm:aspect-video md:aspect-21/9 overflow-hidden rounded-xl mt-4">
            <ThemedCover
              src={post.cover_image}
              darkSrc={post.cover_image_dark}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {post.headerLinks && post.headerLinks.length > 0 && (
          <div className="flex items-center gap-4 flex-wrap">
            {post.headerLinks.map((l, j) => {
              const cls = j === 0
                ? "inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
                : "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              return l.url.startsWith("/") ? (
                <Link key={l.url} href={l.url} className={cls}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  {l.label}
                </Link>
              ) : (
                <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" className={cls}>
                  <ExternalLink className="h-3.5 w-3.5" />
                  {l.label}
                </a>
              )
            })}
          </div>
        )}

        {linkedProject && !post.headerLinks && (
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href={`/projects/${post.projectSlug}`}
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              View project page
            </Link>
            {linkedProject.github && (
              <a
                href={linkedProject.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                GitHub
              </a>
            )}
          </div>
        )}
        <hr className="border-border/40" />
      </div>

      <div className="xl:grid xl:grid-cols-[1fr_220px] xl:gap-12 xl:items-start">
        <div>
          {seriesLabel && seriesPosts.length > 1 && (
            <SeriesBanner
              seriesLabel={seriesLabel}
              posts={seriesPosts}
              currentSlug={slug}
            />
          )}
          {(post.published || process.env.NODE_ENV === "development") && post.content.length > 0 ? (
            <div className="space-y-5">
              {post.content.map((block, i) => renderBlock(block, i, headingIds, post.content[i - 1], highlighted))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border/60 p-12 text-center space-y-2">
              <p className="text-sm font-medium">This post is still being written.</p>
              <p className="text-xs text-muted-foreground">Check back soon.</p>
            </div>
          )}

          {relatedPosts.length > 0 && (
            <div className="mt-16 pt-8 border-t border-border/40 space-y-4">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest font-mono">
                You might also like
              </h2>
              <div className="space-y-3">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.slug}
                    href={`/blog/${related.slug}`}
                    className="group flex items-start justify-between gap-4 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 hover:border-primary/40 hover:bg-muted/30 transition-all"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-1">
                        {related.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1 leading-relaxed">
                        {related.description}
                      </p>
                    </div>
                    <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary rotate-180 shrink-0 mt-0.5 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-border/40">
            <div className="grid grid-cols-2 gap-3">
              {prev ? (
                <Link
                  href={`/blog/${prev.slug}`}
                  className="group flex flex-col gap-1 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 hover:border-primary/40 hover:bg-muted/30 transition-all"
                >
                  <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                    <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                    Previous
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {next ? (
                <Link
                  href={`/blog/${next.slug}`}
                  className="group flex flex-col gap-1 rounded-lg border border-border/60 bg-muted/20 px-4 py-3 hover:border-primary/40 hover:bg-muted/30 transition-all text-right ml-auto w-full"
                >
                  <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground font-mono">
                    Next
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
            <Link
              href="/blog"
              className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All writing
            </Link>
          </div>

          {post.published && process.env.NEXT_PUBLIC_GISCUS_ENABLED?.toLowerCase() === "true" && (
            <div className="mt-8 pt-6 border-t border-border/40 space-y-8">
              <AuthorCard />
              <div id="reactions" className="space-y-4 scroll-mt-20">
                <div>
                  <h3 className="text-base font-semibold">Reactions</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">No login needed. Tap an emoji to let me know what landed.</p>
                </div>
                <BlogReactions slug={slug} />
              </div>
              <div id="comments" className="space-y-4 scroll-mt-20">
                <div>
                  <h3 className="text-base font-semibold">Comments</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">Have a thought, correction or question? Sign in with GitHub - I read every comment and reply where I can.</p>
                </div>
                <GiscusComments />
              </div>
            </div>
          )}
        </div>

        <TableOfContents headings={tocHeadings} />
      </div>
    </div>
    </>
  )
}
