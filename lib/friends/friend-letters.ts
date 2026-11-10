import { addSubscriber, apiKey, signedParams } from "@/lib/newsletter/newsletter-subscribe"
import { letterEmailHtml, letterEmailText, type LetterEmail } from "@/lib/friends/letter-email"

const SITE = "https://isaacadjei.me"
export const LETTERS_FROM = "Isaac Adjei <newsletter@isaacadjei.me>"
export const LETTERS_REPLY_TO = "contact@isaacadjei.me"
export const LETTERS_PURPOSE = "letters"

export async function sendLettersConfirm(email: string, name: string, kind: "friend" | "penpal"): Promise<boolean> {
  const key = apiKey()
  const params = signedParams(email, LETTERS_PURPOSE)
  if (!key || !params) return false
  params.set("letters", "confirm")
  const letter: LetterEmail = {
    label: "Letters",
    title: "Confirm your letters",
    greeting: `Hi ${name},`,
    body: `${kind === "penpal" ? "Thanks for wanting to be pen pals." : "Thanks for getting in touch. I am glad you did."} I write a letter once a month about what I am building, learning and thinking about. Press the button to confirm this is your address and the next one will reach you. You can reply to any letter and it comes straight to me.\n\nThe link works for three days.`,
    button: { label: "Send me the letters", href: `${SITE}/friends?${params}` },
    footer: "one-off",
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: LETTERS_FROM, reply_to: LETTERS_REPLY_TO, to: [email], subject: "Confirm your letters", html: letterEmailHtml(letter), text: letterEmailText(letter) }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) console.error("[letters] confirmation email failed", res.status)
  return res.ok
}

export async function sendFriendWelcome(email: string, name: string, listed: boolean): Promise<boolean> {
  const key = apiKey()
  if (!key) return false
  const letter: LetterEmail = {
    label: "Friends",
    title: "We are friends now",
    greeting: `Hi ${name},`,
    body: `Thanks for getting in touch. I am glad you did.${listed ? " Your name and site are now on my friends page." : ""} Reply to this email any time and it comes straight to me.\n\nIf you would like my monthly letter as well, send a new request on the friends page and tick the letter box.`,
    button: listed ? { label: "See the friends page", href: `${SITE}/friends` } : undefined,
    footer: "one-off",
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: LETTERS_FROM, reply_to: LETTERS_REPLY_TO, to: [email], subject: "We are friends now", html: letterEmailHtml(letter), text: letterEmailText(letter) }),
    signal: AbortSignal.timeout(8000),
  })
  if (!res.ok) console.error("[friends] welcome email failed", res.status)
  return res.ok
}

export function addToLetters(email: string): Promise<boolean> {
  const segment = process.env.RESEND_LETTERS_SEGMENT_ID
  if (!segment) {
    console.error("[letters] RESEND_LETTERS_SEGMENT_ID is not set, so nobody can join the letters")
    return Promise.resolve(false)
  }
  return addSubscriber(email, segment)
}
