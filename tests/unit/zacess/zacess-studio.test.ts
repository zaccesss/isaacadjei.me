import { describe, expect, it } from "vitest"
import { existsSync } from "node:fs"
import { join } from "node:path"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import ZacessStudio, { frameSources, needsLine, tomlTokens, words } from "@/components/projects/zacess/Studio"
import manifest from "@/data/projects/zacess/studio-manifest.json"
import { ZACESS_THEMES } from "@/data/projects/zacess/themes-preview"

describe("studio sources", () => {
  it("asks the bucket for a theme it holds, then the release copy in public", () => {
    const theme = Object.keys(manifest.available.scenes)[0]
    const id = (manifest.available.scenes as Record<string, string[]>)[theme]?.find((s) => manifest.local.scenes.includes(s))
    if (!id) return
    const got = frameSources("scenes", id, theme, "https://media.zacess.com")
    expect(got[0]).toEqual({ url: `https://media.zacess.com/scenes/${theme}/${id}.json`, theme })
    expect(got.at(-1)).toEqual({ url: `/frames/zacess/scenes/${id}.json`, theme: manifest.fallbackTheme })
  })

  it("falls back to the release copy in its own theme when the bucket lacks the theme", () => {
    const id = manifest.local.games[0]
    const got = frameSources("games", id, "no-such-theme", "https://media.zacess.com")
    expect(got).toEqual([{ url: `/frames/zacess/games/${id}.json`, theme: manifest.fallbackTheme }])
  })

  it("reads my scenes from the my-scenes prefix and never from public", () => {
    const theme = Object.keys(manifest.available.myScenes)[0]
    if (!theme) return
    const id = (manifest.available.myScenes as Record<string, string[]>)[theme][0]
    expect(frameSources("myScenes", id, theme, "/zacess-media")).toEqual([{ url: `/zacess-media/my-scenes/${theme}/${id}.json`, theme }])
    expect(frameSources("myScenes", id, "no-such-theme", "/zacess-media")).toEqual([])
  })

  it("keeps a local copy of every code sample and profile the manifest lists", () => {
    for (const theme of manifest.local.code) {
      for (const lang of manifest.catalogue.languages) {
        expect(existsSync(join(process.cwd(), "public/frames/zacess/code", theme, `${lang.id}.json`)), `${theme}/${lang.id}`).toBe(true)
      }
    }
    for (const id of manifest.local.profile) expect(existsSync(join(process.cwd(), "public/frames/zacess/profile", `${id}.json`))).toBe(true)
  })
})

describe("studio text", () => {
  it("colours a TOML line by part, keeping numbers inside strings as string", () => {
    expect(tomlTokens('# a comment')).toEqual([{ text: "# a comment", kind: "comment" }])
    expect(tomlTokens("[needs.font]")).toEqual([{ text: "[needs.font]", kind: "header" }])
    const kinds = tomlTokens('name = "Warm 4.5"').map((t) => t.kind)
    expect(kinds).toEqual(["plain", "key", "plain", "string"])
    expect(tomlTokens("size_pt = 14").at(-1)).toEqual({ text: "14", kind: "number" })
    expect(tomlTokens("reduce_motion = true").at(-1)).toEqual({ text: "true", kind: "bool" })
  })

  it("lists needs with no comma before the last and", () => {
    const line = needsLine({ needs: { contrast: { text: 7 }, font: { family: "Atkinson Hyperlegible Mono", size_pt: 14 }, reduce_motion: true } })
    expect(line).toBe("Needs: text contrast 7:1 or more, Atkinson Hyperlegible Mono at 14 point and reduced motion.")
    expect(line).not.toMatch(/, and /)
  })

  it("turns an id into a label", () => {
    expect(words("koi-pond")).toBe("Koi pond")
  })
})

describe("studio markup", () => {
  const html = renderToStaticMarkup(createElement(ZacessStudio))

  it("offers the four modes as radios and every theme and scene in labelled pickers", () => {
    for (const m of ["scenes", "games", "code", "profile"]) expect(html).toMatch(new RegExp(`name="zacess-studio-mode"[^>]*value="${m}"`))
    expect(html.match(/type="radio"/g)).toHaveLength(4)
    for (const t of ZACESS_THEMES.themes) expect(html).toContain(`<option value="${t.id}"`)
    for (const s of manifest.catalogue.scenes) expect(html).toContain(`<option value="${s.id}"`)
    for (const s of manifest.catalogue.myScenes) expect(html).toContain(`<option value="my:${s.id}"`)
    for (const g of ["My scenes", "Original scenes", "Pass scenes", "Fail scenes"]) expect(html).toContain(`<optgroup label="${g}">`)
  })

  it("names the mode group with a legend and each picker with a label", () => {
    expect(html).toContain('<legend class="mb-2 text-sm font-semibold">Show</legend>')
    expect(html.match(/<label for="[^"]+-theme"[^>]*>Theme<\/label>/)).not.toBeNull()
    expect(html).toMatch(/<label for="[^"]+-item"[^>]*>Scene /)
    expect(html).toContain(`of ${manifest.catalogue.scenes.length + manifest.catalogue.myScenes.length})`)
  })
})

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

describe("studio themes", () => {
  it("keeps every code colour at 7 to 1 on its background and 4.5 to 1 in the Warm pair", () => {
    expect(ZACESS_THEMES.themes).toHaveLength(10)
    for (const t of ZACESS_THEMES.themes) {
      const floor = t.id.startsWith("warm-") ? 4.5 : 7
      for (const line of ZACESS_THEMES.sample) {
        for (const [token] of line.tokens) {
          const colour = t.syntax[token as keyof typeof t.syntax] ?? t.syntax.foreground
          expect(ratio(colour, t.ui.background), `${t.id} ${token}`).toBeGreaterThanOrEqual(floor)
        }
      }
    }
  })
})
