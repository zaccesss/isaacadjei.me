import { describe, expect, it } from "vitest"
import { dependencyName, languageName, machineName } from "@/lib/wakatime-editors"

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
