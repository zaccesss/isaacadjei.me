import { newsletterChannel, newsletterItems } from "@/lib/content/feeds"
import { fetchNewsletterIssues } from "@/lib/newsletter/newsletter"
import { rssResponse } from "@/lib/content/rss"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const issues = await fetchNewsletterIssues()
  return rssResponse(request, newsletterChannel, newsletterItems(issues), {
    xml: "public, max-age=3600",
    html: "public, max-age=600",
  })
}
