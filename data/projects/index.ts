import type { ContentBlock } from "@/data/blog"

export interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  technologies: string[]
  category: "embedded" | "web" | "software" | "hardware" | "cybersecurity" | "iot" | "academic" | "other"
  featured: boolean
  images: string[]
  video?: string
  website?: string
  videoCaption?: string
  github?: string
  demo?: string
  date: string
  highlights: string[]
  ongoing?: boolean
  cover?: string
  coverDark?: string
  order?: number
  status?: "live" | "in-progress" | "completed" | "archived" | "research"
  links?: { label: string; url: string }[]
  sections?: ContentBlock[]
  team?: { name: string; github: string; role: string }[]
  references?: { title: string; url: string; note?: string }[]
  getInvolved?: { discussions?: boolean; roadmap?: string }
}

import _0 from "./items/audio-amplifier"
import _1 from "./items/led-cube"
import _2 from "./items/astoncv"
import _3 from "./items/zacess-pages"
import _4 from "./items/cnc-control"
import _5 from "./items/goods-lift"
import _6 from "./items/cad-portfolio"
import _7 from "./items/git-unlocked"
import _8 from "./items/phaemos"
import _9 from "./items/avr-zac"
import _10 from "./items/dev-environment"
import _11 from "./items/vitafolio"
import _12 from "./items/melophos"
import _13 from "./items/lidarsat"
import _14 from "./items/isaacadjei-me"

const all: Project[] = [
  _0,
  _1,
  _2,
  _3,
  _4,
  _5,
  _6,
  _7,
  _8,
  _9,
  _10,
  _11,
  _12,
  _13,
  _14,
]

export const projects: Project[] = [...all].sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

export const CATEGORY_LABELS: Record<string, string> = {
  academic: "Academic",
  embedded: "Embedded",
  hardware: "Hardware",
  iot: "IoT",
  other: "Other",
  software: "Software",
  web: "Web",
  cybersecurity: "Cybersecurity",
}
