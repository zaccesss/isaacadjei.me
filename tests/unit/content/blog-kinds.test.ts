import { describe, expect, it } from "vitest"
import { posts } from "@/data/blog"
import { POST_TYPES, RENAMED_POST_TYPES, postTypeLabel } from "@/data/blog/meta"
import { withRenamedValues, type ListQuery } from "@/components/shared/lists/useListQuery"
import { computeContentStats } from "@/lib/content/content-stats-compute"
import { POST_TYPE_HUE } from "@/lib/content/feed-view"
import { postTypeName } from "@/lib/content/feeds"

const kinds = POST_TYPES.filter((t) => t.value !== "all")

describe("blog post kinds", () => {
  it("gives every post a kind that POST_TYPES lists", () => {
    const known = new Set<string>(kinds.map((t) => t.value))
    const unknown = posts.filter((p) => !known.has(p.type)).map((p) => `${p.slug}: ${p.type}`)
    expect(unknown).toEqual([])
  })

  it("has no post of the two kinds that shared a name with a section of the site", () => {
    const clashing = posts.filter((p) => ["notes", "research"].includes(p.type as string)).map((p) => p.slug)
    expect(clashing).toEqual([])
    expect(kinds.map((t) => t.value as string)).not.toContain("notes")
    expect(kinds.map((t) => t.value as string)).not.toContain("research")
  })

  it("lists each kind once, in the order the filter shows them", () => {
    expect(kinds.map((t) => t.label)).toEqual(["Blog", "Journal", "Explainer", "Report", "Article", "Resources"])
  })

  it("names an explainer in the feeds and gives it the colour research posts had", () => {
    expect(postTypeName("explainer")).toBe("Explainer")
    expect(POST_TYPE_HUE.explainer).toBe("emerald")
    for (const t of kinds) expect(POST_TYPE_HUE[t.value], t.value).toBeDefined()
  })

  it("names each kind by its label in the Stats chart, never the stored value", () => {
    const raw = posts.map((p) => ({ date: p.date, tags: p.tags, type: p.type, readingTime: 1 }))
    const names = computeContentStats(raw, [], []).postTypes.map((t) => t.name)
    const labels = new Set(kinds.map((t) => t.label))
    expect(names.filter((n) => !labels.has(n))).toEqual([])
    expect(names).toContain("Explainer")
    expect(postTypeLabel("explainer")).toBe("Explainer")
    expect(postTypeLabel("something-else")).toBe("something-else")
  })

  it("still has explainers and articles to show", () => {
    expect(posts.some((p) => p.type === "explainer")).toBe(true)
    expect(posts.some((p) => p.type === "article")).toBe(true)
  })
})

describe("an old kind in a list address", () => {
  const queryOf = (search: string): ListQuery => {
    const params = new URLSearchParams(search)
    return {
      search: "", setSearch: () => undefined, sort: "newest", page: 1, update: () => undefined, setPage: () => undefined, clearAll: () => undefined,
      get: (key) => params.get(key) ?? "",
      getAll: (key) => params.getAll(key),
    }
  }
  const renamed = (search: string) => withRenamedValues(queryOf(search), "type", RENAMED_POST_TYPES)

  it("maps each old name to a kind the filter lists", () => {
    expect([...RENAMED_POST_TYPES]).toEqual([["research", "explainer"], ["notes", "article"]])
    const listed = new Set<string>(kinds.map((t) => t.value))
    for (const [old, now] of RENAMED_POST_TYPES) {
      expect(listed.has(now), now).toBe(true)
      expect(listed.has(old), old).toBe(false)
    }
  })

  it("reads as the new kind for the chip and the panel, so the chip shows the label and an option is selected", () => {
    for (const [old, now] of RENAMED_POST_TYPES) {
      const query = renamed(`?type=${old}`)
      expect(query.get("type")).toBe(now)
      expect(query.getAll("type")).toEqual([now])
      expect(kinds.find((t) => t.value === query.getAll("type")[0])?.label).toBe(postTypeLabel(now))
    }
  })

  it("leaves a current kind, an unknown one and every other key as they are", () => {
    expect(renamed("?type=explainer").get("type")).toBe("explainer")
    expect(renamed("?type=constructor").get("type")).toBe("constructor")
    expect(renamed("").get("type")).toBe("")
    expect(renamed("").getAll("type")).toEqual([])
    const query = renamed("?type=research&tag=notes&tag=research&year=2026")
    expect(query.getAll("tag")).toEqual(["notes", "research"])
    expect(query.get("year")).toBe("2026")
  })
})
