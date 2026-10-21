import { describe, expect, it } from "vitest"
import { dependencyName, publicCodingDay, languageName, machineName, publicEditorName, publicProjectName } from "@/lib/wakatime-editors"

describe("machineName", () => {
  it("folds the MacBook's old hostnames into one", () => {
    expect(machineName("ZACCESS-MBK.local")).toBe("ZACCESS-MBK")
    expect(machineName("Mac.Home")).toBe("ZACCESS-MBK")
    expect(machineName("Isaacs-MacBook-Air.local")).toBe("ZACCESS-MBK")
    expect(machineName("mac.campus.aston.ac.uk")).toBe("ZACCESS-MBK")
    expect(machineName("Mac.localdomain")).toBe("ZACCESS-MBK")
    expect(machineName("ZACCESS-MBK")).toBe("ZACCESS-MBK")
  })

  it("leaves other machines alone", () => {
    expect(machineName("ZACCESS-LNV")).toBe("ZACCESS-LNV")
    expect(machineName("ZACCESS-GPC")).toBe("ZACCESS-GPC")
  })
})

describe("languageName", () => {
  it("relabels Text as Plain text and keeps real languages", () => {
    expect(languageName("Text")).toBe("Plain text")
    expect(languageName("Python")).toBe("Python")
  })
})

describe("dependencyName", () => {
  it("counts next/link and next/server under next", () => {
    expect(dependencyName("link")).toBe("next")
    expect(dependencyName("server")).toBe("next")
  })

  it("drops a project's own index imports and keeps real libraries", () => {
    expect(dependencyName("index")).toBeNull()
    expect(dependencyName("subprocess")).toBe("subprocess")
  })
})

describe("publicCodingDay", () => {
  const day = {
    total_seconds: 4000,
    editors: [{ name: "Claude Code", total_seconds: 2000 }, { name: "VS Code", total_seconds: 1000 }, { name: "Discord", total_seconds: 1000 }],
    languages: [{ name: "Python", total_seconds: 4000 }],
    operating_systems: [{ name: "Mac", total_seconds: 3900 }, { name: "Unknown OS", total_seconds: 100 }],
    hours: Array.from({ length: 24 }, (_, h) => (h === 9 ? 4000 : 0)),
  }

  it("keeps AI time but takes chat apps out of the total and the editors", () => {
    const d = publicCodingDay(day)
    expect(d.total_seconds).toBe(3000)
    expect(d.editors.map((e) => e.name)).toEqual(["Claude Code", "VS Code"])
  })

  it("scales the languages and hours by the coding share and drops Unknown OS", () => {
    const d = publicCodingDay(day)
    expect(d.languages).toEqual([{ name: "Python", total_seconds: 3000 }])
    expect(d.hours?.[9]).toBe(3000)
    expect(d.operating_systems?.map((o) => o.name)).toEqual(["Mac"])
  })
})

describe("publicEditorName", () => {
  it("counts AI tools and the VS Code forks as VS Code and keeps every other name", () => {
    expect(publicEditorName("Claude Code")).toBe("VS Code")
    expect(publicEditorName("Cursor")).toBe("VS Code")
    expect(publicEditorName("Antigravity IDE")).toBe("VS Code")
    expect(publicEditorName("Obsidian")).toBe("Obsidian")
    expect(publicEditorName("Neovim")).toBe("Neovim")
  })
})

describe("publicProjectName", () => {
  it("names public repositories and hides the rest", () => {
    expect(publicProjectName("git-unlocked")).toBe("git-unlocked")
    expect(publicProjectName("some-private-repo")).toBeNull()
    expect(publicProjectName("Unknown Project")).toBeNull()
  })
})
