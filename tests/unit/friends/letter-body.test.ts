import { describe, expect, it } from "vitest"
import { letterBodyHtml, letterBodyProblem, letterBodyText, parseLetterBody } from "@/lib/friends/letter-body"
import { A, H2, LI, LIST, P } from "@/lib/newsletter/newsletter-email"

describe("parseLetterBody", () => {
  it("makes a paragraph from each run of lines between blank lines", () => {
    expect(parseLetterBody("One\nstill one\n\n\nTwo")).toEqual([
      { type: "p", lines: ["One", "still one"] },
      { type: "p", lines: ["Two"] },
    ])
  })

  it("reads a heading, a list and an image between paragraphs", () => {
    expect(parseLetterBody("Hello\n## This month\n- one\n- two\nAfter\n![A desk](https://example.com/desk.jpg)")).toEqual([
      { type: "p", lines: ["Hello"] },
      { type: "h2", text: "This month" },
      { type: "ul", items: ["one", "two"] },
      { type: "p", lines: ["After"] },
      { type: "image", alt: "A desk", src: "https://example.com/desk.jpg" },
    ])
  })

  it("reads Windows line endings the same way", () => {
    expect(parseLetterBody("One\r\n\r\nTwo")).toHaveLength(2)
  })
})

describe("letterBodyHtml", () => {
  it("styles a paragraph as the newsletter does and keeps its line breaks", () => {
    expect(letterBodyHtml("One\ntwo")).toBe(`<p style="${P}">One<br>two</p>`)
  })

  it("renders a heading", () => {
    expect(letterBodyHtml("## What I built")).toBe(`<h2 style="${H2}">What I built</h2>`)
  })

  it("renders a bullet list", () => {
    expect(letterBodyHtml("- one\n- two")).toBe(`<ul style="${LIST}"><li style="${LI}">one</li><li style="${LI}">two</li></ul>`)
  })

  it("renders a named link", () => {
    expect(letterBodyHtml("Read [the post](https://example.com/a?b=1&c=2) today")).toBe(
      `<p style="${P}">Read <a href="https://example.com/a?b=1&amp;c=2" style="${A}">the post</a> today</p>`,
    )
  })

  it("keeps the closing bracket of a named address that has its own brackets", () => {
    expect(letterBodyHtml("Read [the page](https://example.org/wiki/Republic_Day_(Ghana)) today")).toBe(
      `<p style="${P}">Read <a href="https://example.org/wiki/Republic_Day_(Ghana)" style="${A}">the page</a> today</p>`,
    )
    expect(letterBodyText("Read [the page](https://example.org/wiki/Republic_Day_(Ghana)) today")).toBe(
      "Read the page (https://example.org/wiki/Republic_Day_(Ghana)) today",
    )
  })

  it("leaves a bracket that closes the sentence outside a named link", () => {
    expect(letterBodyHtml("(see [the page](https://example.org/a))")).toBe(
      `<p style="${P}">(see <a href="https://example.org/a" style="${A}">the page</a>)</p>`,
    )
  })

  it("reads an image whose address has its own brackets", () => {
    expect(parseLetterBody("![A flag](https://example.org/Flag_(1960).jpg)")).toEqual([
      { type: "image", alt: "A flag", src: "https://example.org/Flag_(1960).jpg" },
    ])
  })

  it("still turns a bare https address into a link and leaves the full stop outside it", () => {
    expect(letterBodyHtml("See https://example.com/page.")).toBe(
      `<p style="${P}">See <a href="https://example.com/page" style="${A}">https://example.com/page</a>.</p>`,
    )
  })

  it("keeps the closing bracket of a bare address that has its own brackets", () => {
    const address = "https://en.wikipedia.org/wiki/Republic_Day_(Ghana)"
    const link = `<a href="${address}" style="${A}">${address}</a>`
    expect(letterBodyHtml(`See ${address}`)).toBe(`<p style="${P}">See ${link}</p>`)
    expect(letterBodyHtml(`See ${address} today`)).toBe(`<p style="${P}">See ${link} today</p>`)
    expect(letterBodyText(`See ${address}`)).toBe(`See ${address}`)
  })

  it("leaves the punctuation after a bare bracketed address outside the link", () => {
    const address = "https://en.wikipedia.org/wiki/Republic_Day_(Ghana)"
    const link = `<a href="${address}" style="${A}">${address}</a>`
    expect(letterBodyHtml(`See ${address}.`)).toBe(`<p style="${P}">See ${link}.</p>`)
    expect(letterBodyHtml(`See ${address}, then reply`)).toBe(`<p style="${P}">See ${link}, then reply</p>`)
    expect(letterBodyHtml(`(see ${address})`)).toBe(`<p style="${P}">(see ${link})</p>`)
    expect(letterBodyHtml("(see https://example.com/page)")).toBe(
      `<p style="${P}">(see <a href="https://example.com/page" style="${A}">https://example.com/page</a>)</p>`,
    )
  })

  it("keeps brackets in the middle of a bare address", () => {
    const address = "https://example.org/wiki/Mercury_(planet)/History"
    expect(letterBodyHtml(`See ${address}.`)).toBe(`<p style="${P}">See <a href="${address}" style="${A}">${address}</a>.</p>`)
  })

  it("still links only https and escapes a bare bracketed address", () => {
    expect(letterBodyHtml("See http://example.org/wiki/A_(b)")).toBe(`<p style="${P}">See http://example.org/wiki/A_(b)</p>`)
    expect(letterBodyHtml("See javascript:alert(1)")).toBe(`<p style="${P}">See javascript:alert(1)</p>`)
    expect(letterBodyHtml("See https://example.org/a_(b&c)")).toBe(
      `<p style="${P}">See <a href="https://example.org/a_(b&amp;c)" style="${A}">https://example.org/a_(b&amp;c)</a></p>`,
    )
    const broken = letterBodyHtml(`See https://example.org/a_("onmouseover="x)`)
    expect(broken).not.toContain(`"onmouseover=`)
    expect(broken).toContain("&quot;onmouseover=&quot;x)")
    expect(letterBodyHtml("See https://example.org/a_(<b>)")).not.toContain("<b>")
  })

  it("links inside a list item", () => {
    expect(letterBodyHtml("- [one](https://example.com)")).toContain(`<li style="${LI}"><a href="https://example.com" style="${A}">one</a></li>`)
  })

  it("renders an image with its alt text and a width limit", () => {
    const html = letterBodyHtml("![A desk with two screens](https://example.com/desk.jpg)")
    expect(html).toContain('<img src="https://example.com/desk.jpg" alt="A desk with two screens"')
    expect(html).toContain("max-width:536px")
    expect(html).toContain("height:auto")
  })

  it("escapes everything, so no markup of the writer's passes through", () => {
    const html = letterBodyHtml('<script>alert("x")</script>\n## <b>bold</b>\n- <i>item</i> & more')
    expect(html).not.toMatch(/<script|<b>|<i>/i)
    expect(html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;")
    expect(html).toContain("&lt;b&gt;bold&lt;/b&gt;")
    expect(html).toContain("&lt;i&gt;item&lt;/i&gt; &amp; more")
  })

  it("escapes link text and alt text", () => {
    expect(letterBodyHtml("[<b>x</b>](https://example.com)")).toContain(">&lt;b&gt;x&lt;/b&gt;</a>")
    expect(letterBodyHtml('![a "quoted" <desk>](https://example.com/d.jpg)')).toContain('alt="a &quot;quoted&quot; &lt;desk&gt;"')
  })

  it("never lets an address break out of its attribute", () => {
    const html = letterBodyHtml('[x](https://example.com/"onmouseover="alert(1)) and https://example.com/"><img>')
    expect(html).not.toContain('"onmouseover=')
    expect(html).not.toContain("<img>")
  })

  it("only links https addresses", () => {
    for (const body of ["[x](http://example.com)", "[x](javascript:alert(1))", "[x](mailto:someone@example.com)", "http://example.com", "[x](/friends)"]) {
      expect(letterBodyHtml(body)).not.toContain("<a ")
    }
  })

  it("leaves an image that is not https or has no alt text as the text that was typed", () => {
    expect(letterBodyHtml("![A desk](http://example.com/desk.jpg)")).not.toContain("<img")
    expect(letterBodyHtml("![](https://example.com/desk.jpg)")).not.toContain("<img")
    expect(letterBodyHtml("Before ![A desk](https://example.com/desk.jpg) after")).not.toContain("<img")
  })
})

describe("letterBodyProblem", () => {
  it("accepts a body with every element", () => {
    expect(letterBodyProblem("Hello\n\n## News\n- one\n\n![A desk](https://example.com/desk.jpg)\n\n[link](https://example.com)")).toBeNull()
  })

  it("refuses an image with no alt text and says why", () => {
    expect(letterBodyProblem("Hello\n\n![](https://example.com/desk.jpg)")).toMatch(/^Line 3: the image has no alt text/)
    expect(letterBodyProblem("![   ](https://example.com/desk.jpg)")).toMatch(/no alt text/)
  })

  it("refuses an image that is not https", () => {
    expect(letterBodyProblem("![A desk](http://example.com/desk.jpg)")).toMatch(/must start with https/)
    expect(letterBodyProblem("![A desk](/images/desk.jpg)")).toMatch(/must start with https/)
  })

  it("refuses an image in the middle of a line", () => {
    expect(letterBodyProblem("Look ![A desk](https://example.com/desk.jpg) here")).toMatch(/line of its own/)
  })
})

describe("letterBodyText", () => {
  it("keeps a plain-text form of every element", () => {
    expect(letterBodyText("Hello [there](https://example.com)\n\n## News\n- one\n- two\n\n![A desk](https://example.com/desk.jpg)\n\nhttps://example.com/b")).toBe(
      "Hello there (https://example.com)\n\nNEWS\n\n- one\n- two\n\n[Image: A desk]\n\nhttps://example.com/b",
    )
  })
})
