import sanitizeHtml from "sanitize-html"

const SITE_HOST = /^https?:\/\/(www\.)?isaacadjei\.me(\/|$)/i
const SHARE_LINK = /facebook\.com\/sharer|twitter\.com\/intent|x\.com\/intent|threads\.net\/intent|linkedin\.com\/sharing/i

function stripPlatformHeader(html: string, title?: string, subtitle?: string): string {
  let out = html
  for (const text of [title, subtitle]) {
    if (!text) continue
    const escaped = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    out = out.replace(new RegExp(`<h[1-3][^>]*>\\s*${escaped}\\s*</h[1-3]>`, "i"), "")
  }
  out = out.replace(/<p[^>]*>\s*<span[^>]*>\s*<a[^>]*\/authors\/[^>]*>[^<]*<\/a>\s*<\/span>\s*<br\s*\/?>\s*<span[^>]*>[^<]*<\/span>\s*<\/p>/i, "")
  return out
}

export function sanitizeIssueHtml(html: string, title?: string, subtitle?: string): string {
  return sanitizeHtml(stripPlatformHeader(html, title, subtitle), {
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
      (frame.tag === "img" && (!frame.attribs.src || frame.attribs.width === "1" || frame.attribs.height === "1")) ||
      (frame.tag === "img" && frame.attribs.alt === "Author") ||
      (frame.tag === "a" && SHARE_LINK.test(frame.attribs.href ?? "")),
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
