import { readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"
import { describe, expect, it } from "vitest"
import { ALLOW } from "./design-rules-allow"

const ROOT = join(__dirname, "..", "..", "..")

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) return name === "node_modules" ? [] : walk(p)
    return /\.(tsx|ts)$/.test(name) ? [p] : []
  })
}

const all = ["app", "components", "lib", "hooks"].flatMap((d) => walk(join(ROOT, d))).map((p) => relative(ROOT, p))
const isPrivate = (f: string) => /^(app\/dashboard|app\/api|components\/dashboard|components\/editor)\//.test(f)
const ui = all.filter((f) => f.endsWith(".tsx"))
const publicUi = ui.filter((f) => !isPrivate(f))
const chartCode = all.filter((f) => /chart|analytics|echarts|stats/i.test(f) && !f.startsWith("lib/ui/chart-palette"))

type Rule = { id: string; why: string; files: string[]; find: (line: string) => boolean }

const movesOnHover = (line: string) =>
  (line.match(/[\w:-]*hover:-?(?:scale|translate)[\w.[\]-]*/g) ?? []).some((token) => !token.includes("motion-safe:"))

const RULES: Rule[] = [
  { id: "small-text", why: "nothing under 13px", files: ui, find: (l) => /text-\[(?:[0-9]|1[0-2])px\]/.test(l) },
  { id: "chart-hex", why: "chart colours come from lib/ui/chart-palette.ts", files: chartCode, find: (l) => /["'`]#[0-9a-fA-F]{6}\b/.test(l) },
  { id: "scroll-reveal", why: "public content is visible at rest, never waiting for a scroll", files: publicUi, find: (l) => /\bwhileInView\b/.test(l) },
  { id: "transition-all", why: "name the properties that animate", files: ui, find: (l) => /\btransition-all\b/.test(l) },
  { id: "hover-motion", why: "hover movement needs motion-safe:", files: ui, find: movesOnHover },
  { id: "raw-enum", why: "status values go through the label formatter", files: all, find: (l) => /\.replace\(\s*(?:["']_["']|\/_\/g)\s*,\s*["'] ["']\s*\)/.test(l) },
  { id: "locale", why: "dates and numbers are formatted for en-GB", files: all, find: (l) => /\.toLocale(?:Date|Time)?String\(\s*\)/.test(l) },
  { id: "gradient", why: "public pages use flat colour", files: publicUi, find: (l) => /\bbg-(?:gradient|linear)-to-|linear-gradient\(/.test(l) },
  { id: "mono-eyebrow", why: "no tracked-caps monospace labels above headings", files: publicUi, find: (l) => /font-mono/.test(l) && /\buppercase\b/.test(l) && /tracking-widest/.test(l) },
  { id: "glued-arrow", why: "link text names the destination without an arrow character", files: publicUi, find: (l) => /→/.test(l) },
  { id: "looping", why: "no pings or marquees", files: ui, find: (l) => /\banimate-(?:ping|marquee)\b/.test(l) },
  { id: "raw-pie", why: "rings go through the shared PieChart, which lists every part beside the ring", files: ui.filter((f) => f !== "components/analytics/charts.tsx"), find: (l) => /<(?:Pie|RadialBarChart)\b/.test(l) },
]

describe("design rules", () => {
  for (const rule of RULES) {
    it(`${rule.id}: ${rule.why}`, () => {
      const hits: string[] = []
      for (const file of rule.files) {
        readFileSync(join(ROOT, file), "utf8").split("\n").forEach((line, i) => {
          if (!rule.find(line)) return
          if (ALLOW.some((a) => a.rule === rule.id && a.file === file)) return
          hits.push(`${file}:${i + 1}`)
        })
      }
      expect(hits.length, `${rule.id}: ${hits.length} found\n${hits.join("\n")}`).toBe(0)
    })
  }

  it("every allow-list entry still matches something and gives a reason", () => {
    for (const a of ALLOW) {
      expect(a.reason.length).toBeGreaterThan(10)
      expect(all).toContain(a.file)
    }
  })
})
