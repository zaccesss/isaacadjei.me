import { getPublishedIssues, getIssueBySlug, issueLabel, type Issue } from "@/data/newsletter"

const SITE = "https://www.isaacadjei.me"

export interface NewsletterIssue {
  id: string
  number: number
  label: string
  kind: "letter" | "outside"
  title: string
  subtitle: string | null
  publishDate: string
  slug: string
  href: string
  webUrl: string
  thumbnailUrl: string | null
  status: "confirmed"
  itemCount: number
  tags: string[]
}

export function toListing(issue: Issue): NewsletterIssue {
  return {
    id: issue.slug,
    number: issue.number,
    label: issueLabel(issue),
    kind: issue.kind ?? "letter",
    title: issue.title,
    subtitle: issue.subtitle,
    publishDate: `${issue.date}T12:00:00Z`,
    slug: issue.slug,
    href: `/newsletter/${issue.slug}`,
    webUrl: `${SITE}/newsletter/${issue.slug}`,
    thumbnailUrl: null,
    status: "confirmed",
    itemCount: issue.items.length,
    tags: issue.tags,
  }
}

export async function fetchNewsletterIssues(): Promise<NewsletterIssue[]> {
  return getPublishedIssues().map(toListing)
}

export async function fetchNewsletterIssue(slug: string): Promise<Issue | null> {
  return getIssueBySlug(slug) ?? null
}
