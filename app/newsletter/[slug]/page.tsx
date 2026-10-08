import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import NewsletterForm from "@/components/shared/NewsletterForm"
import { fetchNewsletterIssue, fetchNewsletterIssues } from "@/lib/newsletter"
import { sanitizeIssueHtml } from "./sanitize"

export const revalidate = 21600

export async function generateStaticParams() {
  try {
    const issues = await fetchNewsletterIssues()
    return issues.filter((i) => i.slug).map((i) => ({ slug: i.slug as string }))
  } catch {
    return []
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const issue = await fetchNewsletterIssue(slug).catch(() => null)
  if (!issue) return {}
  const description = issue.subtitle ?? "An issue of my newsletter: engineering write-ups and things I am building and learning."
  return {
    title: `Newsletter | ${issue.title}`,
    description,
    alternates: { canonical: `https://www.isaacadjei.me/newsletter/${slug}` },
    openGraph: {
      title: `Newsletter | ${issue.title}`,
      type: "article",
      publishedTime: issue.publishDate,
      images: [
        issue.thumbnailUrl ??
          `/api/og?title=${encodeURIComponent(issue.title)}&description=${encodeURIComponent(description)}`,
      ],
    },
  }
}

const CONTENT_CLASS = [
  "space-y-4 text-[0.95rem] leading-relaxed text-muted-foreground break-words",
  "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8",
  "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-6",
  "[&_h4]:font-semibold [&_h4]:text-foreground",
  "[&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary/80",
  "[&_strong]:text-foreground [&_b]:text-foreground",
  "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:mt-1",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:pl-4 [&_blockquote]:italic",
  "[&_img]:rounded-lg [&_img]:border [&_img]:border-border/40 [&_img]:h-auto [&_img]:max-w-full [&_img]:mx-auto",
  "[&_figcaption]:text-xs [&_figcaption]:text-center [&_figcaption]:mt-2",
  "[&_pre]:font-mono [&_pre]:text-sm [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-muted/40 [&_pre]:p-4",
  "[&_code]:font-mono [&_code]:text-sm",
  "[&_hr]:border-border/60 [&_hr]:my-8",
  "[&_table]:w-full [&_table]:text-sm [&_th]:text-left [&_th]:text-foreground [&_th]:p-2 [&_td]:p-2 [&_tr]:border-b [&_tr]:border-border/40",
].join(" ")

export default async function NewsletterIssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const issue = await fetchNewsletterIssue(slug).catch(() => null)
  if (!issue) notFound()

  const html = issue.html ? sanitizeIssueHtml(issue.html) : null

  return (
    <div className="container max-w-2xl py-24 space-y-10">
      <Link
        href="/newsletter"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        All issues
      </Link>

      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <p className="text-xs font-mono text-primary uppercase tracking-widest">newsletter</p>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{issue.title}</h1>
        {issue.subtitle && <p className="text-lg text-muted-foreground leading-relaxed">{issue.subtitle}</p>}
        <p className="text-xs font-mono text-muted-foreground">
          <time dateTime={issue.publishDate}>{formatDate(issue.publishDate)}</time>
        </p>
      </header>

      <Separator />

      {html ? (
        <article className={CONTENT_CLASS} dangerouslySetInnerHTML={{ __html: html }} />
      ) : (
        <div className="rounded-lg border border-border/60 bg-muted/20 px-6 py-8 space-y-3 text-center">
          <p className="text-sm text-muted-foreground">This issue is not available to read here yet.</p>
          <a
            href={issue.webUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Read the full issue
          </a>
        </div>
      )}

      <Separator />

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Get the next issue</h2>
        <p className="text-sm text-muted-foreground">Free, always. Unsubscribe with one click, any time.</p>
        <NewsletterForm />
        <Link href="/newsletter" className="inline-flex items-center gap-1.5 text-sm text-primary hover:text-primary/80">
          <ArrowLeft className="h-4 w-4" />
          Back to the newsletter
        </Link>
      </section>
    </div>
  )
}
