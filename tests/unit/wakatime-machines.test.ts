import { describe, expect, it } from "vitest"
import { dependencyName, humanCodingDay, languageName, machineName, publicEditorName, publicProjectName } from "@/lib/wakatime-editors"

describe("machineName", () => {
  it("folds the MacBook's old hostnames into one", () => {
    expect(machineName("ZACCESS-MBK.local")).toBe("ZACCESS-MBK")
    expect(machineName("Mac.Home")).toBe("ZACCESS-MBK")
    expect(machineName("Isaacs-MacBook-Air.local")).toBe("ZACCESS-MBK")
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

describe("humanCodingDay", () => {
  const day = {
    total_seconds: 4000,
    editors: [{ name: "Claude Code", total_seconds: 3000 }, { name: "VS Code", total_seconds: 1000 }],
    languages: [{ name: "Python", total_seconds: 4000 }],
    hours: Array.from({ length: 24 }, (_, h) => (h === 9 ? 4000 : 0)),
  }

  it("takes the AI clients' time out of the total and the editors", () => {
    const human = humanCodingDay(day)
    expect(human.total_seconds).toBe(1000)
    expect(human.editors).toEqual([{ name: "VS Code", total_seconds: 1000 }])
  })

  it("scales the languages and hours by the human share", () => {
    const human = humanCodingDay(day)
    expect(human.languages).toEqual([{ name: "Python", total_seconds: 1000 }])
    expect(human.hours?.[9]).toBe(1000)
  })

  it("leaves a day with no AI clients untouched", () => {
    const plain = { total_seconds: 60, editors: [{ name: "Zed", total_seconds: 60 }] }
    expect(humanCodingDay(plain)).toBe(plain)
  })
})

describe("publicEditorName", () => {
  it("counts the VS Code forks as VS Code and keeps every other name", () => {
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
