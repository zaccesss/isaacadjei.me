import { describe, expect, it } from "vitest"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import FramePlayer, { nextIndex, previewMode, shouldTick, startsPlaying } from "@/components/projects/zacess/FramePlayer"
import ThemeSwitcher, { shortName, statusText, themeById, tokenStyle } from "@/components/projects/zacess/ThemeSwitcher"
import { GAME_CLIPS, GAMES_STILL, SCENE_CLIPS } from "@/data/projects/zacess/previews"
import { ZACESS_THEMES } from "@/data/projects/zacess/themes-preview"

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
const ratio = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p)
  return (x + 0.05) / (y + 0.05)
}

describe("frame player", () => {
  it("starts paused under reduced motion and playing otherwise", () => {
    expect(startsPlaying(true)).toBe(false)
    expect(startsPlaying(false)).toBe(true)
  })

  it("only ticks while playing, on screen and loaded", () => {
    expect(shouldTick({ playing: true, visible: true, loaded: true })).toBe(true)
    expect(shouldTick({ playing: false, visible: true, loaded: true })).toBe(false)
    expect(shouldTick({ playing: true, visible: false, loaded: true })).toBe(false)
    expect(shouldTick({ playing: true, visible: true, loaded: false })).toBe(false)
  })

  it("wraps round to the first frame or clip", () => {
    expect(nextIndex(0, 3)).toBe(1)
    expect(nextIndex(2, 3)).toBe(0)
    expect(nextIndex(0, 0)).toBe(0)
  })

  it("renders paused on the server with visible controls and a text description", () => {
    const html = renderToStaticMarkup(createElement(FramePlayer, { clips: SCENE_CLIPS, label: "Zacess Scenes preview", nextText: "Next scene" }))
    expect(html).toContain(">Play<")
    expect(html).toContain("Next scene")
    expect(html).toContain(SCENE_CLIPS[0].description)
    expect(html).toContain('role="img"')
  })

  it("shows the games still until frames are added, then plays them", () => {
    expect(previewMode(GAME_CLIPS)).toBe(GAME_CLIPS.length ? "frames" : "still")
    const still = renderToStaticMarkup(createElement(FramePlayer, { clips: [], still: GAMES_STILL, label: "Zacess Games preview", nextText: "Next game" }))
    expect(still).toContain("<img")
    expect(still).not.toContain("<canvas")
    const clips = [{ id: "stackline", label: "Stackline", description: "Two wells of circuit parts", src: "/frames/zacess/games/stackline.json" }]
    const playing = renderToStaticMarkup(createElement(FramePlayer, { clips, still: GAMES_STILL, label: "Zacess Games preview", nextText: "Next game" }))
    expect(playing).toContain("<canvas")
    expect(playing).not.toContain("<img")
  })

  it("points every scene and game clip at a frame file in public", async () => {
    const { existsSync } = await import("node:fs")
    for (const c of [...SCENE_CLIPS, ...GAME_CLIPS]) expect(existsSync(`public${c.src}`)).toBe(true)
  })

  it("plays the games recordings rather than the still", () => {
    expect(previewMode(GAME_CLIPS)).toBe("frames")
    expect(new Set(GAME_CLIPS.map((c) => c.id)).size).toBe(GAME_CLIPS.length)
  })
})

describe("theme switcher", () => {
  it("offers all eight themes with Deep Contrast Dark pressed by default", () => {
    const html = renderToStaticMarkup(createElement(ThemeSwitcher))
    expect(ZACESS_THEMES.themes).toHaveLength(8)
    expect(html.match(/aria-pressed="/g)).toHaveLength(8)
    expect(html.match(/aria-pressed="true"/g)).toHaveLength(1)
    expect(html).toContain("Showing Zacess Deep Contrast Dark")
    for (const t of ZACESS_THEMES.themes) expect(html).toContain(`>${shortName(t.name)}</button>`)
  })

  it("names the current theme in text and recolours the code", () => {
    const html = renderToStaticMarkup(createElement(ThemeSwitcher, { initial: "cream" }))
    expect(html).toContain(statusText(themeById("cream")))
    expect(html).toContain(`background:${themeById("cream").ui.background}`)
    expect(tokenStyle(themeById("light"), "keyword")).toMatchObject({ color: "#59029f", fontWeight: 700 })
  })

  it("keeps every code colour at 7 to 1 on its background in every theme", () => {
    for (const t of ZACESS_THEMES.themes) {
      for (const line of ZACESS_THEMES.sample) {
        for (const [token] of line.tokens) {
          const colour = tokenStyle(t, token).color as string
          expect(ratio(colour, t.ui.background), `${t.id} ${token}`).toBeGreaterThanOrEqual(7)
        }
      }
    }
  })
})
