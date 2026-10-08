import type { Publication } from "./index"

function apaAuthors(authors: string[]): string {
  const initials = (name: string) => {
    const parts = name.trim().split(/\s+/)
    const last = parts.pop()
    return `${last}, ${parts.map((p) => `${p[0]}.`).join(" ")}`
  }
  const formatted = authors.map(initials)
  if (formatted.length === 1) return formatted[0]
  if (formatted.length === 2) return `${formatted[0]}, & ${formatted[1]}`
  return `${formatted.slice(0, -1).join(", ")}, & ${formatted[formatted.length - 1]}`
}

export function apaCitation(pub: Publication): string {
  return `${apaAuthors(pub.authors)} (${pub.year}). ${pub.title}. ${pub.venue}. https://doi.org/${pub.doi}`
}

export function bibtexCitation(pub: Publication): string {
  const key = `${pub.authors[0].split(/\s+/).pop()?.toLowerCase()}${pub.year}${pub.id.replace(/-/g, "")}`
  return `@misc{${key},
  author    = {${pub.authors.join(" and ")}},
  title     = {${pub.title}},
  year      = {${pub.year}},
  publisher = {${pub.venue}},
  doi       = {${pub.doi}},
  url       = {https://doi.org/${pub.doi}}
}`
}

export function highwireDate(pub: Publication): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  if (!pub.month) return String(pub.year)
  if (!pub.day) return `${pub.year}/${pad(pub.month)}`
  return `${pub.year}/${pad(pub.month)}/${pad(pub.day)}`
}

export function zenodoRecordId(pub: Publication): string | null {
  const match = pub.zenodoUrl?.match(/zenodo\.org\/records?\/(\d+)/)
  return match ? match[1] : null
}
