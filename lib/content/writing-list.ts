import { stripLinks } from "@/lib/content/markdown-links"

export type WritingItem = { kind: string; title: string; summary: string; date: string; href: string; pinned?: boolean }

export function firstSentence(body: string): string {
  const plain = stripLinks(body).replace(/[`*_#>]/g, "").replace(/\s+/g, " ").trim()
  const end = plain.search(/[.!?](\s|$)/)
  return end > 0 ? plain.slice(0, end + 1) : plain
}

export function pickWriting(items: WritingItem[], rows = 8, maxTils = 2): WritingItem[] {
  const out: WritingItem[] = items.filter((i) => i.pinned).slice(0, rows)
  if (out.length === rows) return out
  let tils = 0
  for (const item of items.filter((i) => !i.pinned).sort((a, b) => b.date.localeCompare(a.date))) {
    if (item.kind === "TIL" && tils >= maxTils) continue
    if (item.kind === "TIL") tils++
    out.push(item)
    if (out.length === rows) break
  }
  return out
}
