import { NextResponse } from "next/server"

export const runtime = "edge"

const ACCOUNT = {
  subject: "acct:isaacadjei@mastodon.social",
  profile: "https://mastodon.social/@isaacadjei",
  actor: "https://mastodon.social/ap/users/117412377205870888",
  server: "https://mastodon.social",
}

const HANDLES = new Set(["isaac", "zaccesss", "isaacadjei"])
const DOMAINS = new Set(["isaacadjei.me", "www.isaacadjei.me"])

export function GET(req: Request) {
  const resource = new URL(req.url).searchParams.get("resource")?.trim().toLowerCase() ?? ""
  const match = /^acct:@?([^@]+)@(.+)$/.exec(resource)
  if (!match || !HANDLES.has(match[1]) || !DOMAINS.has(match[2])) {
    return NextResponse.json({ error: "Unknown resource" }, { status: 404, headers: { "Access-Control-Allow-Origin": "*" } })
  }
  return NextResponse.json(
    {
      subject: ACCOUNT.subject,
      aliases: [ACCOUNT.profile, ACCOUNT.actor],
      links: [
        { rel: "http://webfinger.net/rel/profile-page", type: "text/html", href: ACCOUNT.profile },
        { rel: "self", type: "application/activity+json", href: ACCOUNT.actor },
        { rel: "http://ostatus.org/schema/1.0/subscribe", template: `${ACCOUNT.server}/authorize_interaction?uri={uri}` },
      ],
    },
    {
      headers: {
        "Content-Type": "application/jrd+json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    },
  )
}
