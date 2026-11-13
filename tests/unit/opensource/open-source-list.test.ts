import { describe, expect, it } from "vitest"
import type { PublicContribution } from "@/lib/opensource/open-source"
import {
  filterContributions,
  filterValue,
  groupByCategory,
  isFiltering,
  isMailedPatch,
  kindOptions,
  matchesQuery,
  repoPath,
  searchWords,
  stateOptions,
  toListed,
  toSearchHits,
} from "@/lib/opensource/open-source-list"

const row = (over: Partial<PublicContribution>): PublicContribution => ({
  project: "ardupilot",
  kind: "Pull request",
  number: 1,
  title: "A title",
  summary: "A summary",
  url: "https://github.com/ArduPilot/ardupilot/pull/1",
  status: "Merged",
  language: "Python",
  category: "Drones and robotics",
  date: "2026-11-01",
  relation: null,
  pinned: false,
  commit: null,
  ...over,
})

const PUBLIC: PublicContribution[] = [
  row({ number: 35148, title: "mavlink_parse: add a Requires column", summary: "Added a Requires column", status: "Open", date: "2026-11-13" }),
  row({
    project: "iTerm2-Color-Schemes",
    number: 913,
    title: "Add Zacess Warm Dark",
    summary: "Added a gentler pair of themes",
    url: "https://github.com/mbadolato/iTerm2-Color-Schemes/pull/913",
    category: "My own tools and themes",
    date: "2026-11-12",
  }),
  row({
    project: "pymavlink",
    number: 1328,
    title: "mavutil: add optional timeouts",
    summary: "Added optional timeouts to two waits",
    url: "https://github.com/ArduPilot/pymavlink/pull/1328",
    status: "Open",
    date: "2026-11-05",
  }),
  row({
    project: "Linux kernel (GPIO subsystem)",
    number: null,
    title: "gpio: mpfs: reject unsupported interrupt types",
    summary: "A fix to the PolarFire SoC GPIO driver",
    url: "https://lore.kernel.org/all/20261105-example@isaacadjei.me/",
    language: "C",
    category: "Linux kernel and embedded",
    date: "2026-11-05",
    pinned: true,
    commit: { url: "https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/commit/?id=abc", tree: "mainline" },
  }),
  row({
    project: "iTerm2-Color-Schemes",
    kind: "Issue",
    number: 879,
    title: "check-licenses fails on master",
    summary: "Reported the failing licence check",
    url: "https://github.com/mbadolato/iTerm2-Color-Schemes/issues/879",
    language: "YAML",
    category: "Infrastructure and CI",
    date: "2026-10-22",
    relation: { text: "Fixed by #880", url: "https://github.com/mbadolato/iTerm2-Color-Schemes/pull/880" },
  }),
  row({
    project: "JetBrains Marketplace",
    kind: "Listing",
    number: null,
    title: "Zacess Themes plugin",
    summary: "Published the themes as a plugin",
    url: "https://plugins.jetbrains.com/plugin/1",
    language: "Kotlin",
    category: "My own tools and themes",
    date: "2026-10-14",
  }),
]

const rows = toListed(PUBLIC)
const none = { search: "", projects: [], state: "", kind: "" }
const titles = (list: { title: string }[]) => list.map((c) => c.title)

