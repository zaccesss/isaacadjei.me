import { redis } from "@/lib/redis"

export const NEWSLETTER_CACHE_KEY = "beehiiv:issues:v3"
const CACHE_TTL = 600

export interface NewsletterIssue {
  id: string
  title: string
  subtitle: string | null
  publishDate: string
  slug: string | null
  href: string
  webUrl: string
  thumbnailUrl: string | null
  status: "confirmed" | "archived"
}

export async function fetchNewsletterIssues(): Promise<NewsletterIssue[]> {
  if (redis) {
    const cached = await redis.get<NewsletterIssue[]>(NEWSLETTER_CACHE_KEY)
    if (cached) return cached
  }

  const apiKey = process.env.BEEHIIV_API_KEY
  const pubId = process.env.BEEHIIV_PUBLICATION_ID
  if (!apiKey || !pubId) return []

  const fetchStatus = (status: string) =>
    fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/posts?status=${status}&order_by=publish_date&direction=desc&limit=20`,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(8000),
      }
    )

  const confirmedRes = await fetchStatus("confirmed")
  const confirmedData = confirmedRes.ok ? (await confirmedRes.json()).data ?? [] : []

  const nowUnix = Math.floor(Date.now() / 1000)
  const combined = [...confirmedData]
    .filter((post: { publish_date?: number }) => !!post.publish_date && post.publish_date <= nowUnix)
    .sort(
      (a: { publish_date?: number }, b: { publish_date?: number }) =>
        (b.publish_date ?? 0) - (a.publish_date ?? 0)
    )

  const issues: NewsletterIssue[] = combined.map((post: {
    id: string
    title: string
    subtitle?: string
    publish_date?: number
    slug?: string
    web_url?: string
    thumbnail_url?: string
    status?: string
  }) => ({
    id: post.id,
    title: post.title,
    subtitle: post.subtitle ?? null,
    publishDate: post.publish_date
      ? new Date(post.publish_date * 1000).toISOString()
      : new Date().toISOString(),
    slug: post.slug ?? null,
    href: post.slug ? `/newsletter/${post.slug}` : post.web_url ?? "https://newsletter.isaacadjei.me",
    webUrl: post.web_url ?? `https://newsletter.isaacadjei.me`,
    thumbnailUrl: post.thumbnail_url ?? null,
    status: (post.status === "archived" ? "archived" : "confirmed") as "confirmed" | "archived",
  }))

  if (redis) await redis.set(NEWSLETTER_CACHE_KEY, issues, { ex: CACHE_TTL })

  return issues
}

export interface NewsletterIssueContent extends NewsletterIssue {
  html: string | null
}

export async function fetchNewsletterIssue(slug: string): Promise<NewsletterIssueContent | null> {
  const issues = await fetchNewsletterIssues()
  const issue = issues.find((i) => i.slug === slug)
  if (!issue) return null

  const apiKey = process.env.BEEHIIV_API_KEY
  const pubId = process.env.BEEHIIV_PUBLICATION_ID
  if (!apiKey || !pubId) return { ...issue, html: null }

  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${pubId}/posts/${issue.id}?expand[]=free_web_content`,
      {
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        signal: AbortSignal.timeout(8000),
        next: { revalidate: 21600 },
      }
    )
    if (!res.ok) return { ...issue, html: null }
    const data = (await res.json()).data as { content?: { free?: { web?: string } } } | undefined
    const html = data?.content?.free?.web
    return { ...issue, html: typeof html === "string" && html.trim() ? html : null }
  } catch {
    return { ...issue, html: null }
  }
}
