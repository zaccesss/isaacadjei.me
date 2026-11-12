import { A, H2, LI, LIST, P, esc, figure } from "@/lib/newsletter/newsletter-email"

export type LetterBlock =
  | { type: "p"; lines: string[] }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "image"; alt: string; src: string }

const NAMED_URL = `https:\\/\\/(?:\\([^\\s<>"'()]*\\)|[^\\s<>"')])+`
const BRACKETED = `\\([^\\s<>"'()]*\\)`
const BARE_URL = `https:\\/\\/(?:${BRACKETED}|[^\\s<>"'()])*(?:${BRACKETED}|[^\\s<>"'.,;:!?()])`
const IMAGE_LINE = /^!\[([^\]]*)\]\(((?:\([^()]*\)|[^)])*)\)$/
const HTTPS_ONLY = new RegExp(`^${NAMED_URL}$`)
const BARE_ONLY = new RegExp(`^${BARE_URL}$`)
const INLINE = new RegExp(`(!?\\[[^\\]\\n]+\\]\\(${NAMED_URL}\\)|${BARE_URL})`, "g")
const NAMED = new RegExp(`^\\[([^\\]\\n]+)\\]\\((${NAMED_URL})\\)$`)

export function parseLetterBody(body: string): LetterBlock[] {
  const blocks: LetterBlock[] = []
  let para: string[] = []
  let items: string[] = []
  const flush = () => {
    if (para.length) blocks.push({ type: "p", lines: para })
    if (items.length) blocks.push({ type: "ul", items })
    para = []
    items = []
  }
  for (const raw of body.replace(/\r\n/g, "\n").split("\n")) {
    const line = raw.trim()
    if (!line) {
      flush()
      continue
    }
    const image = line.match(IMAGE_LINE)
    if (image && image[1].trim() && HTTPS_ONLY.test(image[2])) {
      flush()
      blocks.push({ type: "image", alt: image[1].trim(), src: image[2] })
    } else if (line.startsWith("## ") && line.slice(3).trim()) {
      flush()
      blocks.push({ type: "h2", text: line.slice(3).trim() })
    } else if (line.startsWith("- ") && line.slice(2).trim()) {
      if (para.length) flush()
      items.push(line.slice(2).trim())
    } else {
      if (items.length) flush()
      para.push(line)
    }
  }
  flush()
  return blocks
}

export function letterBodyProblem(body: string): string | null {
  const lines = body.replace(/\r\n/g, "\n").split("\n")
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    const image = line.match(IMAGE_LINE)
    if (image) {
      if (!image[1].trim()) return `Line ${i + 1}: the image has no alt text. Describe it between the square brackets, so it can be read by people who cannot see it`
      if (!HTTPS_ONLY.test(image[2])) return `Line ${i + 1}: the image address must start with https://`
    } else if (/!\[[^\]]*\]\((?:\([^()]*\)|[^)])*\)/.test(line)) {
      return `Line ${i + 1}: an image must be on a line of its own`
    }
  }
  return null
}

function inlineHtml(text: string): string {
  return text
    .split(INLINE)
    .map((part) => {
      const named = part.match(NAMED)
      if (named) return `<a href="${esc(named[2])}" style="${A}">${esc(named[1])}</a>`
      if (BARE_ONLY.test(part)) return `<a href="${esc(part)}" style="${A}">${esc(part)}</a>`
      return esc(part)
    })
    .join("")
}

function inlineText(text: string): string {
  return text
    .split(INLINE)
    .map((part) => {
      const named = part.match(NAMED)
      return named ? `${named[1]} (${named[2]})` : part
    })
    .join("")
}

export function letterBodyHtml(body: string): string {
  return parseLetterBody(body)
    .map((b) => {
      switch (b.type) {
        case "p":
          return `<p style="${P}">${b.lines.map(inlineHtml).join("<br>")}</p>`
        case "h2":
          return `<h2 style="${H2}">${esc(b.text)}</h2>`
        case "ul":
          return `<ul style="${LIST}">${b.items.map((i) => `<li style="${LI}">${inlineHtml(i)}</li>`).join("")}</ul>`
        case "image":
          return figure(b.src, b.alt)
      }
    })
    .join("\n  ")
}

export function letterBodyText(body: string): string {
  return parseLetterBody(body)
    .map((b) => {
      switch (b.type) {
        case "p":
          return b.lines.map(inlineText).join("\n")
        case "h2":
          return b.text.toUpperCase()
        case "ul":
          return b.items.map((i) => `- ${inlineText(i)}`).join("\n")
        case "image":
          return `[Image: ${b.alt}]`
      }
    })
    .join("\n\n")
}
