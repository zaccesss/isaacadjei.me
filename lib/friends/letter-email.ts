import { ASSETS, C, FONT, P, SITE, esc, signatureHtml, signatureText } from "@/lib/newsletter/newsletter-email"
import { SIGN_OFF_NAME } from "@/data/newsletter"
import { letterBodyHtml, letterBodyText } from "@/lib/friends/letter-body"

export type LetterEmail = {
  label: string
  title: string
  greeting?: string
  body: string
  signOff?: string
  button?: { label: string; href: string }
  footer: "letter" | "one-off"
}

export function letterEmailHtml(l: LetterEmail): string {
  const body = letterBodyHtml(l.body)
  const footer = l.footer === "letter"
    ? `You get these letters because you asked to on <a href="${SITE}/friends" style="color:${C.muted};">isaacadjei.me/friends</a>. Replies come straight to me.</p>
  <p style="margin:0;font-size:13px;line-height:1.6;color:${C.muted};"><a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:${C.muted};">Unsubscribe</a> · <a href="${SITE}/privacy" style="color:${C.muted};">Privacy</a>`
    : `You got this because of a request on <a href="${SITE}/friends" style="color:${C.muted};">isaacadjei.me/friends</a>. If that was not you, ignore it and nothing happens.`
  return `<!doctype html>
<html lang="en-GB">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(l.title)}</title></head>
<body style="margin:0;padding:0;background:${C.page};font-family:${FONT};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border:1px solid ${C.border};border-radius:12px;">
<tr><td style="padding:24px 32px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td style="vertical-align:middle;"><a href="${SITE}"><img src="${ASSETS}/brand/png/script-mark-email.png" width="68" height="60" alt="Isaac Adjei" style="display:block;border:0;width:68px;height:60px;"></a></td>
    <td style="vertical-align:middle;text-align:right;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${C.primary};font-family:Menlo,Consolas,monospace;">${esc(l.label)}</td>
  </tr></table>
</td></tr>
<tr><td style="padding:20px 32px 0;">
  <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:${C.text};">${esc(l.title)}</h1>
  ${l.greeting ? `<p style="${P}">${esc(l.greeting)}</p>` : ""}
  ${body}
  ${l.button ? `<p style="margin:8px 0 20px;"><a href="${esc(l.button.href)}" style="display:inline-block;padding:12px 20px;background:${C.primary};color:#ffffff;border-radius:8px;font-weight:600;font-size:15px;text-decoration:none;">${esc(l.button.label)}</a></p>` : ""}
  <p style="${P}margin-top:24px;">${esc(l.signOff ?? "Speak soon,")}<br>${esc(SIGN_OFF_NAME)}</p>
  ${signatureHtml()}
</td></tr>
<tr><td style="padding:24px 32px 28px;">
  <hr style="border:none;border-top:1px solid ${C.border};margin:0 0 16px;">
  <p style="margin:0 0 6px;font-size:13px;line-height:1.6;color:${C.muted};">${footer}</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`
}

export function letterEmailText(l: LetterEmail): string {
  return [
    `ISAAC ADJEI · ${l.label.toUpperCase()}`,
    l.title,
    l.greeting ?? "",
    letterBodyText(l.body),
    l.button ? `${l.button.label}: ${l.button.href}` : "",
    `${l.signOff ?? "Speak soon,"}\n${SIGN_OFF_NAME}`,
    signatureText(),
    l.footer === "letter" ? "Unsubscribe: {{{RESEND_UNSUBSCRIBE_URL}}}" : "If this was not you, ignore it and nothing happens.",
  ].filter(Boolean).join("\n\n")
}
