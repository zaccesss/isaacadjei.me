import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Calendar, CalendarDays, Clock, Lightbulb, NotebookPen } from "lucide-react"
import Tag, { postTypeLabelClass } from "@/components/shared/Tag"
import { computeReadingTime } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import ReadingProgress from "@/components/shared/ReadingProgress"
import HashScroll from "@/components/shared/HashScroll"
import ScrollDepthTracker from "@/components/blog/ScrollDepthTracker"
import BlogReactions from "@/components/shared/BlogReactions"
import GiscusComments from "@/components/blog/GiscusComments"
import ShareButton from "@/components/shared/ShareButton"
import { renderBlock, buildHeadingIds } from "@/components/shared/ContentBlocks"
import { allIssues, getIssueBySlug, getPublishedIssues, SIGN_OFF_NAME, SIGNATURE, issueLabel, type GatheredItem, type GatheredKind } from "@/data/newsletter"

export const revalidate = 604800
export const dynamicParams = true

export async function generateStaticParams() {
  return allIssues()
    .filter((i) => i.published)
    .map((i) => ({ slug: i.slug }))
}

function formatDate(date: string): string {
  return new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const issue = getIssueBySlug(slug)
  if (!issue) return {}
  return {
    title: `Newsletter | ${issue.title}`,
    description: issue.subtitle,
    alternates: { canonical: `https://www.isaacadjei.me/newsletter/${slug}` },
    openGraph: {
      title: `Newsletter | ${issue.title}`,
      description: issue.subtitle,
      type: "article",
      publishedTime: issue.date,
      images: [`/api/og?title=${encodeURIComponent(issue.title)}&description=${encodeURIComponent(issue.subtitle)}`],
    },
  }
}

const SECTIONS: { kind: GatheredKind; title: string; icon: typeof BookOpen }[] = [
  { kind: "blog", title: "Blog posts", icon: BookOpen },
  { kind: "til", title: "Today I learned", icon: Lightbulb },
  { kind: "note", title: "Notes", icon: NotebookPen },
]

