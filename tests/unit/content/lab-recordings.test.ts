import { describe, expect, it } from "vitest"
import manifest from "@/data/projects/zacess/studio-manifest.json"
import { ZACESS_THEMES as STUDIO_THEMES } from "@/data/projects/zacess/themes-preview"
import { ZACESS_THEMES } from "@/app/lab/_terminal/themes"
import { SCENES, candidates, findRecording, sceneListLines, zacessThemeFor } from "@/app/lab/_terminal/scenes"
import { GAMES, GAME_RECORDINGS } from "@/app/lab/_terminal/games"

describe("lab theme mapping", () => {
  it("plays a Zacess theme under its own id, which the studio also knows", () => {
    const studio = new Set<string>(STUDIO_THEMES.themes.map((t) => t.id))
    for (const t of ZACESS_THEMES) {
      expect(zacessThemeFor(t.id, false)).toBe(t.id)
      expect(studio.has(t.id), t.id).toBe(true)
    }
  })

  it("plays the site palette in the plain theme of the same appearance", () => {
    expect(zacessThemeFor("default", true)).toBe("dark")
    expect(zacessThemeFor("default", false)).toBe("light")
    expect(zacessThemeFor(null, true)).toBe("dark")
  })
})

describe("lab recording sources", () => {
  it("tries the chosen theme, then the fallback theme, then the release copy, never twice", () => {
    const id = manifest.local.scenes[0]
    if (!id) return
    const got = candidates({ source: "scenes", id }, "no-such-theme")
    expect(got.at(-1)).toEqual({ url: `/frames/zacess/scenes/${id}.json`, theme: manifest.fallbackTheme })
    expect(new Set(got.map((c) => c.url)).size).toBe(got.length)
    expect(got.every((c) => c.theme === manifest.fallbackTheme)).toBe(true)
  })
})

describe("lab scene list", () => {
  it("holds every manifest scene grouped general, pass then fail, with my scenes last", () => {
    const order = ["general", "pass", "fail", "mine"]
    expect(SCENES).toHaveLength(manifest.catalogue.scenes.length + manifest.catalogue.myScenes.length)
    const groups = SCENES.map((r) => order.indexOf(r.group))
    expect(groups).toEqual([...groups].sort((a, b) => a - b))
    for (const sc of manifest.catalogue.scenes) expect(SCENES.find((r) => r.id === sc.id)?.group).toBe(sc.kind)
    for (const sc of manifest.catalogue.myScenes) expect(SCENES.find((r) => r.id === sc.id)?.source).toBe("myScenes")
  })

  it("prints a heading for each group and a line for each scene", () => {
    const text = sceneListLines().map((l) => l.text)
    expect(text.filter((t) => t.startsWith("my scenes"))).toHaveLength(1)
    for (const r of SCENES) expect(text.some((t) => t.trimStart().startsWith(`${r.id} `)), r.id).toBe(true)
    for (const t of text) expect(t).not.toMatch(/, (and|or) /)
  })

  it("finds a scene by its id or the start of one", () => {
    const first = SCENES[0]
    expect(findRecording(SCENES, first.id)).toBe(0)
    expect(findRecording(SCENES, first.id.slice(0, 3))).toBe(SCENES.findIndex((r) => r.id.startsWith(first.id.slice(0, 3))))
    expect(findRecording(SCENES, "no-such-scene")).toBe(-1)
  })
})

describe("lab games", () => {
  it("keeps the three browser games and plays a recording of every other", () => {
    expect(GAMES.filter((g) => g.playable).map((g) => g.id).sort()).toEqual(["merge-gates", "termle", "trace"])
    expect(GAME_RECORDINGS.map((g) => g.id)).toEqual(GAMES.filter((g) => !g.playable).map((g) => g.id))
    expect(GAMES).toHaveLength(manifest.catalogue.games.length)
  })
})
