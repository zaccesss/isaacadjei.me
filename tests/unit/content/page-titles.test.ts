import { describe, expect, it } from "vitest"
import { readFileSync, readdirSync, statSync } from "node:fs"
import { join } from "node:path"

function sectionLayouts(dir = "app"): string[] {
  const out: string[] = []
  for (const name of readdirSync(dir)) {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) {
      if (path === join("app", "dashboard") || path === join("app", "api")) continue
      out.push(...sectionLayouts(path))
    } else if (name === "layout.tsx" && dir !== "app") {
      out.push(path)
    }
  }
  return out
}

describe("page titles", () => {
  it("no public section layout sets a plain string title", () => {
    const offenders = sectionLayouts().filter((file) => /^\s*title:\s*["'`]/m.test(readFileSync(file, "utf8")))
    expect(offenders).toEqual([])
  })

  it("the site title and share cards carry the name alone", () => {
    for (const file of ["app/layout.tsx", "app/opengraph-image.tsx", "app/twitter-image/route.tsx", "app/share/page.tsx"]) {
      expect(readFileSync(file, "utf8"), file).not.toMatch(/\bEECS\b|EE &(amp;)? CS/)
    }
  })
})
