import { profileLinks } from "@/data/links"
import { SITE_URL } from "@/lib/constants"

export type CommentLink = { network: string; href: string }

const profileUrl = (icon: string): URL | null => {
  const url = profileLinks.find((l) => l.icon === icon)?.url
  return url ? new URL(url) : null
}

export function socialHandles(): { bluesky: string | null; substack: string | null; mastodon: string | null; x: string | null } {
  const substack = profileUrl("substack")?.pathname.match(/^\/@([^/@]+)/)?.[1]
  const bluesky = profileUrl("bluesky")?.pathname.match(/^\/profile\/([^/]+)/)?.[1]
  const mastodonUrl = profileUrl("mastodon")
  const mastodon = mastodonUrl?.pathname.match(/^\/@([^/@]+)/)?.[1]
  const x = profileUrl("twitter")?.pathname.match(/^\/([^/]+)/)?.[1]
  return {
    bluesky: bluesky ? `@${bluesky}` : null,
    substack: substack ? `@${substack}` : null,
    mastodon: mastodon && mastodonUrl ? `@${mastodon}@${mastodonUrl.host}` : null,
    x: x ? `@${x}` : null,
  }
}

const draft = (handle: string, url: string) => encodeURIComponent(`Reading ${handle} ${url}\n\nMy thought: `)

const substackDraft = (handle: string) => encodeURIComponent(`${handle} My thought: `)

export function commentLinks(path: string): CommentLink[] {
  const url = `${SITE_URL}${path}`
  const h = socialHandles()
  const links: CommentLink[] = []
  if (h.bluesky) links.push({ network: "Bluesky", href: `https://bsky.app/intent/compose?text=${draft(h.bluesky, url)}` })
  if (h.substack) {
    links.push({
      network: "Substack",
      href: `https://substack.com/home?action=compose&message=${substackDraft(h.substack)}&restackUrl=${encodeURIComponent(url)}`,
    })
  }
  if (h.mastodon) links.push({ network: "Mastodon", href: `https://share.joinmastodon.org/#text=${draft(h.mastodon, url)}` })
  if (h.x) links.push({ network: "X", href: `https://x.com/intent/tweet?text=${draft(h.x, url)}` })
  return links
}
