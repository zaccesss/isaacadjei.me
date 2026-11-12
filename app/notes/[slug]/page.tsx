import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { notePosts, getNotePostBySlug, getAdjacentNotes, type NotePost } from "@/data/notes"
import { Separator } from "@/components/ui/separator"
import ShareButton from "@/components/shared/ShareButton"
import BlogReactions from "@/components/shared/BlogReactions"
import CommentOnLinks, { REPLY_ANYWHERE } from "@/components/blog/CommentOnLinks"
import GiscusComments from "@/components/blog/GiscusComments"
import { renderBlock as renderContentBlock, buildHeadingIds } from "@/components/shared/markdown/ContentBlocks"
import { TAG_CLASS } from "@/components/shared/lists/Tag"
import CodeBlock from "@/components/shared/markdown/CodeBlock"
import { highlightBlocks } from "@/lib/content/highlight"
import TableOfContents from "@/components/shared/markdown/TableOfContents"
import { collectTocHeadings, hasToc, COMMENTS_SECTION, REACTIONS_SECTION } from "@/lib/content/toc"
import { cn } from "@/lib/utils"
import ReadingProgress from "@/components/shared/scroll/ReadingProgress"
import HashScroll from "@/components/shared/scroll/HashScroll"
import ScrollDepthTracker from "@/components/blog/ScrollDepthTracker"
import { sameShareImage } from "@/lib/content/share-image"

export const revalidate = 604800
export const dynamicParams = true

export async function generateStaticParams() {
  return [
    ...notePosts.filter((p) => p.published).map((p) => ({ slug: p.slug })),
  ]
}

function formatNoteDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getNotePostBySlug(slug)
  if (post) {
    const og = `/api/og?title=${encodeURIComponent(post.title)}&description=${encodeURIComponent(post.description)}`
    return sameShareImage({
      title: `Notes | ${post.title}`,
      description: post.description,
      alternates: {
        canonical: `https://isaacadjei.me/notes/${slug}`,
      },
      openGraph: {
        title: `Notes | ${post.title}`,
        description: post.description,
        type: "article",
        publishedTime: post.date,
        images: [og],
      },
    })
  }
  return {}
}

export default async function NoteSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getNotePostBySlug(slug)
  if (post) return <NotePostView post={post} />
  notFound()
}

async function NotePostView({ post }: { post: NotePost }) {
  const commentsOn = process.env.NEXT_PUBLIC_GISCUS_ENABLED?.toLowerCase() === "true"
  const { prev, next } = getAdjacentNotes(post.slug)
  const headingIds = buildHeadingIds(post.content)
  const highlighted = await highlightBlocks(post.content, (b) => (b.type === "code" ? { code: b.text, lang: b.lang } : null))
  const tocHeadings = collectTocHeadings(post.content, headingIds)
  const showToc = hasToc(tocHeadings)
  return (
    <>
    <ReadingProgress />
    <HashScroll />
    <ScrollDepthTracker slug={post.slug} postType="note" />
    <div className={cn("container max-w-3xl py-24 space-y-12", showToc && "lg:max-w-5xl")}>
      <div>
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to notes
        </Link>
        <time dateTime={post.date} className="block text-sm text-muted-foreground font-mono mb-4">
          {formatNoteDate(post.date)}
        </time>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
          <ShareButton title={`Notes | ${post.title}`} />
        </div>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{post.description}</p>
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <span key={tag} className={TAG_CLASS}>{tag}</span>
          ))}
        </div>
      </div>

      <Separator />

      <div className={cn(showToc && "lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-12 lg:items-start")}>
      {showToc && <TableOfContents headings={tocHeadings} sections={[REACTIONS_SECTION, COMMENTS_SECTION]} />}
      <div className={cn("space-y-12", showToc && "min-w-0 lg:col-start-1 lg:row-start-1")}>
      <article className="space-y-4">
        {post.content.map((block, i) => renderContentBlock(block, i, headingIds, post.content[i - 1], highlighted))}
      </article>

      <section id="reactions" aria-label="Reactions" className="scroll-mt-24">
        <BlogReactions slug={`note-${post.slug}`} />
      </section>

      <section id="comments" aria-labelledby="comments-heading" className="space-y-4 scroll-mt-24">
        <div>
          <h2 id="comments-heading" className="text-base font-semibold">Comments</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {commentsOn ? "Have a thought, correction or question? Sign in with GitHub - I read every comment and reply where I can." : REPLY_ANYWHERE}
          </p>
        </div>
        {commentsOn && <GiscusComments />}
        <CommentOnLinks path={`/notes/${post.slug}`} alongside={commentsOn} />
      </section>

      <Separator />

      {(prev || next) && (
        <nav aria-label="More notes" className="grid grid-cols-2 gap-3">
          {prev ? (
            <Link
              href={`/notes/${prev.slug}`}
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
              href={`/notes/${next.slug}`}
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
        </nav>
      )}

      <Link
        href="/notes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to notes
      </Link>
      </div>
      </div>
    </div>
    </>
  )
}
