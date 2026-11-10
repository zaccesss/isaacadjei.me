import { describe, expect, it } from "vitest"
import manifest from "@/data/projects/zacess/studio-manifest.json"
import sounds from "@/data/projects/zacess/sounds.json"
import { SOUND_EFFECTS, SOUND_EVENTS, SOUND_SETS, soundPlan } from "@/components/projects/zacess/sound"

describe("the studio and Lab sound table", () => {
  it("plays the loop that suits a scene and the night bed for one it does not list", () => {
    expect(soundPlan("scenes", "harbour").parts).toEqual([{ path: "ambient/water", level: "ambient" }])
    expect(soundPlan("scenes", "my-own-lua-scene").parts).toEqual([{ path: "ambient/night", level: "ambient" }])
  })

  it("plays a game's music with its own loop", () => {
    expect(soundPlan("games", "heatsink").parts).toEqual([
      { path: "music/heatsink", level: "music" },
      { path: "ambient/hum", level: "ambient" },
    ])
  })

  it("names a known loop under every scene and game with a file for each", () => {
    const loops = new Set(sounds.ambient.map((a) => a.id))
    for (const loop of [...Object.values(sounds.scenes), ...Object.values(sounds.games)]) expect(loops.has(loop)).toBe(true)
    for (const g of manifest.catalogue.games) expect(Object.keys(sounds.games)).toContain(g.id)
  })

  it("lists the tone sets, events and effects the programs make", () => {
    expect(SOUND_SETS).toHaveLength(8)
    expect(SOUND_EVENTS).toEqual(expect.arrayContaining(["clean", "stopped"]))
    expect(SOUND_EVENTS).toHaveLength(9)
    expect(SOUND_EFFECTS).toContain("warn")
    expect(SOUND_EFFECTS).toHaveLength(7)
  })

  it("keeps the programs' balance between tones, loops, music and effects", () => {
    expect(sounds.levels).toEqual({ tone: 50, ambient: 20, music: 20, effect: 35 })
  })
})
