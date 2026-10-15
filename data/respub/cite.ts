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

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const IEEE_MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "Jun.", "Jul.", "Aug.", "Sep.", "Oct.", "Nov.", "Dec."]
const MLA_MONTHS = ["Jan.", "Feb.", "Mar.", "Apr.", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."]

const typeDescription: Record<Publication["type"], string> = {
  "technical-note": "Technical note",
  conference: "Conference paper",
  journal: "Journal article",
  preprint: "Preprint",
}

const doiUrl = (pub: Publication) => `https://doi.org/${pub.doi}`
const nameParts = (name: string) => {
  const parts = name.trim().split(/\s+/)
  const last = parts.pop() ?? ""
  return { first: parts, last }
}
const initialsOf = (first: string[]) => first.map((p) => `${p[0]}.`).join(" ")

function joinNames(names: string[], and = "and"): string {
  if (names.length <= 1) return names[0] ?? ""
  return `${names.slice(0, -1).join(", ")} ${and} ${names[names.length - 1]}`
}

export function apaCitation(pub: Publication): string {
  return `${apaAuthors(pub.authors)} (${pub.year}). ${pub.title} [${typeDescription[pub.type]}]. ${pub.venue}. ${doiUrl(pub)}`
}

export function harvardCitation(pub: Publication): string {
  const authors = joinNames(pub.authors.map((n) => `${nameParts(n).last}, ${initialsOf(nameParts(n).first)}`))
  return `${authors} (${pub.year}) ${pub.title}. ${pub.venue}. Available at: ${doiUrl(pub)}`
}

export function ieeeCitation(pub: Publication): string {
  const authors = joinNames(pub.authors.map((n) => `${initialsOf(nameParts(n).first)} ${nameParts(n).last}`))
  const when = pub.month ? `${IEEE_MONTHS[pub.month - 1]} ${pub.year}` : String(pub.year)
  return `${authors}, "${pub.title}," ${pub.venue}, ${when}, doi: ${pub.doi}.`
}

const AND = "and"
export function mlaCitation(pub: Publication): string {
  const [first, ...rest] = pub.authors
  const lead = `${nameParts(first).last}, ${nameParts(first).first.join(" ")}`
  const authors = rest.length === 0 ? lead : rest.length === 1 ? `${lead}, ${AND} ${rest[0]}` : `${lead}, et al`
  const when = pub.month
    ? `${pub.day ? `${pub.day} ` : ""}${MLA_MONTHS[pub.month - 1]} ${pub.year}`
    : String(pub.year)
  return `${authors}. "${pub.title}." ${pub.venue}, ${when}, ${doiUrl(pub)}.`
}

export function chicagoCitation(pub: Publication): string {
  const [first, ...rest] = pub.authors
  const lead = `${nameParts(first).last}, ${nameParts(first).first.join(" ")}`
  const authors = rest.length === 0 ? lead : joinNames([lead, ...rest])
  const when = pub.month
    ? `${MONTHS[pub.month - 1]}${pub.day ? ` ${pub.day},` : ""} ${pub.year}`
    : String(pub.year)
  return `${authors}. "${pub.title}." ${pub.venue}, ${when}. ${doiUrl(pub)}.`
}

export function bibtexCitation(pub: Publication): string {
  const key = `${pub.authors[0].split(/\s+/).pop()?.toLowerCase()}${pub.year}${pub.id.replace(/-/g, "")}`
  const month = pub.month ? `\n  month     = {${MONTHS[pub.month - 1].slice(0, 3).toLowerCase()}},` : ""
  return `@misc{${key},
  author    = {${pub.authors.join(" and ")}},
  title     = {${pub.title}},
  year      = {${pub.year}},${month}
  publisher = {${pub.venue}},
  note      = {${typeDescription[pub.type]}},
  doi       = {${pub.doi}},
  url       = {${doiUrl(pub)}}
}`
}

export function risCitation(pub: Publication): string {
  const pad = (n: number) => String(n).padStart(2, "0")
  const date = pub.month ? `${pub.year}/${pad(pub.month)}/${pub.day ? pad(pub.day) : ""}` : `${pub.year}///`
  const type = pub.type === "journal" ? "JOUR" : pub.type === "conference" ? "CPAPER" : "RPRT"
  return [
    `TY  - ${type}`,
    ...pub.authors.map((n) => `AU  - ${nameParts(n).last}, ${nameParts(n).first.join(" ")}`),
    `TI  - ${pub.title}`,
    `PY  - ${pub.year}`,
    `DA  - ${date}`,
    `PB  - ${pub.venue}`,
    `DO  - ${pub.doi}`,
    `UR  - ${doiUrl(pub)}`,
    ...(pub.keywords ?? []).map((k) => `KW  - ${k}`),
    "ER  - ",
  ].join("\n")
}

export type CitationStyle = { id: string; label: string; text: string; code: boolean }

export function citationStyles(pub: Publication): CitationStyle[] {
  return [
    { id: "apa", label: "APA 7", text: apaCitation(pub), code: false },
    { id: "harvard", label: "Harvard", text: harvardCitation(pub), code: false },
    { id: "ieee", label: "IEEE", text: ieeeCitation(pub), code: false },
    { id: "mla", label: "MLA 9", text: mlaCitation(pub), code: false },
    { id: "chicago", label: "Chicago", text: chicagoCitation(pub), code: false },
    { id: "bibtex", label: "BibTeX", text: bibtexCitation(pub), code: true },
    { id: "ris", label: "RIS (EndNote, Zotero, Mendeley)", text: risCitation(pub), code: true },
  ]
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
