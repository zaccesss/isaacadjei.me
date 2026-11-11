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
  type: "technical-note" | "conference" | "journal" | "preprint" | "hardware-design" | "software"
  repoUrl?: string
  abstract?: string
  keywords?: string[]
}

import _0 from "./items/git-unlocked-2026"
import _1 from "./items/two-stage-audio-amplifier-2026"
import _2 from "./items/neopixel-led-cube-2026"

export const publications: Publication[] = [
  _1,
  _2,
  _0,
]
