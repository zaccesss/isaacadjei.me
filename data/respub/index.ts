export interface Publication {
  id: string
  title: string
  authors: string[]
  venue: string
  year: number
  month?: number
  day?: number
  doi: string
  zenodoUrl?: string
  scholarUrl?: string
  pdfUrl?: string
  type: "technical-note" | "conference" | "journal" | "preprint"
  abstract?: string
  keywords?: string[]
}

import _0 from "./items/git-unlocked-2026"

export const publications: Publication[] = [
  _0,
]
