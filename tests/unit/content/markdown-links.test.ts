import { isValidElement, type ReactElement } from "react"
import { describe, expect, it } from "vitest"
import { LINK_ADDRESS, readLink, replaceLinks, splitLinks, stripLinks } from "@/lib/content/markdown-links"
import { renderInline } from "@/components/shared/markdown/ContentBlocks"
import { tilItems } from "@/lib/content/feeds"
import { issueEmailHtml, issueEmailText } from "@/lib/newsletter/newsletter-email"
import { allIssues, type Issue } from "@/data/newsletter"
import type { TILEntry } from "@/data/til"

const BRACKETED = "https://example.org/wiki/Republic_Day_(Ghana)"
const LINE = `[Public holidays](${BRACKETED}) on the wiki`

describe("splitLinks and readLink", () => {
  it("keeps an ordinary link whole", () => {
    expect(splitLinks("Read [the post](/blog/a-post) today")).toEqual(["Read ", "[the post](/blog/a-post)", " today"])
    expect(readLink("[the post](/blog/a-post)")).toEqual({ text: "the post", href: "/blog/a-post" })
  })

  it("keeps the closing bracket of an address that has its own brackets", () => {
    expect(splitLinks(LINE)).toEqual(["", `[Public holidays](${BRACKETED})`, " on the wiki"])
    expect(readLink(`[Public holidays](${BRACKETED})`)).toEqual({ text: "Public holidays", href: BRACKETED })
  })

  it("reads brackets in the middle of an address and more than one pair in a row", () => {
    const href = "https://example.org/a_(b)/c_(d)#e"
    expect(readLink(`[x](${href})`)?.href).toBe(href)
  })

  it("does not swallow a bracket that closes the sentence around a link", () => {
    expect(splitLinks("(see [the post](/blog/a-post))")).toEqual(["(see ", "[the post](/blog/a-post)", ")"])
    expect(splitLinks(`(see [the wiki](${BRACKETED}))`)).toEqual(["(see ", `[the wiki](${BRACKETED})`, ")"])
  })

  it("reads two links on one line apart", () => {
    expect(splitLinks(`[a](/one) and [b](${BRACKETED}) and (c)`)).toEqual(["", "[a](/one)", " and ", `[b](${BRACKETED})`, " and (c)"])
  })

  it("still takes a bracket that opens without closing as part of the address, as before", () => {
    expect(readLink("[x](https://example.org/a(b)")?.href).toBe("https://example.org/a(b")
  })

  it("leaves text with no link alone", () => {
    expect(splitLinks("Plain text (with brackets) and [square ones]")).toEqual(["Plain text (with brackets) and [square ones]"])
    expect(readLink("Plain text")).toBeNull()
    expect(readLink(`before [x](${BRACKETED})`)).toBeNull()
  })

  it("keeps an extra pattern as its own part beside the links", () => {
    expect(splitLinks(`**Bold** then [x](${BRACKETED})`, String.raw`\*\*[^*]+\*\*`)).toEqual(["", "**Bold**", " then ", `[x](${BRACKETED})`, ""])
  })

  it("stays quick on a long run of brackets that never closes", () => {
    const started = Date.now()
    splitLinks(`[x](${"(a".repeat(5000)}`)
    splitLinks(`[x](${"(a)".repeat(5000)}`)
    expect(Date.now() - started).toBeLessThan(1000)
  })

  it("exposes the address pattern for a caller that builds its own", () => {
    expect(new RegExp(`^${LINK_ADDRESS}$`).test(BRACKETED)).toBe(true)
  })
})

describe("stripLinks and replaceLinks", () => {
  it("keeps the words and drops the whole address", () => {
    expect(stripLinks(LINE)).toBe("Public holidays on the wiki")
    expect(stripLinks("[a](/one), [b]() and [c](https://example.org)")).toBe("a, b and c")
  })

  it("hands the whole address to the callback", () => {
    expect(replaceLinks(LINE, (words, href) => `${words} <${href}>`)).toBe(`Public holidays <${BRACKETED}> on the wiki`)
  })

  it("never treats a dollar sign in the words as a replacement pattern", () => {
    expect(replaceLinks("[$1 and $&](/a)", (words, href) => `${words}|${href}`)).toBe("$1 and $&|/a")
  })

  it("can refuse white space inside an address", () => {
    expect(replaceLinks("[x](not an address) [y](/b_(c))", (w, h) => `${w}=${h}`, true)).toBe("[x](not an address) y=/b_(c)")
  })
})

describe("the renderers that read links", () => {
  it("renders a bracketed address as one link on a page, with no stray bracket after it", () => {
    const parts = renderInline(LINE) as unknown[]
    const link = parts.find((p) => isValidElement(p)) as ReactElement<{ href: string; children: string }>
    expect(link.props.href).toBe(BRACKETED)
    expect(link.props.children).toBe("Public holidays")
    expect(parts[parts.length - 1]).toBe(" on the wiki")
  })

  it("writes the whole address into a TIL's feed entry", () => {
    const til = { id: "a-til", title: "A TIL", date: "2026-11-02", body: LINE, category: "C", tags: [] } as unknown as TILEntry
    const [item] = tilItems([til])
    expect(item.contentHtml).toBe(`<p><a href="${BRACKETED}">Public holidays</a> on the wiki</p>`)
    expect(item.description).toBe("Public holidays on the wiki")
  })

  it("writes the whole address into the newsletter email, in both its HTML and its plain text", () => {
    const issue: Issue = { ...allIssues()[0], intro: [{ type: "p", text: LINE }], outro: [], items: [], worth: [], midweek: [], outside: undefined }
    expect(issueEmailHtml(issue)).toContain(`<a href="${BRACKETED}"`)
    expect(issueEmailHtml(issue)).toContain(">Public holidays</a> on the wiki")
    expect(issueEmailText(issue)).toContain(`Public holidays (${BRACKETED}) on the wiki`)
  })
})
