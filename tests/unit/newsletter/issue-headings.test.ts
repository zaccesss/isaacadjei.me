import { describe, expect, it, vi } from "vitest"
import { renderToStaticMarkup } from "react-dom/server"

vi.mock("next/navigation", () => ({
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({ replace: () => {}, push: () => {} }),
  usePathname: () => "/newsletter",
}))

import NewsletterPage from "@/app/newsletter/(list)/page"
import { fetchNewsletterIssues } from "@/lib/newsletter/newsletter"

function withoutTags(html: string): string {
  let text = html
  let before: string
  do {
    before = text
    text = text.replace(/<[^>]+>/g, "")
  } while (text !== before)
  return text
}

function headings(html: string): { level: number; text: string }[] {
  return [...html.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/g)].map((m) => ({
    level: Number(m[1]),
    text: withoutTags(m[2]).trim(),
  }))
}

describe("the newsletter list page", () => {
  it("makes every issue title a heading, as blog and note cards are", async () => {
    const issues = await fetchNewsletterIssues()
    expect(issues.length).toBeGreaterThan(0)
    const found = headings(renderToStaticMarkup(await NewsletterPage()))
    const titles = found.filter((h) => h.level === 2).map((h) => h.text)
    const shown = issues.filter((i) => titles.includes(i.title.replace(/&/g, "&amp;").replace(/'/g, "&#x27;").replace(/"/g, "&quot;")))
    expect(shown.length).toBeGreaterThan(0)
    expect(shown.length).toBe(Math.min(issues.length, titles.length))
  })

  it("starts at one h1 and never skips a level on the way down", async () => {
    const levels = headings(renderToStaticMarkup(await NewsletterPage())).map((h) => h.level)
    expect(levels[0]).toBe(1)
    expect(levels.filter((l) => l === 1)).toHaveLength(1)
    levels.forEach((level, i) => {
      if (i > 0) expect(level - levels[i - 1]).toBeLessThanOrEqual(1)
    })
  })

  it("keeps the title's look: the same classes and the wrapping a paragraph has", async () => {
    const html = renderToStaticMarkup(await NewsletterPage())
    expect(html).toContain('<h2 class="text-pretty text-sm font-semibold text-foreground group-hover:text-primary transition-colors leading-snug">')
  })
})