describe("the rows handed to the browser", () => {
  it("carries only what the page prints, with the month in place of the full date", () => {
    expect(Object.keys(rows[0]).sort()).toEqual(
      ["category", "commit", "id", "kind", "language", "linkWord", "month", "number", "pinned", "project", "relation", "state", "summary", "title", "url"].sort(),
    )
    expect(rows[0].month).toBe("2026-11")
    expect(JSON.stringify(rows)).not.toContain("2026-11-13")
  })

  it("calls a mailed patch a patch that was applied and names its link the thread", () => {
    const patch = rows.find((c) => c.pinned)!
    expect(isMailedPatch(patch.url)).toBe(true)
    expect(patch).toMatchObject({ kind: "patch", state: "Applied", linkWord: "thread" })
  })

  it("keeps the words the page already used for the other kinds and states", () => {
    expect(rows.map((c) => `${c.state} ${c.kind}`)).toEqual([
      "Open pull request",
      "Merged pull request",
      "Open pull request",
      "Applied patch",
      "Merged issue",
      "Merged listing",
    ])
    expect(rows[0].linkWord).toBe("pull request")
  })

  it("gives every entry its own anchor, from the project and number where there is one", () => {
    expect(rows.map((c) => c.id)).toEqual([
      "ardupilot-35148",
      "iterm2-color-schemes-913",
      "pymavlink-1328",
      "linux-kernel-gpio-subsystem-gpio-mpfs-reject-unsupported-interrupt-types",
      "iterm2-color-schemes-879",
      "jetbrains-marketplace-zacess-themes-plugin",
    ])
  })

  it("keeps an older entry's anchor when a newer one would take the same name", () => {
    const twins = toListed([row({ number: null, title: "Same", date: "2026-11-02" }), row({ number: null, title: "Same", date: "2026-11-01" })])
    expect(twins.map((c) => c.id)).toEqual(["ardupilot-same-2", "ardupilot-same"])
  })
})

describe("searching the contributions", () => {
  it("finds a project whatever the capitals", () => {
    expect(titles(filterContributions(rows, { ...none, search: "ArduPilot" }))).toContain("mavlink_parse: add a Requires column")
  })

  it("finds work by the organisation in its link, which the project name alone leaves out", () => {
    expect(repoPath("https://github.com/ArduPilot/pymavlink/pull/1328")).toBe("ArduPilot/pymavlink")
    expect(repoPath("https://lore.kernel.org/all/x/")).toBeNull()
    expect(repoPath(null)).toBeNull()
    expect(titles(filterContributions(rows, { ...none, search: "ardupilot" }))).toEqual([
      "mavlink_parse: add a Requires column",
      "mavutil: add optional timeouts",
    ])
  })

  it("finds the kernel patch by the word kernel", () => {
    expect(titles(filterContributions(rows, { ...none, search: "kernel" }))).toEqual(["gpio: mpfs: reject unsupported interrupt types"])
  })

  it("wants every word typed, in any order", () => {
    expect(matchesQuery("linux kernel gpio driver", "gpio kernel")).toBe(true)
    expect(matchesQuery("linux kernel gpio driver", "gpio audio")).toBe(false)
    expect(matchesQuery("anything", "   ")).toBe(true)
  })

  it("looks through the summary, language, category, state, kind and number as well", () => {
    const words = searchWords(rows[4])
    for (const part of ["reported the failing licence check", "yaml", "infrastructure and ci", "merged", "issue", "#879"]) expect(words).toContain(part)
  })

  it("puts the closest project name first and leaves the rest newest first", () => {
    const more = toListed([
      row({ project: "pymavlink", number: 2, title: "newer, other project", summary: "mentions ardupilot", url: "https://github.com/x/pymavlink/pull/2", date: "2026-11-09" }),
      row({ project: "ardupilot_wiki", number: 3, title: "starts with it", url: "https://github.com/ArduPilot/ardupilot_wiki/pull/3", date: "2026-11-08" }),
      row({ project: "ardupilot", number: 4, title: "exact", date: "2026-11-07" }),
    ])
    expect(titles(filterContributions(more, { ...none, search: "ardupilot" }))).toEqual(["exact", "starts with it", "newer, other project"])
  })
})

