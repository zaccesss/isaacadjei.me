import { describe, expect, it } from "vitest"
import { publicActivities } from "@/lib/lanyard-public"

describe("publicActivities", () => {
  it("drops Spotify, which has its own card", () => {
    expect(publicActivities([{ type: 2, name: "Spotify", details: "A song" }])).toEqual([])
  })

  it("drops AI tools", () => {
    expect(publicActivities([{ type: 0, name: "Claude" }, { type: 0, name: "ChatGPT" }])).toEqual([])
  })

  it("keeps a coding app's text when it names a public repository", () => {
    const a = { type: 0, name: "Visual Studio Code", details: "In git-unlocked", state: "Editing README.md" }
    expect(publicActivities([a])).toEqual([a])
  })

  it("hides the text for a private or AI workspace but keeps the app", () => {
    for (const details of ["In example-ops", "In .example-config", "In dotagents", "In example-portfolio"]) {
      const [a] = publicActivities([{ type: 0, name: "Code", details, state: "Editing x.ts", assets: { large_text: "x.ts", large_image: "img" } }])
      expect(a.details).toBe("Working on a private project")
      expect(a.state).toBeUndefined()
      expect(a.assets).toEqual({ large_image: "img", small_image: undefined })
    }
  })

  it("leaves games, films and the custom status alone", () => {
    const list = [{ type: 0, name: "Minecraft" }, { type: 3, name: "YouTube", details: "A video" }, { type: 4, name: "Custom Status", state: "hi" }]
    expect(publicActivities(list)).toEqual(list)
  })
})
