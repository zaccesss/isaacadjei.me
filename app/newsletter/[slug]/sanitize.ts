import sanitizeHtml from "sanitize-html"

const SITE_HOST = /^https?:\/\/(www\.)?isaacadjei\.me(\/|$)/i

export function sanitizeIssueHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6", "p", "br", "hr", "a", "img", "figure", "figcaption",
      "ul", "ol", "li", "blockquote", "pre", "code", "strong", "b", "em", "i", "u", "s", "sup", "sub",
      "table", "thead", "tbody", "tr", "th", "td", "div", "span",
    ],
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
      img: ["src", "alt", "width", "height", "loading"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowedSchemesByTag: { img: ["https"] },
    allowProtocolRelative: false,
    exclusiveFilter: (frame) =>
      frame.tag === "img" && (!frame.attribs.src || frame.attribs.width === "1" || frame.attribs.height === "1"),
    transformTags: {
      h1: "h2",
      a: (tagName, attribs) => {
        const { target: _target, rel: _rel, ...rest } = attribs
        const external = rest.href && !SITE_HOST.test(rest.href) && !rest.href.startsWith("mailto:")
        return {
          tagName,
          attribs: external ? { ...rest, target: "_blank", rel: "noopener noreferrer" } : rest,
        }
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy", alt: attribs.alt ?? "" } }),
    },
  })
}
