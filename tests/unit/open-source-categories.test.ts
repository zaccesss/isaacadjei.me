import { describe, expect, it } from "vitest"
import { compareCategories, LAST_CATEGORY, UNCATEGORISED } from "@/lib/open-source-categories"

describe("open source category order", () => {
  it("keeps the fixed order, puts new names after it alphabetically, then Other, then my own tools", () => {
    const shuffled = [LAST_CATEGORY, "Zebra work", UNCATEGORISED, "Security and privacy", "Audio", "Linux kernel and embedded", "Drones and robotics"]
    expect([...shuffled].sort(compareCategories)).toEqual([
      "Linux kernel and embedded",
      "Drones and robotics",
      "Security and privacy",
      "Audio",
      "Zebra work",
      UNCATEGORISED,
      LAST_CATEGORY,
    ])
  })
})