describe("filtering the contributions", () => {
  it("counts a search or any one filter as filtering but an empty search as nothing", () => {
    expect(isFiltering(none)).toBe(false)
    expect(isFiltering({ ...none, search: "   " })).toBe(false)
    expect(isFiltering({ ...none, search: "gpio" })).toBe(true)
    expect(isFiltering({ ...none, projects: ["pymavlink"] })).toBe(true)
    expect(isFiltering({ ...none, state: "open" })).toBe(true)
    expect(isFiltering({ ...none, kind: "issue" })).toBe(true)
  })

  it("keeps any of the chosen projects", () => {
    expect(titles(filterContributions(rows, { ...none, projects: ["pymavlink", "JetBrains Marketplace"] }))).toEqual([
      "mavutil: add optional timeouts",
      "Zacess Themes plugin",
    ])
  })

  it("filters by the state the page prints, so Applied is its own choice", () => {
    expect(filterContributions(rows, { ...none, state: "open" })).toHaveLength(2)
    expect(titles(filterContributions(rows, { ...none, state: "applied" }))).toEqual(["gpio: mpfs: reject unsupported interrupt types"])
    expect(filterContributions(rows, { ...none, state: "merged" }).every((c) => c.state === "Merged")).toBe(true)
  })

  it("filters by kind using the address value", () => {
    expect(filterValue("pull request")).toBe("pull-request")
    expect(filterContributions(rows, { ...none, kind: "pull-request" })).toHaveLength(3)
    expect(titles(filterContributions(rows, { ...none, kind: "patch" }))).toEqual(["gpio: mpfs: reject unsupported interrupt types"])
    expect(titles(filterContributions(rows, { ...none, kind: "listing" }))).toEqual(["Zacess Themes plugin"])
  })

  it("combines a search with filters", () => {
    expect(titles(filterContributions(rows, { search: "zacess", projects: ["iTerm2-Color-Schemes"], state: "merged", kind: "pull-request" }))).toEqual(["Add Zacess Warm Dark"])
  })

  it("gives nothing for a value no row has", () => {
    expect(filterContributions(rows, { ...none, state: "closed" })).toEqual([])
  })

  it("offers only the states and kinds that are present, in a set order, with counts", () => {
    expect(stateOptions(rows)).toEqual([
      { value: "merged", label: "Merged", count: 3 },
      { value: "applied", label: "Applied", count: 1 },
      { value: "open", label: "Open", count: 2 },
    ])
    expect(kindOptions(rows)).toEqual([
      { value: "pull-request", label: "Pull request", count: 3 },
      { value: "issue", label: "Issue", count: 1 },
      { value: "patch", label: "Patch", count: 1 },
      { value: "listing", label: "Listing", count: 1 },
    ])
  })
})

describe("the page as it opens", () => {
  const groups = groupByCategory(rows)

  it("puts the pinned kernel patch first: its category, its project and its row", () => {
    expect(groups[0].category).toBe("Linux kernel and embedded")
    expect(groups[0].projects[0].items[0].pinned).toBe(true)
  })

  it("keeps the set category order after that, with my own tools last", () => {
    expect(groups.map((g) => g.category)).toEqual([
      "Linux kernel and embedded",
      "Drones and robotics",
      "Infrastructure and CI",
      "My own tools and themes",
    ])
  })

  it("leads a pinned row inside its project even when it is not the newest", () => {
    const mixed = toListed([
      row({ number: 9, title: "newer", date: "2026-11-10" }),
      row({ number: 8, title: "pinned", date: "2026-11-01", pinned: true }),
    ])
    expect(titles(groupByCategory(mixed)[0].projects[0].items)).toEqual(["pinned", "newer"])
  })

  it("puts the busiest project first inside a category, then by name", () => {
    const busy = toListed([
      row({ project: "b", number: 1 }),
      row({ project: "a", number: 2 }),
      row({ project: "c", number: 3 }),
      row({ project: "c", number: 4 }),
    ])
    expect(groupByCategory(busy)[0].projects.map((p) => p.project)).toEqual(["c", "a", "b"])
  })

  it("holds every row exactly once", () => {
    const all = groups.flatMap((g) => g.projects.flatMap((p) => p.items))
    expect(all.map((c) => c.id).sort()).toEqual(rows.map((c) => c.id).sort())
  })
})

describe("the entries the site search reads", () => {
  it("links each one to its anchor on the open source page", () => {
    const hits = toSearchHits(rows)
    expect(hits[0]).toEqual({
      href: "/open-source#ardupilot-35148",
      project: "ardupilot",
      title: "mavlink_parse: add a Requires column",
      summary: "Added a Requires column",
      month: "2026-11",
      words: searchWords(rows[0]),
    })
    expect(hits.filter((h) => matchesQuery(h.words, "kernel")).map((h) => h.href)).toEqual([
      "/open-source#linux-kernel-gpio-subsystem-gpio-mpfs-reject-unsupported-interrupt-types",
    ])
  })
})
