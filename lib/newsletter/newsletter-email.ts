import type { ContentBlock } from "@/data/blog"
import { SIGN_OFF_NAME, SIGNATURE, issueLabel, type Issue, type GatheredKind } from "@/data/newsletter"
import { diagramImagePath } from "@/lib/content/diagram-image"
import { isSyncedImage, mediaEmailSrc } from "@/lib/content/media"

export const SITE = "https://isaacadjei.me"
export const ASSETS = "https://raw.githubusercontent.com/zaccesss/isaacadjei.me/main/public"
const EMAIL_IMAGES_FROM_MEDIA = true

function emailImage(src: string): string | null {
  if (!src.startsWith("/")) return src
  if (!isSyncedImage(src)) return null
  return (EMAIL_IMAGES_FROM_MEDIA && mediaEmailSrc(src)) || `${ASSETS}${src}`
}

function figure(src: string, alt: string, caption?: string): string {
  return `<p style="margin:0 0 16px;"><img src="${esc(src)}" alt="${esc(alt)}" width="536" style="display:block;width:100%;max-width:536px;height:auto;border-radius:8px;border:1px solid ${C.border};">${
    caption ? `<span style="display:block;margin-top:6px;font-size:13px;color:${C.muted};text-align:center;">${esc(caption)}</span>` : ""
  }</p>`
}

export const C = {
  text: "#020817",
  muted: "#64748b",
  primary: "#2445a8",
  border: "#e2e8f0",
  surface: "#f8fafc",
  page: "#f1f5f9",
}
export const FONT = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

function absolute(url: string): string {
  return url.startsWith("/") ? `${SITE}${url}` : url
}

function inline(text: string): string {
  return text
    .split(/(\[[^\]]+\]\([^)]+\)|\*\*[^*]+\*\*)/g)
    .map((part) => {
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
      if (link) return `<a href="${esc(absolute(link[2]))}" style="color:${C.primary};text-decoration:underline;">${esc(link[1])}</a>`
      const bold = part.match(/^\*\*([^*]+)\*\*$/)
      if (bold) return `<strong style="color:${C.text};">${esc(bold[1])}</strong>`
      return esc(part)
    })
    .join("")
}

function plainInline(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, t, u) => `${t} (${absolute(u)})`).replace(/\*\*([^*]+)\*\*/g, "$1")
}

export const P = `margin:0 0 16px;font-size:16px;line-height:1.65;color:${C.text};`

function blockHtml(b: ContentBlock): string {
  switch (b.type) {
    case "p":
      return `<p style="${P}">${inline(b.text)}</p>`
    case "h2":
      return `<h2 style="margin:28px 0 12px;font-size:20px;line-height:1.3;color:${C.text};">${esc(b.text)}</h2>`
    case "h3":
      return `<h3 style="margin:24px 0 10px;font-size:17px;line-height:1.3;color:${C.text};">${esc(b.text)}</h3>`
    case "ul":
    case "ol": {
      const tag = b.type
      return `<${tag} style="margin:0 0 16px;padding-left:22px;font-size:16px;line-height:1.65;color:${C.text};">${b.items
        .map((i) => `<li style="margin:0 0 6px;">${inline(i)}</li>`)
        .join("")}</${tag}>`
    }
    case "quote":
      return `<blockquote style="margin:0 0 16px;padding:4px 0 4px 16px;border-left:3px solid ${C.primary};color:${C.muted};font-style:italic;font-size:16px;line-height:1.65;">${inline(b.text)}${
        b.source ? `<br><span style="font-style:normal;font-size:14px;">${esc(b.source)}</span>` : ""
      }</blockquote>`
    case "callout":
      return `<p style="${P}padding:12px 14px;background:${C.surface};border:1px solid ${C.border};border-radius:8px;">${inline(b.text)}</p>`
    case "image": {
      const src = emailImage(b.src)
      return src ? figure(src, b.alt, b.caption) : ""
    }
    case "diagram": {
      const src = emailImage(diagramImagePath(b.code))
      return src ? figure(src, b.caption ?? "Diagram", b.caption) : ""
    }
    case "divider":
      return `<hr style="border:none;border-top:1px solid ${C.border};margin:24px 0;">`
    default:
      return ""
  }
}

function blockText(b: ContentBlock): string {
  switch (b.type) {
    case "p":
    case "callout":
      return plainInline(b.text)
    case "h2":
    case "h3":
      return b.text.toUpperCase()
    case "ul":
    case "ol":
      return b.items.map((i) => `- ${plainInline(i)}`).join("\n")
    case "quote":
      return `"${plainInline(b.text)}"${b.source ? ` (${b.source})` : ""}`
    case "image":
    case "diagram":
      return b.caption ?? ""
    default:
      return ""
  }
}

const SECTION_TITLES: Record<GatheredKind, string> = { blog: "Blog posts", til: "Today I learned", note: "Notes" }
const ORDER: GatheredKind[] = ["blog", "til", "note"]

