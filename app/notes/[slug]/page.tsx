import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { notes, notePosts, getNoteBySlug, getNotePostBySlug, type NoteBlock, type NotePost } from "@/data/notes"
import { Separator } from "@/components/ui/separator"
import ShareButton from "@/components/shared/ShareButton"
import { renderBlock as renderContentBlock, buildHeadingIds } from "@/components/shared/ContentBlocks"
import { TAG_CLASS } from "@/components/shared/Tag"
import CodeBlock from "@/components/shared/CodeBlock"
import { highlightBlocks } from "@/lib/highlight"

export const revalidate = 21600
export const dynamicParams = true

export async function generateStaticParams() {
  return [
    ...notes.map((n) => ({ slug: n.slug })),
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
    return {
      title: `Notes | ${post.title}`,
      description: post.description,
      alternates: {
        canonical: `https://www.isaacadjei.me/notes/${slug}`,
      },
      openGraph: {
        title: `Notes | ${post.title}`,
        description: post.description,
        type: "article",
        publishedTime: post.date,
        images: [og],
      },
    }
  }
  const note = getNoteBySlug(slug)
  if (!note) return {}

  return {
    title: `Notes | ${note.title}`,
    description: note.description,
    alternates: {
      canonical: `https://www.isaacadjei.me/notes/${slug}`,
    },
    openGraph: {
      title: `Notes | ${note.title}`,
      images: [`/api/og?title=${note.ogTitle}&description=${note.ogDescription}`],
    },
  }
}

function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g)
  if (parts.length === 1) return text
  return parts.map((part, i) => {
    const bold = part.match(/^\*\*([^*]+)\*\*$/)
    if (bold) return <strong key={i}>{bold[1]}</strong>

    const code = part.match(/^`([^`]+)`$/)
    if (code) return <code key={i}>{code[1]}</code>

    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (link) {
      const isExternal = link[2].startsWith("http")
      return (
        <a
          key={i}
          href={link[2]}
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-primary underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          {link[1]}
        </a>
      )
    }
    return part
  })
}

function renderBlock(block: NoteBlock, i: number): React.ReactNode {
  switch (block.type) {
    case "h2":
      return <h2 key={i}>{block.text}</h2>
    case "h3":
      return (
        <h2 key={i} className="text-base font-semibold text-foreground/80 mt-2!">
          {block.text}
        </h2>
      )
    case "p":
      return <p key={i}>{renderInline(block.text)}</p>
    case "list":
      return (
        <ul key={i} className="list-none space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2 text-sm">
              <span className="text-primary shrink-0 mt-0.5">→</span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      )
    case "pre":
      return (
        <CodeBlock key={i} lang="text" text={block.text} />
      )
    default:
      return null
  }
}

export default async function NoteSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getNotePostBySlug(slug)
  if (post) return <NotePostView post={post} />
  const note = getNoteBySlug(slug)
  if (!note) notFound()

  return (
    <div className="container max-w-3xl py-24 space-y-12">
      <div>
        <Link
          href="/notes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to notes
        </Link>
        <div className="flex flex-wrap gap-2 mb-4">
          {note.tags.map((tag) => (
            <span key={tag} className={TAG_CLASS}>{tag}</span>
          ))}
        </div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-4xl font-bold tracking-tight">{note.title}</h1>
          <ShareButton title={`Notes | ${note.title}`} />
        </div>
        <p className="mt-4 text-muted-foreground text-lg leading-relaxed">{note.lead}</p>
      </div>

      <Separator />

      <section className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground [&_h2]:text-foreground [&_h2]:font-bold [&_h2]:text-xl [&_h2]:mt-0 [&_p]:leading-relaxed [&_p]:text-[0.95rem]">
        {note.body.map((block, i) => renderBlock(block, i))}
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-bold">References and resources</h2>
        <ul className="space-y-3">
          {note.references.map((ref) => (
            <li key={ref.text}>
              <a
                href={ref.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-start gap-2 text-sm text-primary hover:underline group"
              >
                <ExternalLink className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-70 group-hover:opacity-100" />
                <span>{ref.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <Separator />

      <Link
        href="/notes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to notes
      </Link>
    </div>
  )
}

async function NotePostView({ post }: { post: NotePost }) {
  const headingIds = buildHeadingIds(post.content)
  const highlighted = await highlightBlocks(post.content, (b) => (b.type === "code" ? { code: b.text, lang: b.lang } : null))
  return (
    <div className="container max-w-3xl py-24 space-y-12">
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

      <article className="space-y-4">
        {post.content.map((block, i) => renderContentBlock(block, i, headingIds, post.content[i - 1], highlighted))}
      </article>

      <Separator />

      <Link
        href="/notes"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to notes
      </Link>
    </div>
  )
}
