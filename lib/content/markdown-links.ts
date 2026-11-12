const STEP = String.raw`(?:\([^()]*\)|[^)])`
const STEP_NO_SPACE = String.raw`(?:\([^()\s]*\)|[^)\s])`

export const LINK_ADDRESS = `${STEP}+`

const LINK = String.raw`\[[^\]]+\]\(${STEP}+\)`
const ONE = new RegExp(String.raw`^\[([^\]]+)\]\((${STEP}+)\)$`)

export function splitLinks(text: string, ...alsoKeep: string[]): string[] {
  return text.split(new RegExp(`(${[LINK, ...alsoKeep].join("|")})`, "g"))
}

export function readLink(part: string): { text: string; href: string } | null {
  const match = part.match(ONE)
  return match ? { text: match[1], href: match[2] } : null
}

export function replaceLinks(text: string, to: (words: string, href: string) => string, noSpace = false): string {
  const step = noSpace ? STEP_NO_SPACE : STEP
  return text.replace(new RegExp(String.raw`\[([^\]]+)\]\((${step}+)\)`, "g"), (_, words: string, href: string) => to(words, href))
}

export function stripLinks(text: string): string {
  return text.replace(new RegExp(String.raw`\[([^\]]+)\]\(${STEP}*\)`, "g"), "$1")
}
