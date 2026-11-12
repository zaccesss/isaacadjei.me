export const REPLY_NETWORKS = ["bluesky", "substack", "mastodon", "x"] as const
export type ReplyNetwork = (typeof REPLY_NETWORKS)[number]

export const REPLY_NETWORK_LABELS: Record<ReplyNetwork, string> = { bluesky: "Bluesky", substack: "Substack", mastodon: "Mastodon", x: "X" }

const COMPOSE_PREFIXES: [ReplyNetwork, string][] = [
  ["bluesky", "https://bsky.app/intent/compose"],
  ["substack", "https://substack.com/home?action=compose"],
  ["mastodon", "https://share.joinmastodon.org/"],
  ["x", "https://x.com/intent/tweet"],
]

export function replyNetworkOf(href: string): ReplyNetwork | null {
  return COMPOSE_PREFIXES.find(([, prefix]) => href.startsWith(prefix))?.[0] ?? null
}

export const opensLink = (type: string, button: number): boolean => (type === "click" && button === 0) || (type === "auxclick" && button === 1)

export const isReplyNetwork = (value: unknown): value is ReplyNetwork => typeof value === "string" && (REPLY_NETWORKS as readonly string[]).includes(value)

export type ReplySection = "blog" | "til" | "notes" | "newsletter"

export function replyPage(path: string): { section: ReplySection; slug: string } | null {
  const m = /^\/(blog|til|notes|newsletter)\/([a-z0-9-]{1,120})\/?$/.exec(path)
  return m ? { section: m[1] as ReplySection, slug: m[2] } : null
}

const PREFIX = "replies:"

export const replyPressKey = (pageKey: string, network: ReplyNetwork) => `${PREFIX}${pageKey}:${network}`

export function parseReplyPressKey(key: string): { pageKey: string; network: ReplyNetwork } | null {
  if (!key.startsWith(PREFIX)) return null
  const rest = key.slice(PREFIX.length)
  const cut = rest.lastIndexOf(":")
  const network = rest.slice(cut + 1)
  if (cut < 1 || !isReplyNetwork(network)) return null
  return { pageKey: rest.slice(0, cut), network }
}

export const REPLY_PRESS_SCAN = `${PREFIX}*`

export const replySeenKey = (visitor: string, pageKey: string, network: ReplyNetwork) => `replyseen:${visitor}:${pageKey}:${network}`