function excerpt(text: string, max = 180): string {
  const plain = text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*`]/g, "")
  return plain.length > max ? `${plain.slice(0, max).replace(/\s+\S*$/, "")}...` : plain
}

export function signatureHtml(): string {
  const links = SIGNATURE.links
    .map((l) => `<a href="${esc(l.href)}" style="color:#1a56db;text-decoration:underline;">${esc(l.label)}</a>`)
    .join(" &nbsp;|&nbsp; ")
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin:8px 0 0;font-family:Arial,Helvetica,sans-serif;">
<tr><td width="92" style="padding:0 16px 0 0;vertical-align:middle;width:76px;min-width:76px;"><img src="${SIGNATURE.emailLogo}" width="76" height="76" alt="Isaac Adjei logo" style="display:block;border:0;width:76px;height:76px;max-width:none;"></td>
<td style="padding:2px 0 2px 16px;border-left:3px solid #2445A8;vertical-align:middle;">
<div style="font-size:17px;font-weight:bold;color:#2445A8;line-height:22px;letter-spacing:0.3px;">${esc(SIGNATURE.name)} <span style="font-weight:normal;font-size:13px;">(${esc(SIGNATURE.pronouns)})</span></div>
${SIGNATURE.lines.map((l, i) => `<div style="font-size:${i === 0 ? 13 : 12}px;color:${i === 0 ? "#333333" : "#555555"};line-height:19px;">${esc(l)}</div>`).join("")}
</td></tr>
<tr><td colspan="2" style="padding-top:10px;">
<div style="font-size:12px;line-height:20px;">${links}</div>
<div style="font-size:13px;line-height:22px;padding-top:4px;"><img src="${SIGNATURE.booking.emailIcon}" width="20" height="20" alt="" style="vertical-align:middle;border:0;width:20px;height:20px;margin-right:6px;"><a href="${esc(SIGNATURE.booking.href)}" style="color:#2445A8;text-decoration:underline;font-weight:bold;">${esc(SIGNATURE.booking.label)}</a></div>
</td></tr></table>`
}

export function signatureText(): string {
  return `${SIGNATURE.name} (${SIGNATURE.pronouns})\n${SIGNATURE.lines.join("\n")}\n${SIGNATURE.links.map((l) => l.href).join(" | ")}\n${SIGNATURE.booking.label}: ${SIGNATURE.booking.href}`
}

export function issueSubject(issue: Issue): string {
  return `${issueLabel(issue)}: ${issue.title}`
}

export function issueEmailHtml(issue: Issue): string {
  const url = `${SITE}/newsletter/${issue.slug}`
  const sections = ORDER.map((kind) => {
    const items = issue.items.filter((i) => i.kind === kind)
    if (items.length === 0) return ""
    return `<h3 style="margin:28px 0 12px;font-size:15px;text-transform:uppercase;letter-spacing:0.06em;color:${C.muted};">${SECTION_TITLES[kind]} (${items.length})</h3>${items
      .map(
        (i) => `<div style="margin:0 0 12px;padding:14px 16px;border:1px solid ${C.border};border-radius:8px;background:${C.surface};">
  <a href="${esc(absolute(i.href))}" style="font-size:16px;font-weight:600;line-height:1.4;color:${C.primary};text-decoration:none;">${esc(i.title)}</a>
  <p style="margin:6px 0 0;font-size:14px;line-height:1.55;color:${C.muted};">${esc(excerpt(i.description))}</p>
</div>`,
      )
      .join("")}`
  }).join("")

  return `<!doctype html>
<html lang="en-GB">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(issueSubject(issue))}</title></head>
<body style="margin:0;padding:0;background:${C.page};font-family:${FONT};">
<div style="display:none;max-height:0;overflow:hidden;">${esc(issue.subtitle)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${C.border};border-radius:12px;">
<tr><td style="padding:24px 32px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="vertical-align:middle;"><a href="${SITE}"><img src="${ASSETS}/brand/png/script-mark-email.png" width="68" height="60" alt="Isaac Adjei" style="display:block;border:0;width:68px;height:60px;"></a></td>
    <td style="vertical-align:middle;text-align:right;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${C.primary};font-family:Menlo,Consolas,monospace;">Newsletter · ${issueLabel(issue)}</td>
  </tr></table>
</td></tr>
<tr><td style="padding:20px 32px 0;">
  <h1 style="margin:0 0 8px;font-size:26px;line-height:1.25;color:${C.text};">${esc(issue.title)}</h1>
  <p style="margin:0 0 20px;font-size:17px;line-height:1.55;color:${C.muted};">${esc(issue.subtitle)}</p>
  <hr style="border:none;border-top:1px solid ${C.border};margin:0 0 20px;">
  <p style="${P}">${esc(issue.greeting)}</p>
  ${issue.intro.map(blockHtml).join("\n  ")}
  ${issue.items.length > 0 ? `<h2 style="margin:32px 0 4px;font-size:20px;color:${C.text};">From the last two weeks</h2>${sections}` : ""}
  ${issue.outside && issue.outside.blocks.length > 0 ? `<h2 style="margin:32px 0 12px;font-size:20px;color:${C.text};">${esc(issue.outside.title)}</h2>${issue.outside.blocks.map(blockHtml).join("")}` : ""}
  ${issue.worth.length > 0 ? `<h2 style="margin:32px 0 4px;font-size:20px;color:${C.text};">Worth your time</h2>
  <p style="margin:0 0 12px;font-size:14px;color:${C.muted};">What I read, watched and listened to in the same two weeks.</p>
  ${issue.worth.map((w) => `<p style="margin:0 0 10px;font-size:15px;line-height:1.5;"><span style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${C.muted};font-family:Menlo,Consolas,monospace;">${esc(w.kind)}</span><br><a href="${esc(w.url)}" style="color:${C.primary};font-weight:600;text-decoration:none;">${esc(w.title)}</a> <span style="color:${C.muted};font-size:13px;">${esc(w.by)}</span></p>`).join("")}` : ""}
  ${issue.midweek.length > 0 ? `<h2 style="margin:32px 0 4px;font-size:20px;color:${C.text};">In case you missed it</h2>
  <p style="margin:0 0 12px;font-size:14px;color:${C.muted};">The Outside and Midweek issues from the same two weeks.</p>
  ${issue.midweek.map((m) => `<p style="margin:0 0 10px;font-size:15px;line-height:1.5;"><span style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${C.muted};font-family:Menlo,Consolas,monospace;">${esc(m.label)}</span><br><a href="${SITE}/newsletter/${esc(m.slug)}" style="color:${C.primary};font-weight:600;text-decoration:none;">${esc(m.title)}</a></p>`).join("")}` : ""}
  ${(issue.outro ?? []).map(blockHtml).join("\n  ")}
  <p style="${P}margin-top:24px;">${esc(issue.signOff)}<br>${esc(SIGN_OFF_NAME)}</p>
  ${signatureHtml()}
  <p style="margin:28px 0 8px;"><a href="${url}" style="display:inline-block;padding:12px 20px;background:${C.primary};color:#ffffff;border-radius:8px;font-weight:600;font-size:15px;text-decoration:none;">Read it on the site, react and comment</a></p>
</td></tr>
<tr><td style="padding:24px 32px 28px;">
  <hr style="border:none;border-top:1px solid ${C.border};margin:0 0 16px;">
  <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:${C.muted};">You get this because you subscribed at <a href="${SITE}/newsletter" style="color:${C.muted};">isaacadjei.me/newsletter</a>. Replies come straight to me.</p>
  <p style="margin:0;font-size:13px;line-height:1.6;color:${C.muted};"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:${C.muted};">Unsubscribe</a> · <a href="${SITE}/newsletter/feed.xml" style="color:${C.muted};">Follow by feed instead</a> · <a href="${SITE}/privacy" style="color:${C.muted};">Privacy</a></p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

export function issueEmailText(issue: Issue): string {
  const url = `${SITE}/newsletter/${issue.slug}`
  const items = ORDER.map((kind) => {
    const list = issue.items.filter((i) => i.kind === kind)
    if (list.length === 0) return ""
    return `${SECTION_TITLES[kind].toUpperCase()}\n${list.map((i) => `- ${i.title}\n  ${absolute(i.href)}`).join("\n")}`
  })
    .filter(Boolean)
    .join("\n\n")
  return [
    `ISAAC ADJEI · NEWSLETTER · ${issueLabel(issue).toUpperCase()}`,
    issue.title,
    issue.subtitle,
    issue.greeting,
    issue.intro.map(blockText).filter(Boolean).join("\n\n"),
    items ? `FROM THE LAST TWO WEEKS\n\n${items}` : "",
    issue.outside && issue.outside.blocks.length > 0
      ? `${issue.outside.title.toUpperCase()}\n\n${issue.outside.blocks.map(blockText).filter(Boolean).join("\n\n")}`
      : "",
    issue.worth.length > 0 ? `WORTH YOUR TIME\n\n${issue.worth.map((w) => `- ${w.kind}: ${w.title} (${w.by})\n  ${w.url}`).join("\n")}` : "",
    issue.midweek.length > 0 ? `IN CASE YOU MISSED IT\n\n${issue.midweek.map((m) => `- ${m.label}: ${m.title}\n  ${SITE}/newsletter/${m.slug}`).join("\n")}` : "",
    (issue.outro ?? []).map(blockText).filter(Boolean).join("\n\n"),
    `${issue.signOff}\n${SIGN_OFF_NAME}\n\n${signatureText()}`,
    `Read it on the site, react and comment: ${url}`,
    "Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}",
    `Privacy: ${SITE}/privacy`,
  ]
    .filter(Boolean)
    .join("\n\n")
}
