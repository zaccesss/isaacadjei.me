import { readFileSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"
import { CHART_DARK, CHART_LIGHT } from "@/lib/ui/chart-palette"

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

const SURFACES = { light: ["#ffffff"], dark: ["#121212", "#1a1a1a"] }

describe("chart palette", () => {
  it("every light colour clears 3 to 1 on the light page", () => {
    for (const [token, hex] of Object.entries(CHART_LIGHT)) {
      for (const s of SURFACES.light) expect(ratio(hex, s), `${token} on ${s}`).toBeGreaterThanOrEqual(3)
    }
  })

  it("every dark colour clears 3 to 1 on the dark page and card", () => {
    for (const [token, hex] of Object.entries(CHART_DARK)) {
      for (const s of SURFACES.dark) expect(ratio(hex, s), `${token} on ${s}`).toBeGreaterThanOrEqual(3)
    }
  })

  it("app/globals.css defines the same values in both themes", () => {
    const css = readFileSync(join(__dirname, "..", "..", "..", "app", "globals.css"), "utf8")
    const root = css.slice(css.indexOf(":root {"), css.indexOf(".dark {"))
    const dark = css.slice(css.indexOf(".dark {"))
    for (const [token, hex] of Object.entries(CHART_LIGHT)) expect(root).toContain(`--${token}: ${hex};`)
    for (const [token, hex] of Object.entries(CHART_DARK)) expect(dark).toContain(`--${token}: ${hex};`)
  })
})