function excerpt(text: string, max = 200): string {
  const plain = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*`]/g, "")
  return plain.length > max ? `${plain.slice(0, max).replace(/\s+\S*$/, "")}...` : plain
}

function ItemRow({ item }: { item: GatheredItem }) {
  return (
    <Link
      href={item.href}
      className="group flex items-start gap-4 rounded-lg border border-border/60 bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/30 transition-all"
    >
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">{item.title}</p>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{excerpt(item.description)}</p>
        <p className="text-[11px] font-mono text-muted-foreground">{formatDate(item.date)}</p>
      </div>
      <ArrowRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
    </Link>
  )
}

export default async function NewsletterIssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const issue = getIssueBySlug(slug)
  if (!issue) notFound()

  const published = getPublishedIssues()
  const index = published.findIndex((i) => i.slug === slug)
  const newer = index > 0 ? published[index - 1] : undefined
  const older = index >= 0 ? published[index + 1] : undefined

  const introIds = buildHeadingIds(issue.intro)
  const outroIds = buildHeadingIds(issue.outro ?? [])
  const outsideIds = buildHeadingIds(issue.outside?.blocks ?? [])
  const commentsOn = process.env.NEXT_PUBLIC_GISCUS_ENABLED?.toLowerCase() === "true"
  const readingTime = computeReadingTime([
    ...issue.intro,
    ...(issue.outro ?? []),
    ...issue.items.map((i) => ({ type: "p", text: `${i.title} ${i.description}` })),
  ])

  return (
    <>
      <ReadingProgress />
      <HashScroll />
      <ScrollDepthTracker slug={slug} postType="newsletter" />
      <div className="container max-w-2xl py-24 space-y-10">
        <Link
          href="/newsletter"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All issues
        </Link>

        <header className="space-y-4">
          <span className={postTypeLabelClass("newsletter")}>Newsletter · {issueLabel(issue)}</span>
          <h1 className="text-3xl font-bold tracking-tight leading-snug">{issue.title}</h1>
          <p className="text-base text-muted-foreground leading-relaxed">{issue.subtitle}</p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground font-mono">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <time dateTime={issue.date}>{formatDate(issue.date)}</time>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {readingTime} min read
            </span>
            <div className="ml-auto">
              <ShareButton title={`Newsletter | ${issue.title}`} />
            </div>
          </div>
          {issue.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {issue.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          )}
        </header>

        <Separator />

        <article className="space-y-5">
          <p className="text-[0.95rem] leading-relaxed">{issue.greeting}</p>
          {issue.intro.map((block, i) => renderBlock(block, i, introIds, issue.intro[i - 1]))}
        </article>

        {issue.items.length > 0 && (
          <section className="space-y-8" aria-labelledby="in-this-issue">
            <h2 id="in-this-issue" className="text-2xl font-bold">From the last two weeks</h2>
            {SECTIONS.map(({ kind, title, icon: Icon }) => {
              const items = issue.items.filter((i) => i.kind === kind)
              if (items.length === 0) return null
              return (
                <div key={kind} className="space-y-3">
                  <h3 className="flex items-center gap-2 text-base font-semibold">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    {title}
                    <span className="text-xs font-mono font-normal text-muted-foreground">({items.length})</span>
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <ItemRow key={item.key} item={item} />
                    ))}
                  </div>
                </div>
              )
            })}
          </section>
        )}

        {issue.outside && issue.outside.blocks.length > 0 && (
          <section className="space-y-5" aria-labelledby="outside">
            <h2 id="outside" className="text-2xl font-bold">{issue.outside.title}</h2>
            {issue.outside.blocks.map((block, i) => renderBlock(block, i, outsideIds, issue.outside?.blocks[i - 1]))}
          </section>
        )}

        {issue.worth.length > 0 && (
          <section className="space-y-3" aria-labelledby="worth">
            <h2 id="worth" className="text-2xl font-bold">Worth your time</h2>
            <p className="text-sm text-muted-foreground">What I read, watched and listened to in the same two weeks.</p>
            <ul className="space-y-2">
              {issue.worth.map((w) => (
                <li key={w.url + w.title}>
                  <a
                    href={w.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 hover:border-primary/40 hover:bg-muted/30 transition-all"
                  >
                    <span className="w-16 shrink-0 text-[11px] font-mono uppercase tracking-wider text-muted-foreground pt-0.5">{w.kind}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-snug group-hover:text-primary transition-colors">{w.title}</span>
                      <span className="block text-xs text-muted-foreground">{w.by}</span>
                    </span>
                    <ArrowUpRight className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {issue.midweek.length > 0 && (
          <section className="space-y-3" aria-labelledby="midweek">
            <h2 id="midweek" className="text-2xl font-bold">In case you missed it</h2>
            <p className="text-sm text-muted-foreground">The Outside and Midweek issues from the same two weeks.</p>
            <ul className="space-y-2">
              {issue.midweek.map((m) => (
                <li key={m.slug}>
                  <Link
                    href={`/newsletter/${m.slug}`}
                    className="group flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 hover:border-primary/40 hover:bg-muted/30 transition-all"
                  >
                    <span className="w-20 shrink-0 text-[11px] font-mono uppercase tracking-wider text-muted-foreground pt-0.5">{m.label}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium leading-snug group-hover:text-primary transition-colors">{m.title}</span>
                      <span className="block text-xs text-muted-foreground">{m.subtitle}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <article className="space-y-5">
          {(issue.outro ?? []).map((block, i) => renderBlock(block, i, outroIds, issue.outro?.[i - 1]))}
          <p className="text-[0.95rem] leading-relaxed">
            {issue.signOff}
            <br />
            {SIGN_OFF_NAME}
          </p>
          <div className="space-y-2.5 pt-2">
            <div className="flex items-center gap-4">
              <Image src={SIGNATURE.logo} alt="" width={64} height={64} className="h-16 w-16 shrink-0" />
              <div className="border-l-[3px] border-primary pl-4 space-y-0.5 min-w-0">
                <p className="font-semibold text-primary">{SIGNATURE.name} <span className="text-xs font-normal">({SIGNATURE.pronouns})</span></p>
                {SIGNATURE.lines.map((line) => (
                  <p key={line} className="text-xs text-muted-foreground">{line}</p>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs">
                {SIGNATURE.links.map((l, i) => (
                  <span key={l.href}>
                    {i > 0 && <span className="text-muted-foreground" aria-hidden="true"> | </span>}
                    <a href={l.href} className="text-primary underline underline-offset-2 hover:text-primary/80">{l.label}</a>
                  </span>
                ))}
              </p>
              <p className="text-sm">
                <a href={SIGNATURE.booking.href} className="inline-flex items-center gap-1.5 font-semibold text-primary underline underline-offset-2 hover:text-primary/80">
                  <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {SIGNATURE.booking.label}
                </a>
              </p>
            </div>
          </div>
        </article>

        <Separator />

        <nav className="grid grid-cols-2 gap-4" aria-label="Other issues">
          {older ? (
            <Link href={`/newsletter/${older.slug}`} className="group flex flex-col gap-1">
              <span className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
                <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                Previous issue
              </span>
              <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {older.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {newer ? (
            <Link href={`/newsletter/${newer.slug}`} className="group flex flex-col gap-1 text-right">
              <span className="flex items-center justify-end gap-1 text-xs text-muted-foreground font-mono">
                Next issue
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
              </span>
              <span className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                {newer.title}
              </span>
            </Link>
          ) : (
            <div />
          )}
        </nav>

        <div className="pt-6 border-t border-border/40 space-y-8">
          <div id="reactions" className="space-y-4 scroll-mt-20">
            <div>
              <h3 className="text-base font-semibold">Reactions</h3>
              <p className="text-sm text-muted-foreground mt-0.5">No login needed. Tap an emoji to let me know what landed.</p>
            </div>
            <BlogReactions slug={`newsletter-${slug}`} />
          </div>
          {commentsOn && (
            <div id="comments" className="space-y-4 scroll-mt-20">
              <div>
                <h3 className="text-base font-semibold">Comments</h3>
                <p className="text-sm text-muted-foreground mt-0.5">Have a thought, correction or question? Sign in with GitHub - I read every comment and reply where I can.</p>
              </div>
              <GiscusComments />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
