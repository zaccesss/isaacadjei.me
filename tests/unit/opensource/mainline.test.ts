import { describe, expect, it } from "vitest"
import { MAINLINE, commitSha, isInMaster, mainlineCommitUrl, needsMainlineCheck, shownCommit } from "@/lib/opensource/mainline"

const SHA = "cfbd01eddaf5bfdd4f53560013fe830571a186e9"
const inMaintainerTree = {
  url: `https://git.kernel.org/pub/scm/linux/kernel/git/brgl/linux.git/commit/?id=${SHA}`,
  tree: "the GPIO tree",
}
const inMainline = { url: mainlineCommitUrl(SHA), tree: MAINLINE }

describe("reading the hash from a commit address", () => {
  it("takes the full hash from a git.kernel.org address", () => {
    expect(commitSha(inMaintainerTree.url)).toBe(SHA)
    expect(commitSha(`https://git.kernel.org/x/linux.git/commit/?h=for-next&id=${SHA}`)).toBe(SHA)
  })

  it("gives nothing for a short hash, a longer run of hex or an address with no hash", () => {
    expect(commitSha("https://git.kernel.org/x/linux.git/commit/?id=cfbd01e")).toBeNull()
    expect(commitSha(`https://git.kernel.org/x/linux.git/commit/?id=${SHA}ab`)).toBeNull()
    expect(commitSha("https://example.org/some/commit")).toBeNull()
  })
})

describe("whether master holds the commit", () => {
  it("says yes when master is ahead of the commit or is the commit, with nothing behind", () => {
    expect(isInMaster({ status: "ahead", behind_by: 0 })).toBe(true)
    expect(isInMaster({ status: "identical", behind_by: 0 })).toBe(true)
  })

  it("says no when the histories have parted or master is behind the commit", () => {
    expect(isInMaster({ status: "diverged", behind_by: 3 })).toBe(false)
    expect(isInMaster({ status: "behind", behind_by: 1 })).toBe(false)
    expect(isInMaster({ status: "ahead", behind_by: 2 })).toBe(false)
  })

  it("says no when the answer is missing or incomplete, so a failed call changes nothing", () => {
    expect(isInMaster(null)).toBe(false)
    expect(isInMaster(undefined)).toBe(false)
    expect(isInMaster({})).toBe(false)
    expect(isInMaster({ status: "ahead" })).toBe(false)
    expect(isInMaster({ behind_by: 0 })).toBe(false)
  })
})

describe("the commit the page shows", () => {
  it("names mainline with the mainline address once master holds the commit", () => {
    expect(shownCommit(inMaintainerTree, { status: "ahead", behind_by: 0 })).toEqual(inMainline)
    expect(inMainline.url).toBe(`https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=${SHA}`)
  })

  it("keeps what was recorded by hand while the commit is not in master", () => {
    expect(shownCommit(inMaintainerTree, { status: "diverged", behind_by: 12 })).toEqual(inMaintainerTree)
  })

  it("keeps what was recorded by hand when the call failed or was rate limited", () => {
    expect(shownCommit(inMaintainerTree, null)).toEqual(inMaintainerTree)
    expect(shownCommit(inMaintainerTree, {})).toEqual(inMaintainerTree)
  })

  it("leaves an entry already recorded as mainline alone", () => {
    expect(shownCommit(inMainline, { status: "diverged", behind_by: 5 })).toEqual(inMainline)
    expect(needsMainlineCheck(inMainline)).toBe(false)
  })

  it("leaves an entry with no hash alone, since there is nothing to link to in mainline", () => {
    const noHash = { url: "https://example.org/patch", tree: "a maintainer's tree" }
    expect(needsMainlineCheck(noHash)).toBe(false)
    expect(shownCommit(noHash, { status: "ahead", behind_by: 0 })).toEqual(noHash)
  })

  it("asks for a check only for a hashed commit recorded outside mainline", () => {
    expect(needsMainlineCheck(inMaintainerTree)).toBe(true)
  })
})
