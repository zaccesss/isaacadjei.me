import { execFileSync, spawnSync } from "node:child_process"
import { describe, expect, it } from "vitest"

const hasPoppler = spawnSync("pdftotext", ["-v"]).error === undefined

describe.skipIf(!hasPoppler)("built CVs and cover letters", () => {
  it("parse cleanly and follow every rule in scripts/cv/check-cvs.mjs", () => {
    const out = execFileSync("node", ["scripts/cv/check-cvs.mjs"], { encoding: "utf8" })
    expect(out).toContain("every CV and cover letter passes")
  // the full check builds and reads every CV and letter, which takes over a minute on a busy machine
  }, 180_000)
})
